async function llamadaVideos() {
    const videoListContainer = document.getElementById('video-list');
    const videoContador = document.querySelector('.video-count');
    videoListContainer.innerHTML = "";
    videoListContainer.innerHTML = '<p>Loading...</p>';
    videoContador.innerHTML = "";

    try {
        const response = await fetch('/video-list');
        const responseText = await response.text();
        const [videoListHtml, contadorVideos] = responseText.split('<!--SPLIT-->');
        videoListContainer.innerHTML = videoListHtml;
        videoContador.innerHTML = contadorVideos;
    } catch (error) {
        console.error('Error fetching video list:', error);
        videoListContainer.innerHTML = '<p>Error loading video list.</p>';
    }
}

async function loadThumbnails() {
    fetch('/load-thumbnails')
        .then(response => response.text())
        .then(html => {
            console.log("okay");
        });
}