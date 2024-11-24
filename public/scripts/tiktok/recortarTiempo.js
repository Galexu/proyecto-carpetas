const casillaTiempo = document.getElementById('tiempo');
const interruptorTiempo = document.getElementById('interruptorLongitudMitad');

function tiempo() {
    let duracionSegundos = videoPlayer.duration;
    // if (duracionSegundos % 2 !== 0) {
    //     duracionSegundos -= 1;
    // }
    const minutos = Math.floor(duracionSegundos / 60);
    const segundos = (duracionSegundos % 60).toFixed(0);

    if (minutos > 0) {
        casillaTiempo.value = `${minutos}:${segundos}`;
    } else {
        casillaTiempo.value = `${segundos}`;
    }

    interruptorTiempo.addEventListener('change', function () {
        const duracionSegundosEntreDos = duracionSegundos / 2;
        const minutos2 = Math.floor(duracionSegundosEntreDos / 60);
        const segundos2 = (duracionSegundosEntreDos % 60).toFixed(0);

        if (this.checked) {
            if (minutos > 0) {
                casillaTiempo.value = `${minutos2}:${segundos2}`;
            } else {
                casillaTiempo.value = `${segundos2}`;
            }
        } else {
            if (minutos > 0) {
                casillaTiempo.value = `${minutos}:${segundos}`;
            } else {
                casillaTiempo.value = `${segundos}`;
            }
        }
    });
}

function cortarTiempo() {
    let nombre = containerTikFileName.textContent;
    let tiempoCorte = casillaTiempo.value;

    const posicionUltimoSeparador = archivoPath.lastIndexOf("\\");
    const directorio = archivoPath.substring(0, posicionUltimoSeparador) + "\\";

    fetch('/cortar-tiempo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ archivoPath, nombre, tiempoCorte, directorio })
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

