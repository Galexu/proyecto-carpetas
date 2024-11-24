const divCarpeta = document.querySelector('.creacion-ruta-carpeta');
const principal = document.querySelector('.principal');
const secundaria = document.querySelector('.secundaria');

function createFolder() {
    if (divCarpeta.style.display == 'flex') {
        divCarpeta.style.display = 'none';
    } else {
        divCarpeta.style.display = 'flex';
    }
}

function mandarCarpeta() {
    let principalPath = principal.value;
    let secundariaPath = secundaria.value;

    fetch('/create-folder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ principalPath, secundariaPath })
    })
        .then(response => response.text())
        .then(message => {
            console.log(message);
        })
        .catch(error => {
            console.error('Error creating folder:', error);
        });
    divCarpeta.style.display = 'none';
}


const divElegirCarpeta = document.querySelector('.cambiar-ruta-carpeta');
const rutaCarpeta = document.querySelector('.ruta-carpeta');

function elegirCarpeta() {
    if (divElegirCarpeta.style.display == 'flex') {
        divElegirCarpeta.style.display = 'none';
    } else {
        divElegirCarpeta.style.display = 'flex';
    }
}

async function cambiarCarpeta() {
    let nuevaCarpeta = rutaCarpeta.value;

    divElegirCarpeta.style.display = 'none';
    const videoListContainer = document.getElementById('video-list');
    const folderListContainer = document.querySelector('.folder_container');
    videoListContainer.innerHTML = "";
    folderListContainer.innerHTML = "";
    videoListContainer.innerHTML = '<p>Loading...</p>';
    folderListContainer.innerHTML = '<p>Loading...</p>';

    console.log(nuevaCarpeta);
    console.log(JSON.stringify(nuevaCarpeta));

    try {
        const { videoListHtml, folderListHtml } = await asd(nuevaCarpeta);
        videoListContainer.innerHTML = videoListHtml;
        folderListContainer.innerHTML = folderListHtml;
    } catch (error) {
        console.error('Error fetching new folder:', error);
        videoListContainer.innerHTML = '<p>Error loading video list.</p>';
    }

    addHoverListeners();
}

async function asd(nuevaCarpeta) {
    try {
        const response = await fetch('/change-folder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nuevaCarpeta })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error moving file:', error);
        throw error;
    }
}