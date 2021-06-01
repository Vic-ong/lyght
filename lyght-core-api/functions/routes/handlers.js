const PhoneAuth = require('@/controllers/PhoneAuthController');
const User = require('@/controllers/UserController');
const Broadcast = require('@/controllers/BroadcastController');
const Weather = require('@/controllers/Weather');
const Order = require('@/controllers/OrderController');
const Logger = require('@/controllers/LoggerController');

const sendCodeHandler = (ctx) => new PhoneAuth(ctx).sendCode();
const verifyCodeHandler = (ctx) => new PhoneAuth(ctx).verifyCode();

const createAuth = (ctx) => new User(ctx).createAuth();

const notifyAccountApproved = (ctx) => new Broadcast(ctx).notifyAccountApproved();
const notifyOrderPlaced = (ctx) => new Broadcast(ctx).notifyOrderPlaced();
const notifyOrderPaid = (ctx) => new Broadcast(ctx).notifyOrderPaid();
const notifyOrderCancelled = (ctx) => new Broadcast(ctx).notifyOrderCancelled();

const getCurrentWeather = (ctx) => new Weather(ctx).getCurrentWeather();

const createOrder = (ctx) => new Order(ctx).createOrder();
const cancelOrder = (ctx) => new Order(ctx).cancelOrder();

const createLogger = (ctx) => new Logger(ctx).createLogger();

module.exports = {
  sendCodeHandler,
  verifyCodeHandler,
  createAuth,
  notifyAccountApproved,
  notifyOrderPlaced,
  notifyOrderPaid,
  notifyOrderCancelled,
  getCurrentWeather,
  createOrder,
  cancelOrder,
  createLogger,
};
