function GetPossibleValues(grid, y, x) {
    let possible = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];

    let gridY = Math.floor(y / 3) * 3;
    let gridX = Math.floor(x / 3) * 3;
    for (let i = 0; i < 9; i++) {
        if (i !== y) {
            let index = possible.indexOf(grid[i][x]);
            if (index !== -1)
                possible.splice(index, 1);
        }

        if (i !== x) {
            let index = possible.indexOf(grid[y][i]);
            if (index !== -1)
                possible.splice(index, 1);
        }

        let ysub = gridY + Math.floor(i / 3);
        let xsub = gridX + (i % 3);
        if (ysub !== y && xsub !== x) {
            let index = possible.indexOf(grid[ysub][xsub]);
            if (index !== -1)
                possible.splice(index, 1);
        }
    }

    return possible;
}

function CheckComplete(grid) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            let possible = GetPossibleValues(grid, y, x);
            if (possible.length === 1) {
                if (possible[0] === grid[y][x])
                    continue;
                else
                    return false;
            }
            else {
                return false;
            }
        }
    }
    return true;
}

function Solve(grid, count = 0, y = 0, x = 0) {
    if (y === 9)
        return 1;

    if (grid[y][x] !== null) {
        let childValue = Solve(grid, count, (x === 8) ? y + 1 : y, (x + 1) % 9);
        return childValue;
    }

    let sum = 0;
    for (let possible of GetPossibleValues(grid, y, x).sort(() => Math.random() - 0.5)) {
        grid[y][x] = possible;

        let childValue = Solve(grid, count, (x === 8) ? y + 1 : y, (x + 1) % 9);
        if (childValue !== 0) {
            if (count !== 0) {
                sum += childValue;
                if (sum === count)
                    return sum;
            }
            else
                return childValue;
        }

        grid[y][x] = null;
    }

    return sum;
}

function CheckNumSolutions(grid, y, x, max) {
    let newGrid = [];
    for (let y = 0; y < grid.length; y++)
        newGrid.push(grid[y].slice());

    if (y !== null && x !== null)
        newGrid[y][x] = null;

    return Solve(newGrid, true, max);
}

function RemoveTiles(grid, difficulty, possible, i = 0) {
    let newGrid = [];
    for (let y = 0; y < grid.length; y++)
        newGrid.push(grid[y].slice());

    if (i !== difficulty) {
        for (let loc = possible.length - 1; loc >= 0; loc--)
            if (CheckNumSolutions(newGrid, possible[loc][0], possible[loc][1], 2) !== 1)
                possible.splice(loc, 1);

        if (possible.length === 0)
            return null;

        for (let loc = possible.length - 1; loc >= 0; loc--) {
            let prevVal = newGrid[possible[loc][0]][possible[loc][1]];
            newGrid[possible[loc][0]][possible[loc][1]] = null;

            let newPossible = possible.slice();
            newPossible.splice(loc, 1);
            let childValue = RemoveTiles(newGrid, difficulty, newPossible, i + 1);
            if (childValue === null) {
                newGrid[possible[loc][0]][possible[loc][1]] = prevVal;
                possible.splice(loc, 1);
                continue;
            }
            else {
                return childValue;
            }
        }
        return null;
    }

    return newGrid;
}

function Generate(difficulty = 46) {
    let a = Date.now();
    let grid = [];
    for (let y = 0; y < 9; y++) {
        grid.push([]);
        for (let x = 0; x < 9; x++)
            grid[y].push(null);
    }

    Solve(grid);
    let b = Date.now();

    let possible = [];

    for (let i = 0; i < 81; i++) {
        let y = Math.floor(i / 9);
        let x = i % 9;
        possible.push([ Math.floor(i / 9), i % 9 ]);
    }

    let shuffled = [];
    let initLength = possible.length;
    for (let i = 0; i < initLength; i++)
        shuffled.push(possible.splice(Math.floor(Math.random() * possible.length), 1)[0]);

    let removed = RemoveTiles(grid, difficulty, shuffled);

    let c = Date.now();
    console.log(b-a, c-b)

    return removed;
}

export default { GetPossibleValues, CheckComplete, Solve, Generate };
