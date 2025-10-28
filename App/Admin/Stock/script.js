document.addEventListener('DOMContentLoaded', async () => {
    const addIngredientBtn = document.getElementById('addIngredientBtn');
    const modal = document.getElementById('ingredientModal');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('ingredientForm');
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('ingredientsTableBody');
    const nombreInput = document.getElementById('nombre');
    const medidaSelect = document.getElementById('medida');
    const medidaInfo = document.getElementById('medidaInfo');
    const medidaInfoText = document.getElementById('medidaInfoText');

    let ingredientesExistentes = [];

    loadIngredients();
    loadIngredientesUnicos();

    nombreInput.addEventListener('input', () => {
        const nombreIngresado = nombreInput.value.trim();
        const ingredienteExistente = ingredientesExistentes.find(
            ing => ing.nombre.toLowerCase() === nombreIngresado.toLowerCase()
        );

        if (ingredienteExistente) {
            medidaSelect.value = ingredienteExistente.medida;
            medidaSelect.disabled = true;
            medidaInfo.style.display = 'block';
            medidaInfoText.textContent = `Este ingrediente ya existe y usa la medida: ${getMedidaNombre(ingredienteExistente.medida)}`;
        } else {
            if (!document.getElementById('ingredientId').value) {
                medidaSelect.disabled = false;
            }
            medidaInfo.style.display = 'none';
        }
    });

    addIngredientBtn.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Agregar Lote';
        form.reset();
        medidaSelect.disabled = false;
        medidaInfo.style.display = 'none';
        loadIngredientesUnicos(); // Recargar lista
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        resetModalState();
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            resetModalState();
        }
    });

    function resetModalState() {
        document.getElementById('nombre').disabled = false;
        document.getElementById('medida').disabled = false;
        medidaInfo.style.display = 'none';
    }

    searchInput.addEventListener('input', debounce(() => {
        loadIngredients(searchInput.value);
    }, 300));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nombreInput = document.getElementById('nombre');
        const medidaSelect = document.getElementById('medida');
        const nombreDisabled = nombreInput.disabled;
        const medidaDisabled = medidaSelect.disabled;
        
        nombreInput.disabled = false;
        medidaSelect.disabled = false;
        
        const formData = new FormData();
        const id = document.getElementById('ingredientId').value;
        formData.append('nombre', nombreInput.value);
        formData.append('stock', document.getElementById('stock').value);
        formData.append('medida', medidaSelect.value);
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
                resetModalState();
                loadIngredients();
                loadIngredientesUnicos(); // Recargar lista de ingredientes únicos
                alert(id ? 'Lote actualizado con éxito' : 'Lote agregado con éxito');
            } else {
                alert(data.message || 'Error al procesar la solicitud');
                nombreInput.disabled = nombreDisabled;
                medidaSelect.disabled = medidaDisabled;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la solicitud');
            nombreInput.disabled = nombreDisabled;
            medidaSelect.disabled = medidaDisabled;
        }
    });

    async function loadIngredientesUnicos() {
        try {
            const response = await fetch('../BackEnd/obtenerIngredientesUnicos.php');
            const data = await response.json();
            
            if (data.success) {
                ingredientesExistentes = data.ingredientes;
                const datalist = document.getElementById('ingredientesExistentes');
                datalist.innerHTML = '';
                
                data.ingredientes.forEach(ing => {
                    const option = document.createElement('option');
                    option.value = ing.nombre;
                    option.textContent = `${ing.nombre} (${getMedidaNombre(ing.medida)})`;
                    datalist.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar ingredientes únicos:', error);
        }
    }

    function getMedidaNombre(medida) {
        const medidas = {
            'g': 'Gramos',
            'kg': 'Kilogramos',
            'ml': 'Mililitros',
            'L': 'Litros',
            'u': 'Unidades'
        };
        return medidas[medida] || medida;
    }
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
            <td class="acciones">
                <button class="btn-menu" onclick="toggleMenu(this)">⋮</button>
                <div class="menu-opciones">
                    <div class="opcion" onclick="editIngredient(${ingrediente.idIngrediente})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                        </svg>
                        Editar
                    </div>
                    <div class="opcion eliminar" onclick="deleteIngredient(${ingrediente.idIngrediente})">
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
            document.getElementById('modalTitle').textContent = 'Editar Lote';
            document.getElementById('ingredientId').value = ingrediente.idIngrediente;
            document.getElementById('nombre').value = ingrediente.nombre;
            document.getElementById('stock').value = ingrediente.stock;
            document.getElementById('medida').value = ingrediente.medida;
            document.getElementById('caducidad').value = ingrediente.caducidad;
            
            document.getElementById('nombre').disabled = true;
            document.getElementById('medida').disabled = true;
            
            const medidaInfo = document.getElementById('medidaInfo');
            const medidaInfoText = document.getElementById('medidaInfoText');
            medidaInfo.style.display = 'block';
            medidaInfoText.textContent = 'Al editar un lote, no se puede cambiar el nombre ni la medida.';
            
            document.getElementById('ingredientModal').style.display = 'flex';
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
