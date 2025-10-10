import express from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";

const app = express();
app.use( express.json() );
const productManager = new ProductManager("./src/products.json");
const cartManager = new CartManager("./src/carts.json");


app.get("/", (req, res)=> {
  res.json( { status: "success", message: "Hola Mundo! Esta es mi página de inicio" } )
})


// ---------/api/products-----------

//devolver todos los productos o una cantidad determinada de productos
app.get("/api/products", async(req, res)=> {
  try {
    const products = await productManager.getProducts();
    res.status(200).json({ message: "Lista de productos", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/products/:pid", async(req, res)=> {
  try {
    const pid = req.params.pid;
    const products = await productManager.deleteProductById(pid);
    res.status(200).json({ message: "Producto Eliminado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/products", async(req, res)=> {
  try {
    const newProduct = req.body;
    const products = await productManager.addProduct(newProduct);
    res.status(201).json({ message: "Producto agregado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/products/:pid", async(req, res)=> {
  try {
    const pid = req.params.pid;
    const updates = req.body;

    const products = await productManager.setProductById(pid, updates);
    res.status(200).json({ message: "Producto Actualizado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//devolver un producto buscado a traves de su id
app.get("/api/products/:pid", async(req, res)=> {
  try {
    const pid = req.params.pid;
    const products = await productManager.getProductById(pid);
    res.status(200).json({ message: "Producto:", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---------/api/carts-----------


//crea carritos vacios
app.post("/api/carts", async(req, res)=> {
  try {
    const newCart = req.body;
    await cartManager.addCart(newCart);
    res.status(201).json({ message: "Carrito creado exitosamente"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/carts/:cid", async(req, res)=> {
  try {
    const cid = req.params.cid;
    const carts = await cartManager.deleteCartById(cid);
    res.status(200).json({ message: "Carrito Eliminado", carts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//este metodo trae los productos de un carrito elegido por su id
app.get("/api/carts/:cid", async(req, res)=> {
  try {
    const cid = req.params.cid;
    const products = await cartManager.getProductsByIdCart(cid);
    res.status(200).json({ message: "Productos:", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Debe agregar el producto al arreglo products del carrito seleccionado, utilizando el siguiente formato:
//product: Solo debe contener el ID del producto.
//quantity: Debe contener el número de ejemplares de dicho producto (se agregará de uno en uno).
//Si un producto ya existente intenta agregarse, se debe incrementar el campo quantity de dicho producto.

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    // Verificar que el producto y el carrito existan
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Agregar el producto al carrito
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    res.status(200).json({ message: "Producto agregado al carrito", updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(8080, ()=> {
  console.log("Servidor iniciado correctamente en el puerto 8080!");
});
