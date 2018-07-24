// =================================================
// PUERTO
//===============================================

process.env.PORT = process.env.PORT || 3000;

//=================================================
// ENTORNO  
//=================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//================================================
// BASE DE DATOS (MONGODB)
//================================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://usuario_p:marisol2336@ds137687.mlab.com:37687/cafe_p';
}

//  Para hacerla publica
process.env.URLDB = urlDB;