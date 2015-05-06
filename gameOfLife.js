var Grid = require('./grid');

var GameOfLife = function (rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.grid = new Grid(rows, cols);

    for (var row = 0; row < rows; ++row) {
        for (var col = 0; col < cols; ++col) {
            if (Math.random() < 0.7) {
                this.grid.setCell(row, col, 1);
            }
        }
    }
}

// cool pattern to start with
/*grid.setCell(20, 20, 1);
grid.setCell(20, 21, 1);
grid.setCell(20, 24, 1);
grid.setCell(20, 25, 1);
grid.setCell(20, 26, 1);
grid.setCell(19, 23, 1);
grid.setCell(18, 21, 1);*/

GameOfLife.prototype.setCells = function (cellList) {
    for (var i = 0; i < cellList.length; ++i) {
        this.grid.setCell(cellList[i].row, cellList[i].col);
    }
}

GameOfLife.prototype.generate = function () {
    
    var gridCells = [];
    
    // Create a blank grid to work with.
    var gridUpdate = new Grid(this.rows, this.cols);
    
    // Update the blank grid with the cell existence.
    for (var row = 0; row < this.rows; ++row) {
        for (var col = 0; col < this.cols; ++col) {
            if (determineExistence(this.grid, row, col)) {
                gridUpdate.setCell(row, col, 1);
                gridCells.push({ row: row, col: col });
            }
        }
    }
    
    // Copy the grid back to the original.
    this.grid.copy(gridUpdate, this.rows, this.cols);
    return gridCells;
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

module.exports = GameOfLife;