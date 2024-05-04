const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
const fs = require('fs');

const base64Data = 'data:image/png;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPhf7cEhAQAAAICg/6+NngAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWNuv4QaaHYDnAAAAAElFTkSuQmCC';

const bytes = Buffer.from(base64Data, 'base64');


// let imgContent = {

//     "documents": [
//         {
//             "id": "fondo",
//             "content": ""
//         },
//         {
//             "id": "nofondo",
//             "content": ""
//         }
//     ]
    
// }



fs.writeFile('imagen.png', bytes, (err) => {
  if (err) {
    console.error('Error al escribir el archivo:', err);
    return;
  }
  console.log('Imagen guardada correctamente.');
});


// mergeImages(['./imgs/body.png', './imgs/mouth.png'], { 
//   Canvas: Canvas, 
//   Image: Image,
//   width: 1000,
//   height: 1000 })
//   .then(b64 => {
//     const base64Data = b64.replace(/^data:image\/png;base64,/);
//     const buffer = Buffer.from(base64Data, 'base64');
//     fs.writeFileSync('imagen_fusionada.png', buffer);
//     let imgmerge = b64;
//     console.log(imgmerge);
//   })
//   .catch(error => {
//     console.error('Error al fusionar imágenes:', error);
//   });

