/// <summary>
/// Mouse down event handler called from paper.js.
/// </summary>
function onMouseDown(event) {
    
    // Request grid update from the server.
    requestGridUpdate();

}

/// <summary>
/// Request the server to update the life grid.
/// </summary>
function requestGridUpdate() {
    
    // Each Socket.IO connection has a unique session id
    var sessionId = io.socket.sessionid;
    var data = 100;
    io.emit('requestGridUpdate', data, sessionId);
}

/// <summary>
/// Draw a cell at the given row and column.
/// </summary>
function drawCell(row, col) {

    // Render the circle with paper.js.
    var circle = new Path.Circle(new Point(col*10 + 20, row*10 + 20), 5);
    circle.fillColor = '#ff0000';
}

/// <summary>
/// Listen for 'drawGrid' events from the server.
/// </summary>
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