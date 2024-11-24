const slider1 = document.getElementById('slider1');
const slider2 = document.getElementById('slider2');
const valorSpan1 = document.getElementById('valorSlider1');
const valorSpan2 = document.getElementById('valorSlider2');
const disjunta = document.getElementById('disjunta');
const flechaDerecha = document.getElementById('flechaDerecha');
const flechaIzquierda = document.getElementById('flechaIzquierda');
const dobleFlechaDerecha = document.getElementById('dobleFlechaDerecha');
const dobleFlechaIzquierda = document.getElementById('dobleFlechaIzquierda');
const restaurar = document.getElementById('restaurar');

slider1.addEventListener('input', function () {
    let valor = this.value;
    if (disjunta.checked) {
        valorSpan1.textContent = valor;
        slider1.value = valor;
    } else {
        valorSpan1.textContent = valor;
        valorSpan2.textContent = valor;
        slider1.value = valor;
        slider2.value = valor;

    }
    let primerPorcentaje = (10 / valor) * 10;
    let primerPorcentajeFloor = primerPorcentaje.toFixed(2);
    let segundoPorcentaje = 100 - primerPorcentajeFloor;
    videoPlayer.style.clipPath = `polygon(0% ${primerPorcentajeFloor}%, 100% ${primerPorcentajeFloor}%, 100% ${segundoPorcentaje}%, 0% ${segundoPorcentaje}%)`;
});

slider2.addEventListener('input', function () {
    let valor = this.value;
    if (disjunta.checked) {
        valorSpan2.textContent = valor;
        slider2.value = valor;
    } else {
        valorSpan1.textContent = valor;
        valorSpan2.textContent = valor;
        slider1.value = valor;
        slider2.value = valor;
    }
});

disjunta.addEventListener('change', function () {
    if (this.checked) {
        slider2.style.display = "block";
        valorSpan2.style.display = "block";
    } else {
        slider2.style.display = "none";
        valorSpan2.style.display = "none";
    }
});

flechaDerecha.addEventListener('click', function () {
    let valorSliderMas1 = (parseFloat(slider1.value) + 0.01).toFixed(2);;

    valorSpan1.textContent = valorSliderMas1;
    valorSpan2.textContent = valorSliderMas1;
    slider1.value = valorSliderMas1;
    slider2.value = valorSliderMas1;

    let primerPorcentaje = (10 / valorSliderMas1) * 10;
    let primerPorcentajeFloor = primerPorcentaje.toFixed(2);
    let segundoPorcentaje = 100 - primerPorcentajeFloor;
    videoPlayer.style.clipPath = `polygon(0% ${primerPorcentajeFloor}%, 100% ${primerPorcentajeFloor}%, 100% ${segundoPorcentaje}%, 0% ${segundoPorcentaje}%)`;
});

dobleFlechaDerecha.addEventListener('click', function () {
    let valorSliderMas1 = (parseFloat(slider1.value) + 0.10).toFixed(2);

    valorSpan1.textContent = valorSliderMas1;
    valorSpan2.textContent = valorSliderMas1;
    slider1.value = valorSliderMas1;
    slider2.value = valorSliderMas1;

    let primerPorcentaje = (10 / valorSliderMas1) * 10;
    let primerPorcentajeFloor = primerPorcentaje.toFixed(2);
    let segundoPorcentaje = 100 - primerPorcentajeFloor;
    videoPlayer.style.clipPath = `polygon(0% ${primerPorcentajeFloor}%, 100% ${primerPorcentajeFloor}%, 100% ${segundoPorcentaje}%, 0% ${segundoPorcentaje}%)`;
});

flechaIzquierda.addEventListener('click', function () {
    let valorSliderMenos1 = (parseFloat(slider1.value) - 0.01).toFixed(2);

    valorSpan1.textContent = valorSliderMenos1;
    valorSpan2.textContent = valorSliderMenos1;
    slider1.value = valorSliderMenos1;
    slider2.value = valorSliderMenos1;

    let primerPorcentaje = (10 / valorSliderMenos1) * 10;
    let primerPorcentajeFloor = primerPorcentaje.toFixed(2);
    let segundoPorcentaje = 100 - primerPorcentajeFloor;
    videoPlayer.style.clipPath = `polygon(0% ${primerPorcentajeFloor}%, 100% ${primerPorcentajeFloor}%, 100% ${segundoPorcentaje}%, 0% ${segundoPorcentaje}%)`;
});

dobleFlechaIzquierda.addEventListener('click', function () {
    let valorSliderMenos1 = (parseFloat(slider1.value) - 0.10).toFixed(2);

    valorSpan1.textContent = valorSliderMenos1;
    valorSpan2.textContent = valorSliderMenos1;
    slider1.value = valorSliderMenos1;
    slider2.value = valorSliderMenos1;

    let primerPorcentaje = (10 / valorSliderMenos1) * 10;
    let primerPorcentajeFloor = primerPorcentaje.toFixed(2);
    let segundoPorcentaje = 100 - primerPorcentajeFloor;
    videoPlayer.style.clipPath = `polygon(0% ${primerPorcentajeFloor}%, 100% ${primerPorcentajeFloor}%, 100% ${segundoPorcentaje}%, 0% ${segundoPorcentaje}%)`;
});

restaurar.addEventListener('click', function () {
    valorSpan1.textContent = "6";
    valorSpan2.textContent = "6";
    slider1.value = "6";
    slider2.value = "6";
    videoPlayer.style.clipPath = 'unset';
});

function recortar() {
    let nombre = containerTikFileName.textContent;
    let corte1 = slider1.value;
    let corte2 = slider2.value;

    const posicionUltimoSeparador = archivoPath.lastIndexOf("\\");
    const directorio = archivoPath.substring(0, posicionUltimoSeparador) + "\\";

    fetch('/recortar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ archivoPath, nombre, corte1, corte2, directorio })
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
