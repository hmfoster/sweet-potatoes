import express from 'express';
var EventEmitter = require('events').EventEmitter;

const app = express();
const emitter = new EventEmitter();

export default function startServer(store){
  const server = app.listen(3000);
  emitter.on('action', store.dispatch.bind(store));
}