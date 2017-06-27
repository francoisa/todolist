process.env.NODE_ENV = 'test'
require('babel-register')({
  ignore: /node_modules\/(?!jsdom)/
});

require("babel-polyfill");

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

const dom = new JSDOM('');
global.document = dom.window.document;
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};
