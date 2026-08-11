import { httpServerHandler } from 'cloudflare:node';
// Keep requiring your standard server file as usual
const app = require('./server');

const handler = httpServerHandler({
  fetch: app.handle.bind(app),
});

export default {
  fetch: handler.fetch
};