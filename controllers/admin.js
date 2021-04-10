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
  req.user.createProduct({
    title,
    imageUrl,
    price,
    description
  }).then(result => {console.log(result); return res.redirect('/admin/products');}).catch(error => console.log(error));
};

exports.getEditProduct = (req, res, next) => {
  let isEdit = req.query.edit;
  if(!isEdit) {
    return res.redirect('/');
  } 
  let productId = req.params.productId;
  req.user.getProducts({where: {id: productId}}).then((products) => {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: true,
      product: products[0]
    }); 
  })

  // Product.findByPk(productId).then((product) => {
  
  // })
  
}

exports.deleteProduct = (req, res, next) => {
  let productId = req.body.productId;
  Product.findByPk(productId).then((product) => {
    return product.destroy();
  }).then(() => {
    res.redirect('/admin/products');
  });
  
  
};
exports.getProducts = (req, res, next) => {
  req.user.getProducts().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

exports.updateProduct = (req, res, next) => {
  let productId = req.params.productId;
  let title = req.body.title;
  let imageUrl = req.body.imageUrl;
  let price = req.body.price;
  let description =  req.body.description;
  // We already have prodcut for this user
  Product.findByPk(productId).then((product) => {
    product.productId = productId;
    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;
    return product.save();
    // res.redirect('/admin/products');
  }).then(() => {
    res.redirect('/admin/products');
  });
}
