const giro = document.getElementById('giro');
const giroMitad = document.getElementById('giroMitad');
const resolucionHGiro = document.getElementById('resolucionHGiro');
const resolucionWGiro = document.getElementById('resolucionWGiro');

giro.addEventListener('change', function () {
    let valorSeleccionado = giro.value;
    switch (valorSeleccionado) {
        case "0":
            videoContenedor.style.transform = "rotate(90deg) scaleX(-1)";
            break;
        case "1":
            videoContenedor.style.transform = "rotate(90deg)";
            break;
        case "2":
            videoContenedor.style.transform = "rotate(-90deg)";
            break;
        case "3":
            videoContenedor.style.transform = "rotate(-90deg) scaleX(-1)";
            break;
        default:
            videoContenedor.style.transform = "none";
            break;
    }
});

giroMitad.addEventListener('change', function () {
    if (this.checked) {
        // casilla.textContent = `${width / 2}:${height / 2}`;
        casillaResolucionW.value = width / 2;
        casillaResolucionH.value = height / 2;
        resolucionHGiro.value = height / 2;
        resolucionWGiro.value = width / 2;
    } else {
        // casilla.textContent = `${width}:${height}`;
        casillaResolucionW.value = width;
        casillaResolucionH.value = height;
        resolucionHGiro.value = height;
        resolucionWGiro.value = width;
    }
});


function rotar() {
    let nombre = containerTikFileName.textContent;
    const posicionUltimoSeparador = archivoPath.lastIndexOf("\\");
    const directorio = archivoPath.substring(0, posicionUltimoSeparador) + "\\";

    // let giroM = giroMitad.checked ? true : false;
    let giroM = giroMitad.checked;
    let giroDireccion = giro.value;
    let resolucionHG = parseInt(resolucionHGiro.value);
    let resolucionHW = parseInt(resolucionWGiro.value);

    // console.log(giroM);

    fetch('/rotar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ archivoPath, nombre, giroM, giroDireccion, resolucionHW, resolucionHG, directorio })
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
