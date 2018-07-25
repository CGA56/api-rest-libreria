// =================================================
// PUERTO
//===============================================

process.env.PORT = process.env.PORT || 3000;

//=================================================
// ENTORNO  
//=================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//================================================
// VENCIMIENTO DEL TOKEN
//================================================
// 60 SEGUNDOS * 60 MINUTOS * 24 HORAS * 30 DIAS

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//================================================
// SEED (SEMILLA DE AUTENTIFICACION)
//================================================

process.env.SEED = process.env.SEED || 'desarrollo';



let urlDB;

// Para agregar una variable de entorno a heroku
/*
Para setear
 > heroku config:set MONGO_URI="mongodb://nombreUseer:ClaveEntorno@ds137687.mlab.com:37687/cafe_p"

Para ver las variables en consola
 > heroku config

Para eliminar la variable
 > heroku config:unset nombre_variable

*/

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

//  Para hacerla publica
process.env.URLDB = urlDB;