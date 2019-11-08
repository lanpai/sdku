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

        let ysub = gridY + Math.floor(i / 3)
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

function Solve(grid, count = false, y = 0, x = 0) {
    let newGrid = { value: [], count: 0 };
    for (let y = 0; y < grid.length; y++)
        newGrid.value.push(grid[y].slice());

    for (; y < newGrid.value.length; y++) {
        for (; x < newGrid.value[y].length; x++) {
            if (newGrid.value[y][x] === null) {
                let possible = GetPossibleValues(newGrid.value, y, x);

                if (possible.length === 0) {
                    return null;
                }
                else {
                    possible.sort(() => Math.random() - 0.5);
                    let validGrid = null;
                    for (let possibility of possible) {
                        newGrid.value[y][x] = possibility;

                        let childValue = Solve(newGrid.value, count, y, x);
                        if (childValue !== null) {
                            newGrid.count += childValue.count;
                            validGrid = childValue.value;
                            if (!count)
                                break;
                        }
                    }
                    if (validGrid === null)
                        return null;
                    newGrid.value = validGrid;
                }
            }
        }
        x = 0;
    }

    newGrid.count === 0 && (newGrid.count = 1);
    return newGrid;
}

function CheckNumSolutions(grid, y, x) {
    let newGrid = [];
    for (let y = 0; y < grid.length; y++)
        newGrid.push(grid[y].slice());

    if (y !== null && x !== null)
        newGrid[y][x] = null;

    return Solve(grid, true).count;
}

function RemoveTiles(grid, difficulty, i = 0) {
    let newGrid = [];
    for (let y = 0; y < grid.length; y++)
        newGrid.push(grid[y].slice());

    if (i !== difficulty) {
        let possible = [];

        for (let i = 0; i < 81; i++) {
            let y = Math.floor(i / 9);
            let x = i % 9;

            if (newGrid[y][x] === null)
                continue;

            if (CheckNumSolutions(newGrid, y, x) === 1)
                possible.push([ y, x ]);
        }

        if (possible.length === 0)
            return null;

        possible.sort(() => Math.random() - 0.5);

        for (let loc of possible) {
            let prevVal = newGrid[loc[0]][loc[1]];
            newGrid[loc[0]][loc[1]] = null;

            let childValue = RemoveTiles(newGrid, difficulty, i + 1);
            if (childValue === null) {
                newGrid[loc[0]][loc[1]] = prevVal;
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

function Generate(difficulty = 45) {
    let grid = [];
    for (let y = 0; y < 9; y++) {
        grid.push([]);
        for (let x = 0; x < 9; x++)
            grid[y].push(null);
    }

    grid = Solve(grid).value;

    return RemoveTiles(grid, difficulty);
}

export default { GetPossibleValues, CheckComplete, Solve, Generate };
