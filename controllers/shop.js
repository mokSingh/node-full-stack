const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll().then((products) => {
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
   Product.findByPk(productId).then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
   });
  console.log(productId);
}

exports.getIndex = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(error => console.log(error));
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then(cart => {
    return cart.getProducts();
  }).then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
  })
  // Cart.getCart((data) => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     products.forEach(prd => {
  //       console.log('datatata', data);
  //      let cartItem = data.products.find(prod => prod.id === prd.id);
  //      if(cartItem) {
  //       cartProducts.push({productData:prd, qty: cartItem.qty});
  //      }
  //      console.log('cart produuctsss', cartProducts);

  //     })
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   })
  // });

 
};
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart().then(cart => {
    return cart.getProducts({where: {id: prodId}});
  }).then(products => {
    const prod = products[0];
    return prod.cartItem.destroy();
  }).then(() => {
    res.redirect('/products');
  })
}


exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  req.user.getCart().then(cart => {
    fetchedCart = cart;
    return cart.getProducts({where: {id: productId}});
   //  return fetchedCart;
  }).then(products => {
    let product;
    if(products.length > 0) {
      product = products[0];
    }
    let newQuan = 1;
    if(product) {
      const oldQuant = product.cartItem.quantity;
      newQuan = oldQuant + 1;
      return fetchedCart.addProduct(product, {through: {quantity: newQuan}});
    } else {
      return Product.findByPk(productId).then(product => {
        return fetchedCart.addProduct(product, {through: {quantity: newQuan}});
      });
    }
  }).then( () => {
    res.redirect('/cart');
  }).catch(error => console.log(error));
  // Product.getProduct(productId, (product) => {
  //   Cart.addProduct(product.id, product.price);
  // })
  // console.log(productId);
  // res.redirect('/cart');
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']}).then(orders => {
    console.log(orders);
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })

};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};
