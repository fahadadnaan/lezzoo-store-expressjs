module.exports = (app) => {
  require('./storesRoutes')(app);
  require('./categoriesRoutes')(app);
  require('./productsRoutes')(app);
  require('./authRoutes')(app);
};
