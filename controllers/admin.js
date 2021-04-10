const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing : false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, description, parseInt(price));
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  let isEdit = req.query.edit;
  if(!isEdit) {
    return res.redirect('/');
  }
  let productId = req.params.productId;
  Product.getProduct(productId, (product) => {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: true,
      product: product
    }); 
  })
  
}

exports.deleteProduct = (req, res, next) => {
  let productId = req.body.productId;
  Product.deleteProduct(productId, () => {
    res.redirect('/admin/products');
  }) ;
  
};
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

exports.updateProduct = (req, res, next) => {
  let productId = req.params.productId;
  Product.getProduct(productId, (product) => {
     let updateProduct = {...product, 
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      description: req.body.description
    };
    Product.updateProduct(updateProduct);
    res.redirect('/admin/products');
  });
}
