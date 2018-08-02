const express = require('express');

const fs = require('fs');

let app = express();

//  path absoluto 
const path = require('path');

const { verificaTokenImg } = require('../middleware/autentificacion');



app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = `/uploads/${tipo}/${img}`;

    let pathImaguen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImaguen)) {
        res.sendfile(pathImaguen);
    } else {
        let noImgPath = path.resolve(__dirname, '../assets/not-found.png');
        res.sendFile(noImgPath);

    }

});




module.exports = app;