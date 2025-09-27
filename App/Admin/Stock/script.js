document.addEventListener('DOMContentLoaded', async () => {
    const addIngredientBtn = document.getElementById('addIngredientBtn');
    const modal = document.getElementById('ingredientModal');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('ingredientForm');
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('ingredientsTableBody');

    loadIngredients();
    addIngredientBtn.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Agregar Lote';
        form.reset();
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    searchInput.addEventListener('input', debounce(() => {
        loadIngredients(searchInput.value);
    }, 300));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        const id = document.getElementById('ingredientId').value;
        formData.append('nombre', document.getElementById('nombre').value);
        formData.append('stock', document.getElementById('stock').value);
        formData.append('medida', document.getElementById('medida').value);
        formData.append('caducidad', document.getElementById('caducidad').value);
        let endpoint = '';
        if (id) {
            formData.append('id', id);
            endpoint = '../BackEnd/editar.php';
        } else {
            endpoint = '../BackEnd/crear.php';
        }
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                modal.style.display = 'none';
                loadIngredients();
                alert(formData.id ? 'Lote actualizado con éxito' : 'Lote agregado con éxito');
            } else {
                alert(data.message || 'Error al procesar la solicitud');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la solicitud');
        }
    });
});


async function loadIngredients(searchTerm = '') {
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
            renderIngredients(data.ingredientes);
        } else {
            console.error('Error al cargar Lote:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


function renderIngredients(ingredientes) {
    const tableBody = document.getElementById('ingredientsTableBody');
    tableBody.innerHTML = '';

    ingredientes.forEach(ingrediente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ingrediente.nombre}</td>
            <td>${ingrediente.stock.toString().replace(/\./g, ',')} ${ingrediente.medida}</td>
            <td>${formatDate(ingrediente.caducidad)}</td>
            <td class="action-icons">
                <button class="edit-btn" onclick="editIngredient(${ingrediente.idIngrediente})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                    </svg>
                </button>
                <button class="delete-btn" onclick="deleteIngredient(${ingrediente.idIngrediente})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                    </svg>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}


async function editIngredient(id) {
    const formData = new FormData();
    formData.append('id', id);

    try {
        const response = await fetch('../BackEnd/obtener.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            const ingrediente = data.ingrediente;
            document.getElementById('modalTitle').textContent = 'Editar Ingrediente';
            document.getElementById('ingredientId').value = ingrediente.idIngrediente;
            document.getElementById('nombre').value = ingrediente.nombre;
            document.getElementById('stock').value = ingrediente.stock;
            document.getElementById('medida').value = ingrediente.medida;
            document.getElementById('caducidad').value = ingrediente.caducidad;
            
            document.getElementById('ingredientModal').style.display = 'block';
        } else {
            alert(data.message || 'Error al cargar el Lote');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar el Lote');
    }
}


async function deleteIngredient(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este Lote?')) return;

    const formData = new FormData();
    formData.append('id', id);

    try {
        const response = await fetch('../BackEnd/eliminar.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadIngredients();
            alert('Lote eliminado con éxito');
        } else {
            alert(data.message || 'Error al eliminar el Lote');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el Lote');
    }
}


function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
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
