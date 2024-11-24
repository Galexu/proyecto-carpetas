function moverArchivo(event) {
    const folderPath = event.target.getAttribute('data-folder-path');
    const newPath = `${folderPath}\\${archivoPath.split('\\').pop()}`;

    video.remove();

    moveFile(archivoPath, newPath);
    contadorVideos.textContent = parseInt(contadorVideos.textContent) - 1;
    videoSeleccionado((parseInt(identificadorActual) + 1), "+");
}

async function moveFile(oldPath, newPath, overwrite = false) {
    // fetch('/move-file', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ oldPath, newPath })
    // })
    //     .then(response => response.text())
    //     .then(message => {
    //         console.log(message);
    //     })
    //     .catch(error => {
    //         console.error('Error moving file:', error);
    //     });

    const respuesta = await fetch('/move-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldPath: oldPath,
            newPath: newPath
        })
    });

    let xd = await respuesta.text();
    console.log(xd)
    if (xd == "1") {
        overwrite = confirm('The file already exists at the destination. Do you want to overwrite it?');
        if (overwrite) {
            await fetch('/overwrite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    oldPath: oldPath,
                    newPath: newPath
                })
            });
        }
    }
}

// async function moveFile(oldPath, newPath) {
//     const overwrite = confirm('The file already exists at the destination. Do you want to overwrite it?');

//     const response = await fetch('/move-file', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             oldPath: oldPath,
//             newPath: newPath,
//             overwrite: overwrite
//         })
//     });

//     if (response.ok) {
//         console.log('File moved successfully');
//     } else {
//         console.error('Error moving file:', await response.text());
//     }
// }


