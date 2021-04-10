const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  console.log('reached here');
  const productId = req.params.productId;
   Product.getProduct(productId, (product) => {
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products'

    })
   })
  console.log(productId);
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((data) => {
    Product.fetchAll(products => {
      const cartProducts = [];
      products.forEach(prd => {
        console.log('datatata', data);
       let cartItem = data.products.find(prod => prod.id === prd.id);
       if(cartItem) {
        cartProducts.push({productData:prd, qty: cartItem.qty});
       }
       console.log('cart produuctsss', cartProducts);

      })
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    })
  })
 
};


exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.getProduct(productId, (product) => {
    Cart.addProduct(product.id, product.price);
  })
  console.log(productId);
  res.redirect('/cart');
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
