document.addEventListener('DOMContentLoaded', () => {
    const addProductBtn = document.getElementById('addProductBtn');
    const productModal = document.getElementById('productModal');
    const closeButtons = document.querySelectorAll('.close');
    const productForm = document.getElementById('productForm');
    const searchInput = document.getElementById('searchInput');
    const ingredientsList = document.getElementById('ingredientsList');
    const ingredientSelect = document.getElementById('ingredientSelect');
    const ingredientAmount = document.getElementById('ingredientAmount');
    const addIngredientToListBtn = document.querySelector('.add-ingredient-btn');

    loadExistingIngredients();
    loadCategories();
    loadProducts();

    addProductBtn.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Agregar Producto';
        productForm.reset();
        clearDynamicElements();
        productModal.style.display = 'flex';
    });

    addIngredientToListBtn.addEventListener('click', () => {
        const selectedIngredient = ingredientSelect.options[ingredientSelect.selectedIndex];
        const amount = ingredientAmount.value;

        if (!selectedIngredient.value || !amount) {
            alert('Por favor seleccione un ingrediente y especifique la cantidad');
            return;
        }

        addIngredientToList({
            stock_id: selectedIngredient.value,
            stock_nombre: selectedIngredient.text,
            consume_medida: selectedIngredient.dataset.medida,
            consume_cantidad: amount
        });

        ingredientSelect.value = '';
        ingredientAmount.value = '';
    });

    async function loadExistingIngredients() {
        try {
            const response = await fetch('../BackEnd/obtenerStock.php');
            const data = await response.json();

            if (data.success) {
                ingredientSelect.innerHTML = '<option value="">Seleccione un insumo...</option>';
                data.stock.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.stock_id;
                    // Mostrar nombre con cantidad total disponible y medida
                    const cantidadTotal = parseFloat(item.cantidad_total || 0).toFixed(2);
                    option.text = `${item.stock_nombre} (${cantidadTotal} ${item.stock_medida} disponibles)`;
                    option.dataset.medida = item.stock_medida;
                    option.dataset.nombre = item.stock_nombre;
                    ingredientSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar ingredientes:', error);
        }
    }

    async function loadCategories() {
        try {
            const res = await fetch('../BackEnd/listarCategorias.php');
            const data = await res.json();
            if (data.success) {
                const dl = document.getElementById('categoryList');
                dl.innerHTML = '';
                data.categorias.forEach(cat => {
                    const opt = document.createElement('option');
                    opt.value = cat;
                    dl.appendChild(opt);
                });
            }
        } catch (e) {
            console.error('Error al cargar categorías', e);
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

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();

        const id = document.getElementById('productId').value;
        const imageInput = document.getElementById('productImage');

        // Add basic form data
        formData.append('nombre', document.getElementById('nombre').value);
        formData.append('precio', document.getElementById('precio').value);
        formData.append('categoria', document.getElementById('categoria').value || '');
        formData.append('tiempo_preparacion', document.getElementById('tiempo_preparacion').value || '');
        formData.append('descripcion', document.getElementById('descripcion').value || '');
        formData.append('receta', document.getElementById('receta').value || '');

        // Add ingredients
        const ingredientes = [];
        document.querySelectorAll('.ingredient-item').forEach(item => {
            ingredientes.push({
                stock_id: item.dataset.stockId,
                cantidad: item.dataset.cantidad,
                medida: item.dataset.medida || ''
            });
        });

        if (ingredientes.length === 0) {
            alert('Debe agregar al menos un ingrediente al producto');
            return;
        }

        formData.append('ingredientes', JSON.stringify(ingredientes));

        // Add image file if selected
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            if (file.size > 2 * 1024 * 1024) {
                alert('La imagen no debe pesar más de 2MB');
                return;
            }
            formData.append('imagen', file);
        }

        let endpoint = id ? '../BackEnd/editar.php' : '../BackEnd/crear.php';
        if (id) formData.append('id', id);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
                // Don't set Content-Type header, let the browser set it with the boundary
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
        const imageUrl = producto.imagen_url || '';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="producto-imagen" style="width: 40px; height: 40px; border-radius: 4px; background-image: url('${imageUrl}'); background-size: cover; background-position: center;"></div>
                    <span>${producto.producto_nombre}</span>
                </div>
            </td>
            <td>$${producto.producto_precio}</td>
            <td>${producto.producto_calificacion ?? 'Sin calificaciones'}</td>
            <td class="acciones">
                <button class="btn-menu" onclick="toggleMenu(this)">⋮</button>
                <div class="menu-opciones">
                    <div class="opcion" onclick="viewProductDetails(${producto.producto_id})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                        </svg>
                        Ver Detalles
                    </div>
                    <div class="opcion" onclick="editProduct(${producto.producto_id})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                        </svg>
                        Editar
                    </div>
                    <div class="opcion eliminar" onclick="deleteProduct(${producto.producto_id})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                        </svg>
                        Eliminar
                    </div>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function addIngredientToList(ingrediente) {
    const existingIngredient = document.querySelector(`.ingredient-item[data-stock-id="${ingrediente.stock_id}"]`);
    if (existingIngredient) {
        alert('Este ingrediente ya ha sido agregado');
        return;
    }

    const item = document.createElement('div');
    item.className = 'ingredient-item';
    item.dataset.stockId = ingrediente.stock_id;
    item.dataset.cantidad = ingrediente.consume_cantidad;
    if (ingrediente.consume_medida) item.dataset.medida = ingrediente.consume_medida;
    item.innerHTML = `
        <div class="ingredient-info">
            <span>${ingrediente.stock_nombre} (${ingrediente.consume_cantidad} ${ingrediente.consume_medida || ''})</span>
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
            document.getElementById('productId').value = producto.producto_id;
            document.getElementById('nombre').value = producto.producto_nombre;
            document.getElementById('precio').value = producto.producto_precio;
            document.getElementById('categoria').value = producto.producto_categoria || '';
            document.getElementById('tiempo_preparacion').value = producto.producto_tiempo_preparacion || '';
            document.getElementById('receta').value = producto.producto_receta || '';

            clearDynamicElements();

            producto.ingredientes.forEach(ingrediente => addIngredientToList(ingrediente));
            document.getElementById('productModal').style.display = 'flex';
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
    const rs = document.getElementById('recipeSteps');
    if (rs) rs.innerHTML = '';
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
            console.log(producto);
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
                            <p><strong>Nombre:</strong> ${producto.producto_nombre}</p>
                            <p><strong>Precio:</strong> $${producto.producto_precio}</p>
                            <p><strong>Categoría:</strong> ${producto.producto_categoria || '—'}</p>
                            <p><strong>Tiempo de preparación:</strong> ${producto.producto_tiempo_preparacion || '—'}</p>
                            <p><strong>Calificación:</strong> ${producto.producto_calificacion ?? 'Sin calificaciones'}</p>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Ingredientes</h3>
                            <ul>
                                ${producto.ingredientes.map(i => `
                                    <li>${i.stock_nombre} - ${i.consume_cantidad} ${i.consume_medida || ''}</li>
                                `).join('')}
                            </ul>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Receta</h3>
                            <pre style="white-space: pre-wrap;">${(producto.producto_receta || '').trim() || '—'}</pre>
                        </div>
                        <img src="${producto.imagen_url}" alt="Foto producto">
                    </div>
                </div>
            `;

            detailsModal.innerHTML = content;
            document.body.appendChild(detailsModal);

            detailsModal.style.display = 'flex';
            const closeBtn = detailsModal.querySelector('.close');
            closeBtn.onclick = function () {
                detailsModal.remove();
            }

            window.onclick = function (event) {
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

// Función para manejar el menú de tres puntos
function toggleMenu(btn) {
    document.querySelectorAll('.menu-opciones').forEach(menu => {
        if (menu !== btn.nextElementSibling) menu.style.display = 'none';
    });

    const menu = btn.nextElementSibling;
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

document.addEventListener('click', function (e) {
    if (!e.target.closest('.acciones')) {
        document.querySelectorAll('.menu-opciones').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});
