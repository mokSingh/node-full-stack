const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static updateProduct(product) {
    getProductsFromFile(products => {
      let prodIndex = products.findIndex(prod => prod.id === product.id);
      products[prodIndex] = product;
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(productId, cb) {
    getProductsFromFile(products => {
      const delProd = products.find(prd => prd.id === productId);
      let updatedProduct = products.filter(prod => prod.id !== productId);
      fs.writeFile(p, JSON.stringify(updatedProduct), err => {
        if(!err) {
          console.log('pppp', productId);
          console.log(delProd.price);
          Cart.deleteProduct(productId, delProd.price);
          cb && cb();
        }
        console.log(err);
      });
      
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static getProduct(id,cb) {
    getProductsFromFile(products => {
     const product = products.find(p => p.id === id);
     cb(product);
    });
  }
};
