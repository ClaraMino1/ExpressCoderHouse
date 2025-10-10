import fs from "fs/promises";
import crypto from "crypto";

class CartManager{

  constructor(pathFile){
    this.pathFile = pathFile;
  }

  generateNewId(){
    return crypto.randomUUID();
  }

  async deleteCartById(cid){
      try {
        //recuperar los productos
        const fileData = await fs.readFile(this.pathFile, "utf-8");
        const carts = JSON.parse(fileData);
  
        const filteredCarts = carts.filter((cart)=> cart.id !== cid );
  
        //guardamos los productos en el json
        await fs.writeFile( this.pathFile, JSON.stringify(filteredCarts, null, 2) , "utf-8" );
  
        return filteredCarts;
      } catch (error) {
        throw new Error(`Error al borrar el carrito ${cid}: `+error.message);
      }
    }

  async addCart(newCart){
    try {
      //recuperar los carritos
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);

      const newId = this.generateNewId();
      //creamos el carrito y lo pusheamos al array de carritos
      const cart = { id: newId, products: [], ...newCart };
      carts.push(cart);

      //guardamos los productos en el json
      await fs.writeFile( this.pathFile, JSON.stringify(carts, null, 2) , "utf-8" );

    } catch (error) {
      throw new Error("Error al crear el carrito: "+error.message);
    }
  }

  async getCartById(cid){
  try {
    const fileData = await fs.readFile(this.pathFile, "utf-8");
    const carts = JSON.parse(fileData);

    const cart = carts.find(cart => cart.id === cid);
    if (!cart) throw new Error("Carrito no encontrado");

    return cart;
  } catch (error) {
    throw new Error("Error al traer el carrito: " + error.message);
  }
}

  async getProductsByIdCart(cid){
    try {
      //recuperar los productos
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);

      //obtengo el carrito que coincide con el id
      
      const filteredCarts = carts.filter((cart)=> cart.id === cid );
      if(filteredCarts.length === 0) throw new Error("Carrito no encontrado");

      //obtengo los productos del carrito
        const products = filteredCarts[0].products;

      if(products.length === 0) return "El carrito no tiene productos";


      return products;
    } catch (error) {
      throw new Error("Error al traer los productos: "+error.message);
    }
  }

  //agregar un producto a un carrito
    async addProductToCart(cid, pid) {

        //recuperar los carritos
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);


        const cartIndex = carts.findIndex(cart => cart.id === cid);

        if (cartIndex === -1) {     
            throw new Error(`Carrito con id ${cid} no existe.`);
        }

        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(item => item.product === pid);

        if (productIndex !== -1) {
            // Si el producto ya existe se aumenta la cantidad
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({
                product: pid,
                quantity: 1,
            });
        }

        carts[cartIndex] = cart;
        await fs.writeFile(this.pathFile, JSON.stringify(carts, null, 2));

        return cart;
    }

}

export default CartManager;