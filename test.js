const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

try {
  const html = fs.readFileSync('index.html', 'utf8');
  const dom = new JSDOM(html);
  global.document = dom.window.document;
  global.window = dom.window;

  const appCode = fs.readFileSync('app.js', 'utf8');
  eval(appCode);
  console.log("No runtime errors in app.js!");
} catch (err) {
  console.error("ERROR:", err);
}
