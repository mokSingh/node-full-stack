const db = require('../utils/database');
const Cart = require('./cart');


module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUE (?, ?, ?, ?)',
     [this.title, this.price, this.imageUrl, this.description]);
    
  }

  static deleteProduct(productId) {
   
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static getProduct(id) {
    return db.execute('SELECT * FROM products WHERE products.id= ?', [id]);
  }
};
