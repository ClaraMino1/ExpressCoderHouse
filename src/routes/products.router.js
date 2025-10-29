import express from "express";
import ProductManager from "../ProductManager.js";
import uploader from "../utils/uploader.js";

const productsRoutes = express.Router();
const productManager = new ProductManager("./src/products.json");

//concatena la ruta definida en app.js
productsRoutes.post("/", uploader.single("file"),async (req, res) => {

    try {
        if(!req.file) return res.status(401).json({ message: "No se ha cargado ningun archivo" });
        
        const title = req.body.title;
        const price = req.body.price;
        const thumbnail = "/img/" + req.file.filename;

        await productManager.addProduct({ title, price, thumbnail });

        //ruta para redireccionar cuando se envía el formulario
        res.redirect("/");

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

})

export default productsRoutes;