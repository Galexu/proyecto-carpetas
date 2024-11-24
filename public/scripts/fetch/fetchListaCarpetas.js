async function llamadaCarpetas() {
    const folderListContainer = document.querySelector('.folder_container');
    const botonPadre = document.querySelector('.boton-padre');
    folderListContainer.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch('/folder-list');
        const { listaCarpetas, carpetaPadre } = await response.json();

        botonPadre.setAttribute('data-folder-path', carpetaPadre);
        folderListContainer.innerHTML = listaCarpetas;
        addHoverListeners();
    } catch (error) {
        console.error('Error fetching folder list:', error);
        folderListContainer.innerHTML = '<p>Error loading folder list.</p>';
    }

    ajustarAlturaThumbnailGrid();
}

function adjustThumbnailGridHeight() {
    const folderContainer = document.querySelector('.folder_container');
    const thumbnailGrid = document.querySelector('.thumbnail-grid');

    if (folderContainer && thumbnailGrid) {
        const folderContainerHeight = folderContainer.offsetHeight;
        const availableHeight = window.innerHeight - folderContainerHeight;
        const availableHeightVh = (availableHeight / window.innerHeight) * 100;

        thumbnailGrid.style.maxHeight = `${availableHeightVh}vh`;
    }
}


function addHoverListeners() {
    const hoverElements = document.querySelectorAll('.f');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', handleHover);
        element.addEventListener('mouseleave', handleHoverLeave);
    });
}

function handleHover(event) {
    const hoverElement = event.currentTarget.querySelector('.ff');
    if (hoverElement) {
        hoverElement.style.display = 'flex';
        hoverElement.style.left = '0'; // Reset left
        hoverElement.style.right = 'auto'; // Reset right
        const rect = hoverElement.getBoundingClientRect();
        if (rect.right + 10 > window.innerWidth) {
            hoverElement.style.left = 'auto';
            hoverElement.style.right = '0';
        } else {
            hoverElement.style.left = '0';
            hoverElement.style.right = 'auto';
        }
    }
}

function handleHoverLeave(event) {
    const hoverElement = event.currentTarget.querySelector('.ff');
    if (hoverElement) {
        hoverElement.style.display = 'none';
        hoverElement.style.left = '0'; // Reset left
        hoverElement.style.right = 'auto'; // Reset right
    }
}