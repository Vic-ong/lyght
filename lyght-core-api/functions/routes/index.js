const Router = require('koa-router');

// controllers
const h = require('./handlers');

// Config for API routing -- router.use(path, middlewares, routing function)
const router = new Router();

// Routes
router.get('/', async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    result: 'TEST ok',
  };
});

const routerConfigs = [
  {
    route: '/auth/phone/sendCode',
    method: 'post',
    handler: h.sendCodeHandler,
  },
  {
    route: '/auth/phone/verifyCode',
    method: 'post',
    handler: h.verifyCodeHandler,
  },
  {
    route: '/auth/create',
    method: 'post',
    handler: h.createAuth,
  },
  {
    route: '/broadcast/accountApproved',
    method: 'post',
    handler: h.notifyAccountApproved,
  },
  {
    route: '/broadcast/orderPlaced',
    method: 'post',
    handler: h.notifyOrderPlaced,
  },
  {
    route: '/broadcast/orderPaid',
    method: 'post',
    handler: h.notifyOrderPaid,
  },
  {
    route: '/broadcast/orderCancelled',
    method: 'post',
    handler: h.notifyOrderCancelled,
  },
  {
    route: '/weather/current',
    method: 'post',
    handler: h.getCurrentWeather,
  },
  {
    route: '/order/create',
    method: 'post',
    handler: h.createOrder,
  },
  {
    route: '/order/cancel',
    method: 'post',
    handler: h.cancelOrder,
  },
  {
    route: '/logger',
    method: 'post',
    handler: h.createLogger,
  },
];

routerConfigs.forEach(({ route, method, handler }) => {
  router[method](route, async (ctx) => {
    const { status, body } = await handler(ctx);
    ctx.status = status;
    ctx.body = body;
  });
});

module.exports = router;
