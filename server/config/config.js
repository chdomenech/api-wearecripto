// =======================
//  Puerto
// =======================
process.env.PORT = process.env.PORT || 3001;

// =======================
//  Entorno
// =======================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// =======================
//  Fecha de vencimiento
// =======================
process.env.CADUCIDAD_TOKEN = Math.floor(Date.now() / 1000) + 60 * 60;

// =======================
//  Seed
// =======================
process.env.SEED = process.env.SEED || "QUITO-MEXICO-WEARECRYPTO-23";


// =======================
//  Base de datos
// =======================
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/wearecripto";


// =======================
//  URL Base
// =======================
process.env.URLBASE = process.env.URLBASE || "http://localhost:4200/";


// =======================
//  URL Base
// =======================
process.env.NODE_BSC = process.env.NODE_BSC || "https://data-seed-prebsc-1-s1.binance.org:8545";



process.env.CLOUD_NAME = process.env.CLOUD_NAME || 'dynoedar6';
process.env.CLOUD_API_KEY = process.env.CLOUD_API_KEY || '389196716749124';
process.env.CLOUD_API_SECRET= process.env.CLOUD_API_SECRET || 'bgtv6O1IiDypOsYX2lV-MktAO64';