//declaramos cositas
const videoMetadata = document.querySelector('.video-metadata');
const videoContenedor = document.getElementById('video-container');
const videoPlayer = document.getElementById('video-player');
const videoSrc = document.getElementById('video-source');
const containerTikFileName = document.querySelector('.container-file-name');
let contadorVideos = document.querySelector('.video-count');
let identificadorActual = 0;
let video;
let archivoUrl;
let archivoPath;
let archivoTamanyo;
let archivoNombre;

//se ejecuta con su llamada en un onClick en cada <li> generado en el archivo server
//muestra el video seleccionado
function videoSeleccionado(identificador, operador) {
    let ultimoLi = document.querySelector('ul li:last-child');
    let primerLi = document.querySelector('ul li:first-child');
    let ultimoId = parseInt(ultimoLi.getAttribute('id'));
    let primerId = parseInt(primerLi.getAttribute('id'));
    identificador = parseInt(identificador);

    if (identificador < primerId || identificador > ultimoId) {
        console.log("saliste");
        return;
    }

    if (video != null) {
        video.classList.remove('liBorder');
    }
    video = document.getElementById(`${identificador}`);

    while (video == null && identificador > 0 && identificador <= ultimoId) {
        if (operador === "+") {
            while (identificador <= ultimoId && video == null) {
                video = document.getElementById(`${identificador + 1}`);
                identificador++;
            }
        } else if (operador === "-") {
            while (identificador >= primerId && video == null) {
                video = document.getElementById(`${identificador - 1}`);
                identificador--;
            }
        }
    }

    video.classList.add('liBorder');
    if (!dentroViewport(video)) {
        video.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    archivoUrl = video.dataset.fileurl;
    archivoTamanyo = video.dataset.filesize;
    archivoPath = video.dataset.path;

    let videoName = video.querySelector('p');
    archivoNombre = videoName.textContent;

    identificadorActual = identificador;

    videoSrc.src = archivoUrl;
    videoPlayer.load();
    videoContenedor.style.display = 'block';

    ajustarAlturaThumbnailGrid(true);

    videoMetadata.textContent = archivoTamanyo;

    containerTikFileName.textContent = archivoNombre;
    videoPlayer.addEventListener('loadeddata', obtenerResolucion);
}

function ajustarAlturaThumbnailGrid(a) {
    const folderContainer = document.querySelector('.folder_container');
    const thumbnailGrid = document.querySelector('.thumbnail-grid');
    const tok = document.querySelector('.tok');

    if (folderContainer && thumbnailGrid) {
        const viewportHeight = window.innerHeight;
        const folderContainerHeight = folderContainer.getBoundingClientRect().height;
        const remainingHeight = viewportHeight - folderContainerHeight;

        thumbnailGrid.style.maxHeight = `${remainingHeight}px`;
        thumbnailGrid.style.minHeight = `${remainingHeight}px`;
        tok.style.maxHeight = `${remainingHeight}px`;
        tok.style.minHeight = `${remainingHeight}px`;

        if (a) {
            const video = document.getElementById('video-player');
            let calculo = (remainingHeight * 95) / 100;
            video.style.maxHeight = `${calculo}px`;
        }
    }
}

function mostrarNombreAndPath() {
    const divNombreAndCarpeta = document.querySelector('.nombre-archivo-carpeta');
    const divNombreArchivo = document.querySelector('.nombre-archivo');
    const divNombreCarpeta = document.querySelector('.nombre-carpeta');

    divNombreArchivo.textContent = archivoNombre;
    divNombreCarpeta.textContent = archivoPath;

    if (divNombreAndCarpeta.style.display == "flex") {
        divNombreAndCarpeta.style.display = "none";
    } else {
        divNombreAndCarpeta.style.display = "flex";
    }
}

async function cambiarCarpeta2(event) {
    event.preventDefault(); // prevenir el menu contextual predeterminado
    let nuevaCarpeta = event.target.getAttribute('data-folder-path');

    divElegirCarpeta.style.display = 'none';
    const videoListContainer = document.getElementById('video-list');
    const folderListContainer = document.querySelector('.folder_container');
    const videoContador = document.querySelector('.video-count');
    const botonPadre = document.querySelector('.boton-padre');
    videoContador.innerHTML = "";
    videoListContainer.innerHTML = "";
    folderListContainer.innerHTML = "";
    videoListContainer.innerHTML = '<p>Loading...</p>';
    folderListContainer.innerHTML = '<p>Loading...</p>';

    try {
        const { listaVideoHtml, listaCarpetas, carpetaPadre, contadorVideos } = await asd(nuevaCarpeta);
        videoListContainer.innerHTML = listaVideoHtml;
        folderListContainer.innerHTML = listaCarpetas;
        videoContador.innerHTML = contadorVideos;
        botonPadre.setAttribute('data-folder-path', carpetaPadre);
    } catch (error) {
        console.error('Error fetching new folder:', error);
        videoListContainer.innerHTML = '<p>Error loading video list.</p>';
    }

    addHoverListeners();
    contadorVideos = "";
    contadorVideos = document.querySelector('.video-count');

    ajustarAlturaThumbnailGrid(true);
}

function buscarArchivo() {
    const buscadorContainer = document.querySelector('.barraBuscador');
    const computedStyle = window.getComputedStyle(buscadorContainer);

    if (computedStyle.display === 'none') {
        buscadorContainer.style.display = 'block';
    } else {
        buscadorContainer.style.display = 'none';
    }
}

document.getElementById('buscador').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const listItems = document.querySelectorAll('#video-list li');

    listItems.forEach(item => {
        const fileName = item.querySelector('p').textContent.toLowerCase();
        if (fileName.includes(query)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
});

























// --------------------------------- CEMENTERIO DE FUNCIONES --------------------------------------------------------------------------------------


// function serveEditor() {
//     fetch('/tiktok-editor')
//         .then(response => response.text())
//         .then(html => {
//             // Remove existing script tags
//             const existingScripts = document.querySelectorAll('script');
//             existingScripts.forEach(script => script.remove());

//             // Replace the HTML content
//             document.open();
//             document.write(html);
//             document.close();

//             // Extract and load new script tags
//             const tempDiv = document.createElement('div');
//             tempDiv.innerHTML = html;
//             const newScripts = tempDiv.querySelectorAll('script[type="module"]');
//             newScripts.forEach(script => {
//                 const newScript = document.createElement('script');
//                 newScript.type = 'module';
//                 newScript.src = script.src;
//                 document.body.appendChild(newScript);
//             });

//             console.log("Nuevo editor cargado");
//         })
//         .catch(error => {
//             console.error('Error al cargar el nuevo editor:', error);
//         });
// }








// function handleDrop(event) {
//     event.preventDefault();
//     event.stopPropagation();
//     const filePath = event.dataTransfer.getData('text/path');
//     const folderPath = event.target.getAttribute('data-folder-path');
//     const newPath = `${folderPath}\\${filePath.split('\\').pop()}`;

//     // console.log(JSON.stringify({filePath, newPath}));
//     moveFile(filePath, newPath);
// }

// document.addEventListener('DOMContentLoaded', () => {
//     // Add event listeners for drag and drop
//     document.querySelectorAll('[ondrop]').forEach(element => {
//         element.addEventListener('drop', handleDrop);
//         element.addEventListener('dragover', allowDrop);
//         element.addEventListener('dragleave', handleDragLeave);
//     });
// });



// para addEventListeners ya que los lis cargan dinamicamente y no estan
// al comienzo de la carga del dom
/* 
The code snippet you provided will only catch elements that are already present in the DOM 
at the time it is executed. If your <li> elements are loaded asynchronously from the server, 
this code will not attach event listeners to those elements because they are not present in the DOM when the script runs.

To handle elements that are loaded dynamically, you can use event delegation.This involves attaching the event listeners 
to a parent element that is present in the DOM when the script runs.The event listeners will then handle events that bubble
 up from the dynamically added elements.
Here is how you can modify your code to use event delegation:

document.addEventListener('DOMContentLoaded', () => {
    const parentElement = document.getElementById('video-list'); // Replace with the actual parent element ID

    parentElement.addEventListener('dragstart', (event) => {
        if (event.target && event.target.matches('[draggable="true"]')) {
            handleDragStart(event);
        }
    });

    parentElement.addEventListener('dragend', (event) => {
        if (event.target && event.target.matches('[draggable="true"]')) {
            handleDragEnd(event);
        }
    });

    parentElement.addEventListener('drop', (event) => {
        if (event.target && event.target.matches('[draggable="true"]')) {
            handleDrop(event);
        }
    });
});
*/