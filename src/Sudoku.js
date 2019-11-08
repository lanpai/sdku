function GetPossibleValues(grid, y, x, includeSelf) {
    let possible = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];

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
    }

    let gridY = Math.floor(y / 3) * 3;
    let gridX = Math.floor(x / 3) * 3;
    for (let ysub = gridY; ysub < gridY + 3; ysub++) {
        for (let xsub = gridX; xsub < gridX + 3; xsub++) {
            if (ysub !== y && xsub !== x) {
                let index = possible.indexOf(grid[ysub][xsub]);
                if (index !== -1)
                    possible.splice(index, 1);
            }
        }
    }

    return possible;
}

function CheckIndirectRemovable(grid, y, x) {
    let possible = [];
    for (let ysub = 0; ysub < 9; ysub++) {
        for (let xsub = 0; xsub < 9; xsub++) {
            if (GetPossibleValues(grid, ysub, xsub).indexOf(grid[y][x])) {
                possible.push([ ysub, xsub ]);
            }
        }
    }

    if (possible.length === 1 && y === possible[0][0] && x === possible[0][1])
        return true;
    else
        return false;
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


function Solve(grid, y = 0, x = 0) {
    let newGrid = [];
    for (let y = 0; y < grid.length; y++)
        newGrid.push(grid[y].slice());

    for (; y < newGrid.length; y++) {
        for (; x < newGrid[y].length; x++) {
            if (newGrid[y][x] === null) {
                let possible = GetPossibleValues(newGrid, y, x);

                if (possible.length === 0) {
                    return null;
                }
                else {
                    possible.sort(() => Math.random() - 0.5);
                    for (let possibility of possible) {
                        newGrid[y][x] = possibility;

                        let childValue = Solve(newGrid, y, x);
                        if (childValue !== null) {
                            newGrid = childValue;
                            break;
                        }
                    }
                }
            }
        }
        x = 0;
    }

    return newGrid;
}

function RemoveTiles(grid, difficulty, i = 0) {
    if (difficulty !== i) {
        let newGrid = [];
        for (let y = 0; y < grid.length; y++)
            newGrid.push(grid[y].slice());

        let removable = [];

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] !== null) {
                    let possible = GetPossibleValues(grid, y, x);
                    if (possible.length === 1)
                        removable.push([ y, x ]);
                    //else if (CheckIndirectRemovable(grid, y, x))
                    //    removable.push([ y, x ]);
                }
            }
        }

        if (removable.length === 0)
            return null;

        removable.sort(() => Math.random() - 0.5);

        i++;

        for (let j = 0; j < removable.length; j++) {
            let prevValue = newGrid[removable[j][0]][removable[j][1]];
            newGrid[removable[j][0]][removable[j][1]] = null;

            let childGrid = RemoveTiles(newGrid, difficulty, i);
            if (childGrid === null) {
                newGrid[removable[j][0]][removable[j][1]] = prevValue;
                continue;
            }
            else {
                return childGrid;
            }
        }
        return null;
    }
    else {
        return grid;
    }
}

function Generate(difficulty = 40) {
    let grid = [];
    for (let y = 0; y < 9; y++) {
        grid.push([]);
        for (let x = 0; x < 9; x++)
            grid[y].push(null);
    }

    grid = Solve(grid);

    return RemoveTiles(grid, difficulty);
}

export default { GetPossibleValues, CheckComplete, Solve, Generate };
