const casillaResolucionW = document.getElementById('resolucionW');
const casillaResolucionH = document.getElementById('resolucionH');
const interruptorM = document.getElementById('interruptorMitad');
const interruptorD = document.getElementById('interruptorDoble');
let width;
let height;

function obtenerResolucion() {
    width = videoPlayer.videoWidth;
    height = videoPlayer.videoHeight;

    tiempo();
    // casilla.textContent = `${width}:${height}`;
    casillaResolucionW.value = width;
    casillaResolucionH.value = height;

    interruptorM.addEventListener('change', function () {
        if (this.checked) {
            // casilla.textContent = `${width / 2}:${height / 2}`;
            casillaResolucionW.value = width / 2;
            casillaResolucionH.value = height / 2;
        } else {
            // casilla.textContent = `${width}:${height}`;
            casillaResolucionW.value = width;
            casillaResolucionH.value = height;
        }
    });

    interruptorD.addEventListener('change', function () {
        if (this.checked) {
            // casilla.textContent = `${width * 2}:${height * 2}`;
            casillaResolucionW.value = width * 2;
            casillaResolucionH.value = height * 2;
        } else {
            // casilla.textContent = `${width}:${height}`;
            casillaResolucionW.value = width;
            casillaResolucionH.value = height;
        }
    });
}

function escalar() {
    let nombre = containerTikFileName.textContent;
    let resoW = parseInt(casillaResolucionW.value);
    let resoH = parseInt(casillaResolucionH.value);

    const posicionUltimoSeparador = archivoPath.lastIndexOf("\\");
    const directorio = archivoPath.substring(0, posicionUltimoSeparador) + "\\";

    fetch('/escalar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ archivoPath, nombre, resoW, resoH, directorio })
    })
        .then(response => response.text())
        .then(message => {
            sleep(500).then(() => {
                tikTok();
                llamada();
                restaurarTok();
            });
        })
        .catch(error => {
            console.error('Error creating folder:', error);
        });
}

