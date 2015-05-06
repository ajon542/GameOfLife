
// every time the user drags their mouse
// this function will be executed
function onMouseDown(event) {
    
    // Request grid update from the server.
    requestGridUpdate();

}

function requestGridUpdate() {
    
    // Each Socket.IO connection has a unique session id
    var sessionId = io.socket.sessionid;
    var data = 100;
    io.emit('requestGridUpdate', data, sessionId);
}

function drawCell(row, col) {

    // Render the circle with Paper.js
    var circle = new Path.Circle(new Point(col*15 + 20, row*15 + 20), 5);
    circle.fillColor = '#ff0000';
}

// Listen for 'drawGrid' events
io.on('drawGrid', function (data) {
    
    console.log('drawGrid event recieved:', data);
    
    // Remove the previously drawn circles.
    project.activeLayer.removeChildren();
    
    // Draw the cells defined by the grid.
    for (var i = 0; i < data.length; ++i) {
        drawCell(data[i].row, data[i].col);
    }

    // Refresh the view, so we always get an update, even if the tab is not in focus.
    view.draw();
});