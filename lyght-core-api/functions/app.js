require('module-alias/register');

const dotenv = require('dotenv');
const Koa = require('koa');
const cors = require('@koa/cors');
const logger = require('koa-logger');

const router = require('./routes');

// Setup
const app = new Koa();

dotenv.config();
app.use(cors());
app.use(logger());

// Error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const status = err.statusCode || err.status || 500;
    err.status = status;
    ctx.status = status;
    ctx.body = {
      error: err.message || err,
    };
    ctx.app.emit('error', err, ctx);
  }
});

// Request header
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  await next();
});

// Routes
app.use(router.routes());

// Error logging
app.on('error', (err) => {
  console.log('Internal Server Error!\n', err);
});

module.exports = app;
