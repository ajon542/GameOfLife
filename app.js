
// Express requires these dependencies
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

var Grid = require('./grid');

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
            generate();
            socket.emit('drawGrid', grid);
        }, 50);    
    });

});

var rows = 50;
var cols = 70;
var grid = new Grid(rows, cols);
grid.setCell(20, 20, 1);
grid.setCell(20, 21, 1);
grid.setCell(20, 24, 1);
grid.setCell(20, 25, 1);
grid.setCell(20, 26, 1);
grid.setCell(19, 23, 1);
grid.setCell(18, 21, 1);


function generate() {
    
    // Create a blank grid to work with.
    var gridUpdate = new Grid(rows, cols);
    
    // Update the blank grid with the cell existence.
    for (var row = 0; row < rows; ++row) {
        for (var col = 0; col < cols; ++col) {
            gridUpdate.setCell(row, col, determineExistence(grid, row, col));
        }
    }
    
    // Copy the grid back to the original.
    grid.copy(gridUpdate, rows, cols);
}

function determineExistence(grid, row, col) {
    
    var cellExists = grid.getCell(row, col);
    var neighbourCount = grid.getNeighbourCount(row, col);
    
    if (cellExists) {
        // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
        if (neighbourCount < 2) {
            cellExists = 0;
        }
        
        // Any live cell with two or three live neighbours lives on to the next generation.
        if (neighbourCount == 2 || neighbourCount == 3) {
            cellExists = 1;
        }
        
        // Any live cell with more than three live neighbours dies, as if by overcrowding.
        if (neighbourCount > 3) {
            cellExists = 0;
        }

    } else {
        // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        if (neighbourCount == 3) {
            cellExists = 1;
        }
    }
    
    return cellExists;
}