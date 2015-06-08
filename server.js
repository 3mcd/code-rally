var fs = require('fs');
var http = require('http');
var express = require('express');
var liveDbMongo = require('livedb-mongo');
var redis = require('redis').createClient();
var racerBrowserChannel = require('racer-browserchannel');
var racer = require('racer');
var stringify = require('stringify');
var handlebars = require('handlebars');

racer.use(require('racer-schema'), require('./schema'));
racer.use(require('racer-bundle'));

redis.select(14);

var store = racer.createStore({
  db: liveDbMongo('localhost:27017/code-rally?auto_reconnect', {safe: true}),
  redis: redis
});

app = express();
app
  .use(express.favicon())
  .use(express.compress())
  .use(express.static(process.cwd() + '/public'))
  .use(racerBrowserChannel(store))
  .use(store.modelMiddleware())
  .use(app.router);

app.use('/cm', express.static(process.cwd() + '/node_modules/codemirror/'));

app.use(function(err, req, res, next) {
  console.error(err.stack || (new Error(err)).stack);
  res.send(500, 'Something broke!');
});

var jsCache = {};

function scriptBundle(path, cb) {
  if (racer.util.isProduction && jsCache[path]) {
    cb(null, jsCache[path]);
  }
  // Use Browserify to generate a script file containing all of the client-side
  // scripts, Racer, and BrowserChannel
  store.bundle(path, {
    transform: stringify({
      extensions: ['.html'], minify: true
    })
  }, function(err, js) {
    if (err) return cb(err);
    jsCache[path] = js;
    cb(null, js);
  });
}

app.get('/normalize.css', function (req, res, next) {
  res.type('css');
  res.send(fs.readFileSync(__dirname + '/node_modules/normalize.css/normalize.css'));
});

app.get('/client.js', function(req, res, next) {
  scriptBundle(__dirname + '/apps/client/index.js', function(err, js) {
    if (err) return next(err);
    res.type('js');
    res.send(js);
  });
});

app.get('/render.js', function (req, res, next) {
  scriptBundle(__dirname + '/apps/render/index.js', function (err, js) {
    if (err) return next(err);
    res.type('js');
    res.send(js);
  });
});

var renderTemplate = fs.readFileSync(__dirname + '/public/render.html', 'utf-8');
var renderPage = handlebars.compile(renderTemplate);

app.get('/render/:roomId', function (req, res, next) {
  var html = renderPage({ roomId: req.params.roomId });
  res.send(html);
});

app.get('/model/rooms/:roomId', function(req, res, next) {
  var model = req.getModel();
  var roomId = req.params.roomId;
  
  if (!/^[a-zA-Z0-9_-]+$/.test(roomId)) return next();

  var roomPath = 'rooms.' + roomId;

  model.subscribe(roomPath, function(err) {
    if (err) return next(err);

    var scoped = model.ref('_page.room', roomPath);

    if (!scoped.get()) {
      scoped.set({
        name: roomId,
        reload: false,
        main: '',
        editors: [
          { name: 'html', mode: 'text/html', text: '<p>Test</p>' }
        ]
      });
    }

    model.bundle(function(err, bundle) {
      if (err) return next(err);
      res.send(JSON.stringify(bundle));
    });
  });
});

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/public/client.html');
});

var port = process.env.PORT || 51893;

http.createServer(app).listen(port, function() {
  console.log('Go to http://localhost:' + port);
});