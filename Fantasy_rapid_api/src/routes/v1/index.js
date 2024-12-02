const express = require('express');
const config = require('../../config/config');
const fantasyRoutes = require('./fantasy_routes')

const router = express.Router();

const defaultRoutes = [
  {
    path: '/service',
    route: fantasyRoutes,
  }
];

defaultRoutes?.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;
