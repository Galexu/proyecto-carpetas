import express from 'express';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import pathFfmpeg from 'ffmpeg-static';
import bodyParser from 'body-parser';
import pLimit from 'p-limit';
import trash from 'trash';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';

// /**
//  * Opens Windows File Explorer and searches for a specific file.
//  * @param {string} directory - The directory to search in.
//  * @param {string} fileName - The name of the file to search for.
//  */
// function openFileExplorerWithSearch(directory, fileName) {
//     const searchCommand = `explorer.exe /select,"${path.join(directory, fileName)}"`;
//     exec(searchCommand, (error) => {
//         if (error) {
//             console.error(`Error opening File Explorer: ${error.message}`);
//         }
//     });
// }

/* TODO - Poder abrir la carpeta actual en el explorador

Poder abrir la carpeta de los botones en el explorador

Poder abrir el archivo seleccionado en el explorador

Acceso rapido a descarga de awemer desde el navegador, tras esto que se cargue los thumbnails automaticamente o no

Durante la transformacion con tiktokeditor poder clickear encima del logo girando para pausar el video
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const puerto = 3000;
let directorioVideo__ = 'D:\\Stuff\\Desktop\\b\\awemer\\download';
let directorioCarpeta__ = 'D:\\Stuff\\Desktop\\b\\awemer\\download';
const directorioThumbnail__ = path.join(__dirname, 'thumbnails');

ffmpeg.setFfprobePath('C:\\ffmpeg\\bin\\ffprobe.exe');
ffmpeg.setFfmpegPath(pathFfmpeg);

// Configurar el servidor para servir archivos estáticos
// app.use('/videos', express.static(videoDirectory));
app.use('/thumbnails', express.static(directorioThumbnail__));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

if (!fs.existsSync(directorioThumbnail__)) {
    fs.mkdirSync(directorioThumbnail__);
}

async function crearThumbnail(pathVideo, pathThumbnail) {
    return new Promise((resolve, reject) => {
        ffmpeg(pathVideo)
            .screenshots({
                timestamps: ['30%'],
                filename: path.basename(pathThumbnail),
                folder: path.dirname(pathThumbnail),
                size: '?x120' // Mantener la relación de aspecto
                // size: '160x120' // Maximo tamaño con la que se podra crear el thumbnail
            })
            .on('end', resolve)
            .on('error', reject);
    });
}

async function carpetaInferior(carp) {
    let subCarpeta = "";
    const pathCompleto = path.join(directorioCarpeta__, carp);

    return new Promise((resolve, reject) => {
        fs.readdir(pathCompleto, { withFileTypes: true }, async (err, carpetas) => {
            if (err) {
                console.error('No se pudo abrir el directorio.');
                reject(err);
                return;
            }

            "hola"

            // carpetas.forEach(carpeta => {
            //     const archivoPath = path.join(pathCompleto, carpeta);
            //     if (fs.statSync(archivoPath).isDirectory()) {
            //         subCarpeta += `
            //         <button data-folder-path="${archivoPath}"
            //             onclick="moverArchivo(event)" oncontextmenu="cambiarCarpeta2(event)">${carpeta}
            //         </button>`;
            //     }
            // });


            carpetas.forEach(carpeta => {
                if (carpeta.isDirectory()) {
                    const archivoPath = path.join(pathCompleto, carpeta.name);
                    subCarpeta += `
                    <button data-folder-path="${archivoPath}"
                        onclick="moverArchivo(event)" oncontextmenu="cambiarCarpeta2(event)">${carpeta.name}
                    </button>`;
                }
            });

            resolve(subCarpeta);
        });
    });
}

async function procesarDirectorios(pathCarpeta) {
    let listaCarpetas = '';
    let carpetaPadre = '';

    return new Promise((resolve, reject) => {
        fs.readdir(pathCarpeta, async (err, carpetas) => {
            if (err) {
                console.error('No se pudo abrir el directorio.');
                reject(err);
                return;
            }

            for (const carpeta of carpetas) {
                const pathArchivo = path.join(pathCarpeta, carpeta);
                if (fs.statSync(pathArchivo).isDirectory()) {
                    if (carpeta === "photos" || carpeta === "photos temporal" || carpeta === "z organizar") {
                        continue;
                    }

                    const subCarpeta = await carpetaInferior(carpeta);

                    if (subCarpeta) {
                        listaCarpetas += `
                            <div class="f">
                                <button data-folder-path="${pathArchivo}" onclick="moverArchivo(event)" oncontextmenu="cambiarCarpeta2(event)">${carpeta}
                                </button>
                                <div class="ff">
                                    ${subCarpeta}
                                </div>
                            </div>`;
                    } else {
                        listaCarpetas += `
                        <button class="folder" data-folder-path="${pathArchivo}"
                            onclick="moverArchivo(event)" oncontextmenu="cambiarCarpeta2(event)">${carpeta}
                        </button>`;
                    }
                }
            }

            carpetaPadre += `
                        <button class="boton-padre" data-folder-path="${path.dirname(pathCarpeta)}"
                            onclick="moverArchivo(event)" oncontextmenu="cambiarCarpeta2(event)">.
                        </button>`;

            carpetaPadre = path.dirname(pathCarpeta);
            resolve({ listaCarpetas, carpetaPadre });
        });
    });
}

let contadorVideos = 0;
async function procesarVideos(pathVideo, pathThumbnail, concurrenciaLimite, elementosLimite) {
    let arrayVideos = [];
    let listaVideosHtml = '';
    let conteoArchivosProcesados = 0;
    let identificador = 0;
    contadorVideos = 0;

    return new Promise((resolve, reject) => {
        fs.readdir(pathVideo, async (err, archivos) => {
            if (err) {
                console.error('No se pudo abrir el directorio.');
                reject(err);
                return;
            }
            const archivosVideo = archivos.filter(archivo => /\.(mp4|avi|mov|mkv|webm)$/i.test(archivo));
            console.log(`Videos totales: ${archivosVideo.length}`);

            for (let i = 0; i < archivosVideo.length; i++) {
                if (i == elementosLimite) {
                    break;
                }
                arrayVideos.push(archivosVideo[i]);
            }

            const limite = pLimit(concurrenciaLimite);
            const promesasThumbnail = arrayVideos.map(archivo => limite(async () => {
                const archivoPath = path.join(pathVideo, archivo);
                const archivoPropiedades = fs.statSync(archivoPath);
                const archivoTamanyo = (archivoPropiedades.size / (1024 * 1024)).toFixed(2) + ' MB';

                const archivoCodificado = encodeURIComponent(archivo);
                const archivoUrl = `/videos/${archivoCodificado}`;
                const pathThumbnailCompleto = path.join(pathThumbnail, `${path.parse(archivo).name}.png`);
                const urlThumbnail = `/thumbnails/${encodeURIComponent(path.parse(archivo).name)}.png`;

                if (!fs.existsSync(pathThumbnailCompleto)) {
                    try {
                        await crearThumbnail(path.join(pathVideo, archivo), pathThumbnailCompleto);
                    } catch (error) {
                        console.error(`Error creating thumbnail for ${archivo}:`, error);
                        return;
                    }
                }

                listaVideosHtml += `
                    <li class="asd" onclick="videoSeleccionado('${identificador}')" data-path="${archivoPath}" data-fileurl="${archivoUrl}" data-filesize="${archivoTamanyo}" id="${identificador}">
                        <span>${archivoTamanyo}</span><img src="${urlThumbnail}" data-path="${archivoPath}"><p>${archivo}</p>
                    </li>`;

                identificador++;
                conteoArchivosProcesados++;
                console.log(`Archivo procesado ${conteoArchivosProcesados}/${arrayVideos.length}`);
            }));

            contadorVideos = archivosVideo.length;

            await Promise.all(promesasThumbnail);
            resolve(listaVideosHtml);
            console.log('Finalizado');
        });
    });
}

// function undoLastAction() {
//     if (undoStack.length === 0) {
//         console.log('No actions to undo');
//         return;
//     }

//     const lastAction = undoStack.pop();

//     switch (lastAction.type) {
//         case 'move':
//             // Move the file back to its original location
//             fs.rename(lastAction.newPath, lastAction.originalPath, (err) => {
//                 if (err) {
//                     console.error('Error undoing move:', err);
//                 } else {
//                     console.log('Move undone successfully');
//                 }
//             });
//             break;
//         case 'delete':
//             // Restore the deleted file from the trash
//             fs.rename(lastAction.trashPath, lastAction.originalPath, (err) => {
//                 if (err) {
//                     console.error('Error undoing delete:', err);
//                 } else {
//                     console.log('Delete undone successfully');
//                 }
//             });
//             break;
//         default:
//             console.log('Unknown action type:', lastAction.type);
//     }
// }


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/video-list', async (req, res) => {
    app.use('/videos', express.static(directorioVideo__));
    let listaVideosHtml = await procesarVideos(directorioVideo__, './thumbnails', 20, 1500);
    listaVideosHtml = await procesarVideos(directorioVideo__, './thumbnails', 20, 1500);
    res.send(`${listaVideosHtml}<!--SPLIT-->${contadorVideos}`);
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
});

app.get('/folder-list', async (req, res) => {
    const { listaCarpetas, carpetaPadre } = await procesarDirectorios(directorioCarpeta__);
    res.json({ listaCarpetas, carpetaPadre });
});

app.post('/change-folder', async (req, res) => {
    const nuevaCarpeta = req.body.nuevaCarpeta;
    directorioVideo__ = nuevaCarpeta;
    directorioCarpeta__ = nuevaCarpeta;
    app.use('/videos', express.static(directorioVideo__));

    const listaVideoHtml = await procesarVideos(directorioVideo__, './thumbnails', 10, 1000);
    const { listaCarpetas, carpetaPadre } = await procesarDirectorios(directorioCarpeta__);
    res.json({ listaVideoHtml, listaCarpetas, carpetaPadre, contadorVideos });
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
});

app.get('/load-thumbnails', async (req, res) => {
    procesarVideos(directorioVideo__, './thumbnails', 10, 1000000);
});

app.post('/move-file', (req, res) => {
    const { oldPath, newPath } = req.body;

    fs.access(newPath, fs.constants.F_OK, (err) => {
        if (!err) {
            console.error('File already exists at destination:', newPath);
            res.send("1");
            return;
        }

        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                console.error('Error moving file:', err);
                res.send("0");
                return;
            }
            console.log(`Archivo movido exitosamente desde ${oldPath} hasta ${newPath}`);
            res.send(`Archivo movido exitosamente desde ${oldPath} hasta ${newPath}`);
        });
    });
});

app.post('/overwrite', (req, res) => {
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

app.post('/delete', async (req, res) => {
    const { path } = req.body;
    try {
        await trash([path]);
        console.log(`Archivo ${path} movido a la papelera exitosamente`);
        res.send(`Archivo ${path} movido a la papelera exitosamente`);
    } catch (err) {
        console.error(`Error al mover el archivo a la papelera: ${err.message}`);
        res.status(500).send(`Error al mover el archivo a la papelera: ${err.message}`);
    }
});

app.post('/create-folder', (req, res) => {
    const { principalPath, secundariaPath } = req.body;

    fs.mkdir(path.join(directorioCarpeta__, principalPath, secundariaPath), (err) => {
        if (err) {
            console.error('Error creating directory:', err);
        } else {
            console.log('Directory created successfully');
        }
    });
});

app.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
});



// --------------------------------------------------- TIKTOK ---------------------------------------------------

app.post('/escalar', (req, res) => {
    console.log("Escalando archivo...");
    let { archivoPath, nombre, resoW, resoH, directorio } = req.body;
    const nombreParseado = path.parse(nombre);
    const nombreSolo = nombreParseado.name + '1';
    const extension = nombreParseado.ext;

    if (resoW % 2 != 0) {
        resoW = resoW + 1;
    }
    if (resoH % 2 != 0) {
        resoH = resoH + 1;
    }

    const comandoEscalar = 'ffmpeg -i "' + archivoPath + '" -vf scale=' + resoW + ':' + resoH + ' -c:a copy "' + directorio + nombreSolo + extension + '"';
    // console.log("comando", comandoEscalar);
    exec(comandoEscalar, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al ejecutar el comando: ${error.message}`);
            return res.status(500).send(`Error al ejecutar el comando: ${error.message}`);
        }
        if (stderr) {
            console.error(`Error en ffmpeg: ${stderr}`);
            return res.status(500).send(`Error en ffmpeg: ${stderr}`);
        }
        // console.log(`Salida de ffmpeg: ${stdout}`);
        res.send(`Archivo escalado exitosamente: ${outputFile}`);
    });
});

app.post('/cortar-tiempo', (req, res) => {
    console.log("Cortando longitud de archivo...");
    const { archivoPath, nombre, tiempoCorte, directorio } = req.body;
    const nombreParseado = path.parse(nombre);
    const nombreSolo = nombreParseado.name + '1';
    const extension = nombreParseado.ext;

    const comandoCortarTiempo = 'ffmpeg -i "' + archivoPath + '" -t ' + tiempoCorte + ' -c copy "' + directorio + nombreSolo + extension + '"';
    // console.log("comando", comandoCortarTiempo);
    exec(comandoCortarTiempo, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al ejecutar el comando: ${error.message}`);
            return res.status(500).send(`Error al ejecutar el comando: ${error.message}`);
        }
        if (stderr) {
            console.error(`Error en ffmpeg: ${stderr}`);
            return res.status(500).send(`Error en ffmpeg: ${stderr}`);
        }
        console.log(`Salida de ffmpeg: ${stdout}`);
        res.send(`Archivo escalado exitosamente: ${outputFile}`);
    });
});

app.post('/recortar', (req, res) => {
    console.log("Recortando archivo...");
    const { archivoPath, nombre, corte1, corte2, directorio } = req.body;
    const nombreParseado = path.parse(nombre);
    const nombreSolo = nombreParseado.name + '1';
    const extension = nombreParseado.ext;

    const comandoRecortar = 'ffmpeg -i "' + archivoPath + '" -vf "crop=in_w:in_h-(in_h/' + corte1 + ')*2:0:(in_h/' + corte2 + ')" "' + directorio + nombreSolo + extension + '"';
    // console.log("comando", comandoRecortar);
    exec(comandoRecortar, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al ejecutar el comando: ${error.message}`);
            return res.status(500).send(`Error al ejecutar el comando: ${error.message}`);
        }
        if (stderr) {
            console.error(`Error en ffmpeg: ${stderr}`);
            return res.status(500).send(`Error en ffmpeg: ${stderr}`);
        }
        console.log(`Salida de ffmpeg: ${stdout}`);
        res.send(`Archivo escalado exitosamente: ${outputFile}`);
    });
});

app.post('/rotar', (req, res) => {
    console.log("Rotando archivo...");
    let { archivoPath, nombre, giroM, giroDireccion, resolucionHW, resolucionHG, directorio } = req.body;
    const nombreParseado = path.parse(nombre);
    const nombreSolo = nombreParseado.name + '1';
    const extension = nombreParseado.ext;

    if (resolucionHW % 2 != 0) {
        resolucionHW = resolucionHW + 1;
    }
    if (resolucionHG % 2 != 0) {
        resolucionHG = resolucionHG + 1;
    }

    let comandoRotar;
    if (giroM) {
        comandoRotar = 'ffmpeg -i "' + archivoPath + '" -vf "transpose=' + giroDireccion + ',scale=' + resolucionHW + ':' + resolucionHG + '" -c:a copy "' + directorio + nombreSolo + extension + '"'
    } else {
        comandoRotar = 'ffmpeg -i "' + archivoPath + '" -vf "transpose=' + giroDireccion + '" "' + directorio + nombreSolo + extension + '"'
    }

    // console.log("comando", comandoRotar);
    exec(comandoRotar, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al ejecutar el comando: ${error.message}`);
            return res.status(500).send(`Error al ejecutar el comando: ${error.message}`);
        }
        if (stderr) {
            console.error(`Error en ffmpeg: ${stderr}`);
            return res.status(500).send(`Error en ffmpeg: ${stderr}`);
        }
        console.log(`Salida de ffmpeg: ${stdout}`);
        res.send(`Archivo escalado exitosamente: ${outputFile}`);
    });
});

























































// app.get('/pagination-right', async (req, res) => {
//     const videoListHtml = await processVideos(videoDirectory, './thumbnails', 10, 1000);
//     res.send(videoListHtml);
// });

// app.get('/pagination-left', async (req, res) => {
//     const videoListHtml = await processVideos(videoDirectory, './thumbnails', 10);
//     res.send(videoListHtml);
// });