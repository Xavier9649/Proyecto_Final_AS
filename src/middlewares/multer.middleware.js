const multer = require('multer');
const path = require('path');

// 1. Configuración de Almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // La carpeta donde se guardarán las imágenes
        cb(null, path.join(__dirname, '..', '..', 'uploads/proyectos')); 
    },
    filename: (req, file, cb) => {
        // Aseguramos que el nombre sea único usando la marca de tiempo y el nombre original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 2. Filtro de Archivos (Acepta solo imágenes)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        // Usar un Error estándar, no un throw
        cb(new Error('Tipo de archivo no soportado. Solo se permiten imágenes.'), false);
    }
};

// 3. Configuración final
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Límite de 5MB
});

module.exports = upload;