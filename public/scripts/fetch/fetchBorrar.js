function borrar(path) {
    fetch('/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path })
    })
        .then(response => response.text())
        .then(message => {
            console.log(message);
        })
        .catch(error => {
            console.error('Error moving file:', error);
        });
}

function moverBorrar() {
    video.remove();

    borrar(archivoPath);
    contadorVideos.textContent = parseInt(contadorVideos.textContent) - 1;
    videoSeleccionado((parseInt(identificadorActual) + 1), "+");
}
