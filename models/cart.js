const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
  );

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0}
            if(!err) {
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProd;
            if(existingProduct) {
                updatedProd  = {...existingProduct};
                updatedProd.qty = updatedProd.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProd;
            } else {
                updatedProd = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProd];
            }
            cart.totalPrice =  cart.totalPrice + Number(productPrice);
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            })
        })
    }

    static deleteProduct(id, price) {
        fs.readFile(p, (err, fileContent) => {
            if(err) {
                return;
            }
            const updatedCart = { ...JSON.parse(fileContent) };
            console.log(id);
            const product = updatedCart.products.find(prod => prod.id === id);
            if(!product){
                return;
            }
            console.log('prodcut', product);
            const prdQty = product.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            console.log(updatedCart.totalPrice);
            console.log(price);
            console.log(prdQty);
            updatedCart.totalPrice = updatedCart.totalPrice - (price * parseInt(prdQty));
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            })
        });
    }

    static getCart(callback) {
        fs.readFile(p, (err, fileContent) => {
            const cartItems = JSON.parse(fileContent);
            console.log('ccart items', cartItems);
            if(err) {
                callback(null);
            } else {
                callback(cartItems);
            }
        });
    }
}