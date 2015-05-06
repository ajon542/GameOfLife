
// Express requires these dependencies
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// Game of Life variables.
var GameOfLife = require('./gameOfLife');
var rows = 110;
var cols = 150;
var gameOfLife = new GameOfLife(rows, cols);
var cells = [
    { row: 20, col: 20 },
    { row: 20, col: 21 },
    { row: 20, col: 24 },
    { row: 20, col: 25 },
    { row: 20, col: 26 },
    { row: 19, col: 23 },
    { row: 18, col: 21 }
];

// Glider.
var gliderCells = [
    { row: 20, col: 20 },
    { row: 21, col: 20 },
    { row: 22, col: 20 },
    { row: 22, col: 19 },
    { row: 21, col: 18 }
];

// Infinite growth cells.
var infiniteGrowthCells = [
    { row: 60, col: 70 },
    { row: 60, col: 71 },
    { row: 60, col: 72 },
    { row: 60, col: 74 },

    { row: 61, col: 70 },

    { row: 62, col: 73 },
    { row: 62, col: 74 },

    { row: 63, col: 71 },
    { row: 63, col: 72 },
    { row: 63, col: 74 },

    { row: 64, col: 70 },
    { row: 64, col: 72 },
    { row: 64, col: 74 }
];

// Pulsar cells.
var pulsarCells = [
    { row: 20, col: 22 },
    { row: 20, col: 23 },
    { row: 20, col: 24 },

    { row: 21, col: 20 },
    { row: 21, col: 25 },

    { row: 22, col: 20 },
    { row: 22, col: 25 },

    { row: 23, col: 20 },
    { row: 23, col: 25 },

    { row: 25, col: 22 },
    { row: 25, col: 23 },
    { row: 25, col: 24 }
];

gameOfLife.setCells(infiniteGrowthCells);

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



