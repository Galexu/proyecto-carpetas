document.addEventListener('DOMContentLoaded', async () => {
    await llamada();

    // document.querySelectorAll('li').forEach(li => {
    //     li.addEventListener('contextmenu', async (event) => {
    //         event.preventDefault();
    //         console.log('click derecho');

    //         li.classList.remove('asd');
    //         li.classList.add('onTop');
    //     });
    // });
});

async function llamada() {
    await llamadaVideos();
    await llamadaCarpetas();
    addHoverListeners();
}

function dentroViewport(elemento) {
    const e = elemento.getBoundingClientRect();
    return (
        e.top >= 0 &&
        e.left >= 0 &&
        e.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        e.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function cambiarTema() {
    document.documentElement.classList.toggle('dark-theme');
}

function copiarAlClipboard(selector) {
    const element = document.querySelector(selector);
    const text = element.textContent || element.innerText;

    navigator.clipboard.writeText(text);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


