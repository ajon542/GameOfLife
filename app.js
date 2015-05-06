
// Express requires these dependencies
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// Game of Life variables.
var GameOfLife = require('./gameOfLife');
var rows = 30;
var cols = 50;
var gameOfLife = new GameOfLife(rows, cols);

// Configure our application
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

// Configure error handling
app.configure('development', function () {
    app.use(express.errorHandler());
});

// Setup Routes
app.get('/', routes.index);
app.get('/users', user.list);

// Enable Socket.io
var server = http.createServer(app).listen(app.get('port'));
var io = require('socket.io').listen(server);

// A user connects to the server (opens a socket)
io.sockets.on('connection', function (socket) {
    
    // (2): The server recieves a ping event
    // from the browser on this socket
    socket.on('ping', function (data) {
        
        console.log('socket: server recieves ping (2)');
        
        // (3): Emit a pong event all listening browsers
        // with the data from the ping event
        io.sockets.emit('pong', data);
        
        console.log('socket: server sends pong to all (3)');

    });
    
    socket.on('requestGridUpdate', function (data, session) {
        
        console.log("session " + session + " requests grid update:");
        console.log(data);
        
        setInterval(function () {
            socket.emit('drawGrid', gameOfLife.generate());
        }, 100);    
    });

});



