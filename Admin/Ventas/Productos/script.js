document.addEventListener('DOMContentLoaded', () => {
    const addProductBtn = document.getElementById('addProductBtn');
    const productModal = document.getElementById('productModal');
    const closeButtons = document.querySelectorAll('.close');
    const productForm = document.getElementById('productForm');
    const searchInput = document.getElementById('searchInput');
    const addStepBtn = document.getElementById('addStepBtn');
    const ingredientsList = document.getElementById('ingredientsList');
    const recipeSteps = document.getElementById('recipeSteps');
    const ingredientSelect = document.getElementById('ingredientSelect');
    const ingredientAmount = document.getElementById('ingredientAmount');
    const addIngredientToListBtn = document.querySelector('.add-ingredient-btn');

    loadExistingIngredients();
    loadProducts();

    addProductBtn.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Agregar Producto';
        productForm.reset();
        clearDynamicElements();
        productModal.style.display = 'block';
    });

    addIngredientToListBtn.addEventListener('click', () => {
        const selectedIngredient = ingredientSelect.options[ingredientSelect.selectedIndex];
        const amount = ingredientAmount.value;

        if (!selectedIngredient.value || !amount) {
            alert('Por favor seleccione un ingrediente y especifique la cantidad');
            return;
        }

        addIngredientToList({
            idIngrediente: selectedIngredient.value,
            nombre: selectedIngredient.text,
            medida: selectedIngredient.dataset.medida,
            cantidad: amount
        });

        ingredientSelect.value = '';
        ingredientAmount.value = '';
    });

    async function loadExistingIngredients() {
        try {
            const response = await fetch('../BackEnd/obtenerIngredientes.php');
            const data = await response.json();
            
            if (data.success) {
                ingredientSelect.innerHTML = '<option value="">Seleccione un ingrediente...</option>';
                data.ingredientes.forEach(ingrediente => {
                    const option = document.createElement('option');
                    option.value = ingrediente.idIngrediente;
                    option.text = ingrediente.nombre;
                    option.dataset.medida = ingrediente.medida;
                    ingredientSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar ingredientes:', error);
        }
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            productModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.style.display = 'none';
        }
    });

    searchInput.addEventListener('input', debounce(() => {
        loadProducts(searchInput.value);
    }, 300));

    addStepBtn.addEventListener('click', () => {
        const stepItem = createStepItem('');
        recipeSteps.appendChild(stepItem);
        makeStepsSortable();
    });

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        const id = document.getElementById('productId').value;
        formData.append('nombre', document.getElementById('nombre').value);
        formData.append('precio', document.getElementById('precio').value);

        const ingredientes = [];
        document.querySelectorAll('.ingredient-item').forEach(item => {
            ingredientes.push({
                id: item.dataset.ingredientId,
                cantidad: item.dataset.cantidad
            });
        });

        if (ingredientes.length === 0) {
            alert('Debe agregar al menos un ingrediente al producto');
            return;
        }

        formData.append('ingredientes', JSON.stringify(ingredientes));

        const pasos = [];
        document.querySelectorAll('.step-item').forEach(item => {
            const paso = item.querySelector('input[type="text"]').value;
            if (paso.trim()) {
                pasos.push(paso);
            }
        });

        if (pasos.length === 0) {
            alert('Debe agregar al menos un paso a la receta');
            return;
        }

        formData.append('pasos', JSON.stringify(pasos));

        let endpoint = id ? '../BackEnd/editar.php' : '../BackEnd/crear.php';
        if (id) formData.append('id', id);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                productModal.style.display = 'none';
                loadProducts();
                alert(id ? 'Producto actualizado con éxito' : 'Producto agregado con éxito');
            } else {
                alert(data.message || 'Error al procesar la solicitud');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la solicitud');
        }
    });
});

async function loadProducts(searchTerm = '') {
    const formData = new FormData();
    if (searchTerm) {
        formData.append('search', searchTerm);
    }

    try {
        const response = await fetch('../BackEnd/leer.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            renderProducts(data.productos);
        } else {
            console.error('Error al cargar productos:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderProducts(productos) {
    const tableBody = document.getElementById('productsTableBody');
    tableBody.innerHTML = '';

    productos.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto.nombre}</td>
            <td>$${producto.precio}</td>
            <td>${producto.calificacionPromedio || 'Sin calificaciones'}</td>
            <td>${producto.ingredientes.map(i => `${i.nombre} (${i.cantidad} ${i.medida})`).join(', ')}</td>
            <td class="action-icons">
                <button class="details-btn" onclick="viewProductDetails(${producto.idProducto})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                    </svg>
                </button>
                <button class="edit-btn" onclick="editProduct(${producto.idProducto})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                    </svg>
                </button>
                <button class="delete-btn" onclick="deleteProduct(${producto.idProducto})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                    </svg>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function addIngredientToList(ingrediente) {
    const existingIngredient = document.querySelector(`.ingredient-item[data-ingredient-id="${ingrediente.idIngrediente}"]`);
    if (existingIngredient) {
        alert('Este ingrediente ya ha sido agregado');
        return;
    }

    const item = document.createElement('div');
    item.className = 'ingredient-item';
    item.dataset.ingredientId = ingrediente.idIngrediente;
    item.dataset.cantidad = ingrediente.cantidad;
    item.innerHTML = `
        <div class="ingredient-info">
            <span>${ingrediente.nombre} (${ingrediente.cantidad} ${ingrediente.medida})</span>
        </div>
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>
    `;
    document.getElementById('ingredientsList').appendChild(item);
}

async function editProduct(id) {
    const formData = new FormData();
    formData.append('id', id);

    try {
        const response = await fetch('../BackEnd/obtener.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            const producto = data.producto;
            document.getElementById('modalTitle').textContent = 'Editar Producto';
            document.getElementById('productId').value = producto.idProducto;
            document.getElementById('nombre').value = producto.nombre;
            document.getElementById('precio').value = producto.precio;
            
            clearDynamicElements();
            
            producto.ingredientes.forEach(ingrediente => {
                addIngredientToList(ingrediente);
            });

            producto.pasos.forEach(paso => {
                const stepItem = createStepItem(paso.paso);
                recipeSteps.appendChild(stepItem);
            });

            makeStepsSortable();
            document.getElementById('productModal').style.display = 'block';
        } else {
            alert(data.message || 'Error al cargar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar el producto');
    }
}

async function deleteProduct(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    const formData = new FormData();
    formData.append('id', id);

    try {
        const response = await fetch('../BackEnd/eliminar.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadProducts();
            alert('Producto eliminado con éxito');
        } else {
            alert(data.message || 'Error al eliminar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el producto');
    }
}

function clearDynamicElements() {
    document.getElementById('ingredientsList').innerHTML = '';
    document.getElementById('recipeSteps').innerHTML = '';
}

function createStepItem(paso) {
    const item = document.createElement('div');
    item.className = 'step-item';
    item.draggable = true;
    item.innerHTML = `
        <span class="step-handle">≡</span>
        <input type="text" value="${paso}" placeholder="Describe el paso" required>
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>
    `;
    return item;
}

function makeStepsSortable() {
    const container = document.getElementById('recipeSteps');
    const items = container.getElementsByClassName('step-item');

    Array.from(items).forEach(item => {
        item.addEventListener('dragstart', () => {
            item.classList.add('dragging');
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
    });

    container.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.step-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function viewProductDetails(productId) {
    const formData = new FormData();
    formData.append('productId', productId);
    
    try {
        const response = await fetch('../BackEnd/obtenerDetalles.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            const producto = data.producto;
            
            const detailsModal = document.createElement('div');
            detailsModal.className = 'modal';
            detailsModal.id = 'detailsModal';
            
            const content = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Detalles del Producto</h2>
                    <div class="product-details">
                        <div class="detail-section">
                            <h3>Información General</h3>
                            <p><strong>Nombre:</strong> ${producto.nombre}</p>
                            <p><strong>Precio:</strong> $${producto.precio}</p>
                            <p><strong>Calificación:</strong> ${producto.calificacionPromedio || 'Sin calificaciones'}</p>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Ingredientes</h3>
                            <ul>
                                ${producto.ingredientes.map(i => `
                                    <li>${i.nombre} - ${i.cantidad} ${i.medida}</li>
                                `).join('')}
                            </ul>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Pasos de Preparación</h3>
                            <ol>
                                ${producto.pasos.map(paso => `
                                    <li>${paso.descripcion}</li>
                                `).join('')}
                            </ol>
                        </div>
                    </div>
                </div>
            `;
            
            detailsModal.innerHTML = content;
            document.body.appendChild(detailsModal);
            
            detailsModal.style.display = 'block';
            const closeBtn = detailsModal.querySelector('.close');
            closeBtn.onclick = function() {
                detailsModal.remove();
            }
            
            window.onclick = function(event) {
                if (event.target == detailsModal) {
                    detailsModal.remove();
                }
            }
        } else {
            console.error('Error al cargar detalles del producto:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
