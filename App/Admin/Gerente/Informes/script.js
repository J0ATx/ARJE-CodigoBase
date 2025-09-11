const fechaInicio = document.getElementById('fechaInicio');
const fechaFin = document.getElementById('fechaFin');
const generarInformeBtn = document.getElementById('generarInforme');
const previsualizarDoc = document.getElementById('previsualizar');
const doc = document.getElementById('doc');

generarInformeBtn.addEventListener('click', () => {
    previsualizarDoc.innerHTML = '';
    let formData = new FormData();

    formData.append('inicio', fechaInicio.value);
    formData.append('fin', fechaFin.value);

    fetch('../Backend/generarInforme.php', {
        method: 'POST',
        body: formData
    }).then(res => res.json())
    .then(data => {
        // doc.innerHTML = data;
        // previsualizarDoc.appendChild(doc);
        // let descargar = document.createElement('button');
        // descargar.id = 'descargarPDF';
        // descargar.textContent = 'Descargar a PDF';
        // previsualizarDoc.appendChild(descargar);
        
        // descargar.addEventListener('click', () => {
        //     let datos = "hola";

        //     fetch('../Backend/descargar.php', {
        //         method: 'POST',
        //         body: datos
        //     })
        // });
        if (data.mensaje) {
            console.log('Mensaje:', data.mensaje);
        } else if (data.error) {
            console.error('Error:', data.error);
        } else {
            console.log('Respuesta desconocida:', data);
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });
});