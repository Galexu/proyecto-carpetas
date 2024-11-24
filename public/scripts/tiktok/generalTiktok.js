function tikTok() {
    const tok = document.querySelector(".tok");
    const thumbnailGrid = document.querySelector(".thumbnail-grid");
    const computedStyle = window.getComputedStyle(tok);

    if (computedStyle.display === "none") {
        thumbnailGrid.style.display = "none";
        tok.style.display = "flex";
    } else {
        tok.style.display = "none";
        thumbnailGrid.style.display = "grid";
    }
}

const containerFileName = document.querySelector('.container-file-name');
const fileNameEditor = document.querySelector('.file-name-editor');
const fileNameEditorInput = document.querySelector('.file-name-editor input');

containerFileName.addEventListener('click', function () {
    fileNameEditor.style.display = 'block';
    fileNameEditorInput.value = containerFileName.textContent;
    fileNameEditorInput.focus();

    // selecciona donde poner el cursor en el texto
    fileNameEditorInput.setSelectionRange(0, 0);
});

fileNameEditorInput.addEventListener('blur', function () {
    fileNameEditor.style.display = 'none';
    containerFileName.textContent = fileNameEditorInput.value;
});

fileNameEditorInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        fileNameEditor.style.display = 'none';
        containerFileName.textContent = fileNameEditorInput.value;
    }
});


const loader = document.querySelectorAll('.loader');
loader.forEach(element => {
    element.addEventListener('click', function () {
        // video.pause();
        document.querySelector('.cargando-contenedor').style.display = 'block';
        // let audio = document.getElementById("audio");
        // audio.play();
    });
});

function restaurarTok() {
    interruptorM.checked = false;
    interruptorD.checked = false;
    giroMitad.checked = false;
    giro.selectedIndex = 0;
    videoContenedor.style.transform = "none";
    valorSpan1.textContent = "6";
    valorSpan2.textContent = "6";
    slider1.value = "6";
    slider2.value = "6";
    videoPlayer.style.clipPath = 'unset';
    document.querySelector('.cargando-contenedor').style.display = 'none';
    interruptorTiempo.checked = false;
}