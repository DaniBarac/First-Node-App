const div = document.getElementById("grid");

var w = 30;
var h = 15;
var size;

var startCell;
var destCell;

class State {
    constructor() {
        this.state = 'none';
    }
    set(state) {
        if(state === 'doneCalc' || this.state !== 'calcSSSP') {
            this.state = state;
        }
    }

    get() {
        return this.state;
    }
}

class Queue {
    constructor() {
        this.data = [];
    }
    queue(el) {
        this.data.push(el);
    }
    peek() {
        return this.data[0];
    }
    dequeue() {
        // console.log(`data before: ${this.data}`);
        let result = this.data.shift();
        // console.log(`data after: ${this.data}`);
        return result;
    }
    length() {
        return this.data.length;
    }
}

var state = new State();

const handleCell = (e) => {
    let cell = document.elementFromPoint(e.clientX, e.clientY);

    switch(state.get()) {
        case 'setSource':
            try {
                startCell.removeAttribute('id');
            } catch (ignored) {}
            finally {
                startCell = cell;
                cell.setAttribute('id', 'start');
            }
            break;
        case 'setDest':
            try {
                destCell.removeAttribute('id');
            } catch (ignored) {}
            finally {
                destCell = cell;
                cell.setAttribute('id', 'dest');
            }
            break;
        case 'setWall':
            cell.classList.add('wall');
            break;
        case 'start':
            break;
        case 'calcSSSP':
            break;
        case 'doneCalc':
            break;
    }
}

var grid;
var maze;
async function initGrid() {
    div.innerHTML = '';
    size = parseInt(sizeTextBox.value);
    w = ~~(div.offsetWidth / size);
    h = w;
    div.style.width = `${w * size}px;`;
    startCell = null;
    destCell = null;
    grid = [];
    if(mazeCheckbox.checked)
        maze = new MazeBuilder(w, h);
    for(let i = 0; i < h; i++) {
        grid.push([]);
        let row = document.createElement("div");
        row.style.cssText = `width: ${size * w}px; height: ${size}px;`;
        div.appendChild(row);
        for(let j = 0; j < w; j++) {
            var cell = document.createElement("div");

            cell.setAttribute('data-i', i);
            cell.setAttribute('data-j', j);
            cell.setAttribute('data-dist', 1000000);
            cell.setAttribute('class', 'cell');

            grid[i].push(cell);
            
            if(mazeCheckbox.checked)
                if(maze.maze[i][j].includes('wall'))
                    cell.classList.add('wall');

            cell.style.cssText = 
                `width: ${size}px; 
                height: ${size}px;`;
            cell.ondrag = handleCell;
            cell.onclick = handleCell;
            row.appendChild(cell);
        }
    }
}

initGrid();

function dist (cell, dest=destCell) {
    let i = parseInt(dest.getAttribute('data-i'));
    let j = parseInt(dest.getAttribute('data-j'));
    
    let i1 = parseInt(cell.getAttribute('data-i'));
    let j1 = parseInt(cell.getAttribute('data-j'));

    return Math.sqrt(Math.abs(i - i1)**2 + Math.abs(j - j1)**2);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function onStart () {
    if(startCell && destCell) {
        state.set('calcSSSP');

        var queue = new PriorityQueue({ comparator: (a, b) => { 
            let distA = parseInt(a.getAttribute("data-dist"));
            let distB = parseInt(b.getAttribute("data-dist"));
            return (distA + dist(a) - distB - dist(b)); 
        }});
        // var queue = new Queue();
        queue.queue(startCell);
        
        var pred = [];
        for(let y = 0; y < h; y++) {
            pred[y] = [];
            for(let x = 0; x < w; x++) {
                pred[y][x] = null;
            }
        }
        startCell.setAttribute('data-dist', 0);

        const addNeighbobr = (i, j) => {
            var dist = parseInt(grid[i][j].getAttribute('data-dist'));
            if(currDist + 1 < dist) {
                pred[i][j] = currCell;
                grid[i][j].setAttribute('data-dist', (currDist + 1));
            }
            if (!grid[i][j].classList.contains('visited') && !grid[i][j].classList.contains('wall')) { 
                queue.queue(grid[i][j]);    
                grid[i][j].classList.add('visited', 'leaf');
                delay = true;
            }
        }
        
        while (queue.peek() !== destCell) {
            var currCell = queue.dequeue();
            currCell.classList.remove('leaf');
            var currDist = parseInt(currCell.getAttribute('data-dist'));
            let i = parseInt(currCell.getAttribute('data-i'));
            let j = parseInt(currCell.getAttribute('data-j'));
            var delay = false;
            if(i < h - 1) {
                addNeighbobr(i + 1, j);
            }
            if(i > 0) {
                addNeighbobr(i - 1, j);
            }
            if(j < w - 1) {
                addNeighbobr(i, j + 1);
            }
            if(j > 0) {
                addNeighbobr(i, j - 1);
            }
            if(delay) {
                await sleep(20);
            }
        }
        
        await sleep(400);

        let i = parseInt(destCell.getAttribute('data-i'));
        let j = parseInt(destCell.getAttribute('data-j'));
        var cell = pred[i][j];
        while(cell !== startCell) {
            cell.classList.remove('visited');
            cell.classList.add('path');
            let i = parseInt(cell.getAttribute('data-i'));
            let j = parseInt(cell.getAttribute('data-j'));
            cell = pred[i][j];

            await sleep(50);
        }
        state.set('doneCalc');
    }
}
