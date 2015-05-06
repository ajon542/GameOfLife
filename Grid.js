// TODO: May want user to supply the neighbours.
var neighbours = [
    { row: -1, col: -1 },
    { row: -1, col: 0 },
    { row: -1, col: 1 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
    { row: 1, col: -1 },
    { row: 1, col: 0 },
    { row: 1, col: 1 }
];

/// <summary>
/// Construct a grid object given the number of rows and columns.
/// </summary>
var Grid = function (rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.grid = init(rows, cols, 0);
}

/// <summary>
/// Initialize a 2D array with an initial value given the number of rows and columns.
/// </summary>
function init (rows, cols, initial) {
    var arr = [];
    for (var i = 0; i < rows; ++i) {
        var columns = [];
        for (var j = 0; j < cols; ++j) {
            columns[j] = initial;
        }
        arr[i] = columns;
    }
    return arr;
}

/// <summary>
/// Copy a given grid try to this object.
/// </summary>
Grid.prototype.copy = function (grid, rows, cols) {
    this.grid = [];
    for (var i = 0; i < rows; ++i) {
        var columns = [];
        for (var j = 0; j < cols; ++j) {
            columns[j] = grid.getCell(i, j);
        }
        this.grid[i] = columns;
    }
}

/// <summary>
/// Print the grid to the console.
/// </summary>
Grid.prototype.print = function () {
    console.log("-------------------------");
    for (var i = 0; i < this.rows; ++i) {
        for (var j = 0; j < this.cols; ++j) {
            process.stdout.write(this.grid[i][j] + " ");
        }
        console.log();
    }
    console.log("-------------------------");
}

/// <summary>
/// Set a cell in the grid to a specific value.
/// </summary>
Grid.prototype.setCell = function (row, col, value) {
    this.grid[row][col] = value;
}

/// <summary>
/// Get the value of a cell in the grid.
/// </summary>
Grid.prototype.getCell = function (row, col) {
    return this.grid[row][col];
}

/// <summary>
/// Get the count of neighbours to a given cell.
/// </summary>
Grid.prototype.getNeighbourCount = function (row, col) {
    var count = 0;
    
    for (var i = 0; i < neighbours.length; ++i) {
        var r = (row + neighbours[i].row).mod(this.rows);
        var c = (col + neighbours[i].col).mod(this.cols);
        if (this.grid[r][c]) {
            count++;
        }
    }

    return count;
}

/// <summary>
/// Mod calculation is not well defined for negative numbers.
/// http://stackoverflow.com/questions/4467539/javascript-modulo-not-behaving
/// </summary>
Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
}

module.exports = Grid;