let delay = false;
document.addEventListener('mouseup', function (event) {
    event.preventDefault();
    if (delay) return;

    delay = true;
    setTimeout(() => {
        switch (event.button) {
            case 1:
                // event.preventDefault();
                moverBorrar();
                break;
            case 3:
                // event.preventDefault();
                videoSeleccionado(parseInt(identificadorActual) - 1, "-");
                break;
            case 4:
                // event.preventDefault();
                videoSeleccionado(parseInt(identificadorActual) + 1, "+");
                break;
        }
        delay = false;
    }, 100);
});

document.addEventListener('mousedown', function (event) {
    if (event.button === 1) {
        event.preventDefault();
    }
});


document.addEventListener('keydown', (event) => {
    let buscadorCerrado = window.getComputedStyle(document.querySelector('.barraBuscador')).display === 'none' ? true : false;

    if (buscadorCerrado) {
        let videoPaFull = document.querySelector('video');
        if (event.key === 'f') document.fullscreenElement ? document.exitFullscreen() : videoPaFull.requestFullscreen();

        let thumbnailGrid = document.querySelector('.thumbnail-grid');
        if (thumbnailGrid) {
            if (event.key === 's') thumbnailGrid.scrollBy(0, 150);
            if (event.key === 'w') thumbnailGrid.scrollBy(0, -150);
        }

        if (event.key === 'r') {
            const variado = document.querySelector('.variado');
            const computedStyle = window.getComputedStyle(variado);
            if (computedStyle.display === "flex") {
                variado.style.display = "none";
            } else {
                variado.style.display = "flex";
            }
        }

        if (event.key === 'q') videoSeleccionado(parseInt(identificadorActual) - 1, "-");

        if (event.key === 'e') videoSeleccionado(parseInt(identificadorActual) + 1, "+");

        if (event.key === 't') {
            document.body.focus();
            event.preventDefault();
            const videoElement = document.querySelector('video');
            if (videoElement) {
                videoElement.blur();
            }
            tikTok();
        }

        if (event.key === 'Delete') {
            moverBorrar();
        }
        if (event.key === 'Enter') {
            event.preventDefault();
        }

        const videoElement = document.querySelector('video');
        if (videoElement) {
            if (event.key === 'ArrowRight' || event.key === 'd') {
                videoElement.currentTime += 5;
            }
            if (event.key === 'ArrowLeft' || event.key === 'a') {
                videoElement.currentTime -= 5;
            }
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                videoElement.volume = Math.min(videoElement.volume + 0.1, 1);
            }
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                videoElement.volume = Math.max(videoElement.volume - 0.1, 0);
            }
            if (event.key === 'm') {
                videoElement.muted = !videoElement.muted;
            }
            if (event.key === ' ') {
                event.preventDefault();
                if (videoElement.paused) {
                    videoElement.play();
                } else {
                    videoElement.pause();
                }
            }
        }
    }
});