import express from 'express';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import bodyParser from 'body-parser';
import pLimit from 'p-limit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;
const videoDirectory = 'D:\\Stuff\\Desktop\\b\\awemer\\download\\z organizar'; // Especifica la ruta a tu carpeta de videos
const folderDirectory = 'D:\\Stuff\\Desktop\\b\\awemer\\download';
const thumbnailDirectory = path.join(__dirname, 'thumbnails');

// Especificar la ruta de ffprobe
ffmpeg.setFfprobePath('C:\\ffmpeg\\bin\\ffprobe.exe');

// Configurar el servidor para servir archivos estáticos
app.use('/videos', express.static(videoDirectory));
app.use('/thumbnails', express.static(thumbnailDirectory));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Configurar ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// Crear el directorio de thumbnails si no existe
if (!fs.existsSync(thumbnailDirectory)) {
    fs.mkdirSync(thumbnailDirectory);
}

async function createThumbnail(videoPath, thumbnailPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .screenshots({
                timestamps: ['30%'],
                filename: path.basename(thumbnailPath),
                folder: path.dirname(thumbnailPath),
                size: '?x120' // Mantener la relación de aspecto
                // size: '160x120' // Maximo tamaño con la que se podra crear el thumbnail
            })
            .on('end', resolve)
            .on('error', reject);
    });
}

async function subFolder(fo) {
    let subFolder = "";
    const xd = path.join(folderDirectory, fo);
    return new Promise((resolve, reject) => {
        fs.readdir(xd, async (err, folders) => {
            if (err) {
                console.error('No se pudo abrir el directorio.');
                reject(err);
                return;
            }

            folders.forEach(folder => {
                const filePath = path.join(xd, folder);
                if (fs.statSync(filePath).isDirectory()) {
                    subFolder += `
                    <button data-folder-path="${filePath}"
                        onclick="moverArchivo(event)">${folder}
                    </button>`;
                }
            });

            resolve(subFolder);
        });
    });
}


async function processDirectories(folderDirectory) {
    let folderListHtml = '';

    return new Promise((resolve, reject) => {
        fs.readdir(folderDirectory, async (err, folders) => {
            if (err) {
                console.error('No se pudo abrir el directorio.');
                reject(err);
                return;
            }

            for (const folder of folders) {
                const filePath = path.join(folderDirectory, folder);
                if (fs.statSync(filePath).isDirectory()) {
                    if (folder === "photos" || folder === "photos temporal" || folder === "z organizar") {
                        continue;
                    }

                    const subFolderHtml = await subFolder(folder);
                    // const folderId = `folder-${folder.replace(/\s+/g, '-')}`;

                    if (subFolderHtml) {
                        folderListHtml += `
                            <div class="f">
                                <button data-folder-path="${filePath}" onclick="moverArchivo(event)">${folder}
                                </button>
                                <div class="ff">
                                    ${subFolderHtml}
                                </div>
                            </div>`;
                    } else {
                        folderListHtml += `
                        <button class="folder" data-folder-path="${filePath}"
                            onclick="moverArchivo(event)">${folder}
                        </button>`;
                    }
                }
            }

            // console.log(`Total folders: ${folders.length}`);
            resolve(folderListHtml);
        });
    });
}

async function processVideos(videoDirectory, thumbnailDirectory, concurrencyLimit, pageLimit) {
    let nuevoArray = [];
    let videoListHtml = '';
    let processedFilesCount = 0;
    let identificador = 0;

    return new Promise((resolve, reject) => {
        fs.readdir(videoDirectory, async (err, files) => {
            if (err) {
                console.error('No se pudo abrir el directorio.');
                reject(err);
                return;
            }
            const videoFiles = files.filter(file => /\.(mp4|avi|mov|mkv)$/i.test(file));
            
            for (let i = 0; i < videoFiles.length; i++) {
                if (i == pageLimit) {
                    break;
                }
                nuevoArray.push(videoFiles[i]);
            }

            // console.log(`Total files in directory: ${files.length}`);
            // console.log(`Total video files: ${nuevoArray.length}`);

            const limit = pLimit(concurrencyLimit);
            const thumbnailPromises = nuevoArray.map(file => limit(async () => {
                const filePath = path.join(videoDirectory, file);
                const fileStats = fs.statSync(filePath);
                const fileSize = (fileStats.size / (1024 * 1024)).toFixed(2) + ' MB'; // Convert size to MB

                const encodedFile = encodeURIComponent(file);
                const fileUrl = `/videos/${encodedFile}`;
                const thumbnailPath = path.join(thumbnailDirectory, `${path.parse(file).name}.png`);
                const thumbnailUrl = `/thumbnails/${encodeURIComponent(path.parse(file).name)}.png`;

                // Generate thumbnail if it doesn't exist
                if (!fs.existsSync(thumbnailPath)) {
                    try {
                        await createThumbnail(path.join(videoDirectory, file), thumbnailPath);
                    } catch (error) {
                        console.error(`Error creating thumbnail for ${file}:`, error);
                        return; // Skip to the next file if thumbnail creation fails
                    }
                }

                videoListHtml += `
                    <li draggable="true" onclick="selectedVideo('${identificador}')" data-path="${filePath}" data-fileurl="${fileUrl}" data-filesize="${fileSize}" id="${identificador}">
                        <span>${fileSize}</span><img src="${thumbnailUrl}" data-path="${filePath}"><p>${file}</p>
                    </li>`;

                identificador++;
                processedFilesCount++;
                console.log(`Processed file ${processedFilesCount}/${nuevoArray.length}`);
            }));

            await Promise.all(thumbnailPromises);
            resolve(videoListHtml);
            console.log('Finished reading the folder.');
        });
    });
}

// Call the function with appropriate directories
// processDirectories(folderDirectory);
// processVideos(videoDirectory, './thumbnails', 10);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/video-list', async (req, res) => {
    const videoListHtml = await processVideos(videoDirectory, './thumbnails', 10, 1000);
    res.send(videoListHtml);
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

app.get('/folder-list', async (req, res) => {
    const folderListHtml = await processDirectories(folderDirectory);
    res.send(folderListHtml);
});

app.get('/load-thumbnails', async (req, res) => {
    processVideos(videoDirectory, './thumbnails', 10, 1000000);
});

app.post('/move-file', (req, res) => {
    const { oldPath, newPath } = req.body;
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            console.error('Error moving file:', err);
            res.status(500).send('Error moving file');
            return;
        }
        console.log(`Archivo movido exitosamente desde ${oldPath} hasta ${newPath}`);
        res.send(`Archivo movido exitosamente desde ${oldPath} hasta ${newPath}`);
    });
});

app.post('/delete', (req, res) => {
    const { path } = req.body;
    fs.unlink(path, (err) => {
        if (err) {
            console.error(`Error al borrar el archivo: ${err.message}`);
            return res.status(500).send(`Error al borrar el archivo: ${err.message}`);
        }
        console.log(`Archivo ${path} borrado exitosamente`);
        res.send(`Archivo ${path} borrado exitosamente`);
    });
});

app.post('/create-folder', (req, res) => {
    const { principalPath, secundariaPath  } = req.body;
    console.log("req", req.body);
    console.log(principalPath);
    console.log(secundariaPath);

    console.log("join", path.join(folderDirectory, principalPath, secundariaPath));

    fs.mkdir(path.join(folderDirectory, principalPath, secundariaPath), (err) => {
        if (err) {
            console.error('Error creating directory:', err);
        } else {
            console.log('Directory created successfully');
        }
    });
});
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

// app.get('/pagination-right', async (req, res) => {
//     const videoListHtml = await processVideos(videoDirectory, './thumbnails', 10, 1000);
//     res.send(videoListHtml);
// });

// app.get('/pagination-left', async (req, res) => {
//     const videoListHtml = await processVideos(videoDirectory, './thumbnails', 10);
//     res.send(videoListHtml);
// });