import express from "express";
import ProductManager from "../ProductManager.js";

const viewsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

//endpoints de handlebars. que vista mostrar
viewsRouter.get("/", async (req, res)=> {
    try {
        const user = {username: "Clara", isAdmin: false}
        const products = await productManager.getProducts();

        res.render("dashboard", {products,user}); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default viewsRouter;