var Grid = function(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.grid = Grid.prototype.init(rows, cols, 0);
}

Grid.prototype.init = function (rows, cols, initial) {
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

Grid.prototype.setCell = function (row, col, value) {
    this.grid[row][col] = value;
}

Grid.prototype.getCell = function (row, col) {
    return this.grid[row][col];
}

Grid.prototype.getNeighbourCount = function (row, col) {
    var count = 0;

    if (this.grid[(row - 1).mod(this.rows)][(col - 1).mod(this.cols)] == 1) {
        count++;
    }
    if (this.grid[(row - 1).mod(this.rows)][(col).mod(this.cols)] == 1) {
        count++;
    }
    if (this.grid[(row - 1).mod(this.rows)][(col + 1).mod(this.cols)] == 1) {
        count++;
    }

    if (this.grid[(row).mod(this.rows)][(col - 1).mod(this.cols)] == 1) {
        count++;
    }
    if (this.grid[(row).mod(this.rows)][(col + 1).mod(this.cols)] == 1) {
        count++;
    }

    if (this.grid[(row + 1).mod(this.rows)][(col - 1).mod(this.cols)] == 1) {
        count++;
    }
    if (this.grid[(row + 1).mod(this.rows)][(col).mod(this.cols)] == 1) {
        count++;
    }
    if (this.grid[(row + 1).mod(this.rows)][(col + 1).mod(this.cols)] == 1) {
        count++;
    }

    return count;
}

Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
}

module.exports = Grid;