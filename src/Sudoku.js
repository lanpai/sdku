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

function CheckPossiblePerValue(grid, y, x) {
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

function CheckIndirectRemovable(grid, y, x) {
    return false;

    let gridY = Math.floor(y / 3) * 3;
    let gridX = Math.floor(x / 3) * 3;
    for (let i = 0; i < 9; i++) {
        if (i !== y && grid[i][x] === null) {
            if (GetPossibleValues(grid, i, x).indexOf(grid[y][x] !== -1))
                return false;
        }

        if (i !== x && grid[y][i] === null) {
            if (GetPossibleValues(grid, y, i).indexOf(grid[y][x] !== -1))
                return false;
        }

        let ysub = gridY + Math.floor(i / 3)
        let xsub = gridX + (i % 3);
        if (ysub !== y && xsub !== x && grid[ysub][xsub] === null) {
            if (GetPossibleValues(grid, ysub, xsub))
                return false;
        }
    }

    return true;
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
                    if (GetPossibleValues(grid, y, x).length === 1 ||
                        CheckIndirectRemovable(grid, y, x))
                        removable.push([ y, x ]);
                    //else if (CheckPossiblePerValue(grid, y, x))
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

function Generate(difficulty = 0) {
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
