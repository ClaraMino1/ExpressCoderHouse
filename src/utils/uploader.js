import multer from "multer";

//donde guarda el archivo y con que nombre
const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, "public/img");
    },
    filename: (req, file, callback) =>{
        //concatena fecha al nombre del archivo para que no se repita
        const newFileName = Date.now() + "-" + file.originalname;
        callback(null, newFileName);
    }
});

//crear el middleware. se ejecuta entre el envio del formulario y la ruta que lo recibe
//entre medio: captura el archivo y lo guarda en la carpeta definida en storage

const uploader = multer({storage: storage});

export default uploader;