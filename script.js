function getSpeed() {
  return document.getElementById("speed").value;
}

let isDraggingStart = false;
let isDraggingEnd = false;
let isRunning = false;

const grid = document.getElementById("grid");
const rows = 20;
const cols = 20;

let start = { r: 0, c: 0 };
let end = { r: 19, c: 19 };

let cells = [];

// Stop dragging when mouse released anywhere
document.addEventListener("mouseup", () => {
  isDraggingStart = false;
  isDraggingEnd = false;
});

// Create grid
for (let r = 0; r < rows; r++) {
  let row = [];
  for (let c = 0; c < cols; c++) {
    const div = document.createElement("div");
    div.classList.add("cell");

    // CLICK / DRAG START
    div.addEventListener("mousedown", () => {
      if (div.classList.contains("start")) {
        isDraggingStart = true;
      } else if (div.classList.contains("end")) {
        isDraggingEnd = true;
      } else {
        // Toggle wall → weight → empty
        if (div.classList.contains("wall")) {
          div.classList.remove("wall");
          div.classList.add("weight");
        } else if (div.classList.contains("weight")) {
          div.classList.remove("weight");
        } else {
          div.classList.add("wall");
        }
      }
    });

    // DRAGGING
    div.addEventListener("mouseover", () => {
      // Move START
      if (isDraggingStart && !div.classList.contains("wall")) {
        document.querySelector(".start").classList.remove("start");
        div.classList.add("start");

        let index = [...grid.children].indexOf(div);
        start = {
          r: Math.floor(index / cols),
          c: index % cols
        };
      }

      // Move END
      if (isDraggingEnd && !div.classList.contains("wall")) {
        document.querySelector(".end").classList.remove("end");
        div.classList.add("end");

        let index = [...grid.children].indexOf(div);
        end = {
          r: Math.floor(index / cols),
          c: index % cols
        };
      }
    });

    grid.appendChild(div);
    row.push(div);
  }
  cells.push(row);
}

// Initial start/end
cells[start.r][start.c].classList.add("start");
cells[end.r][end.c].classList.add("end");


// ================= BFS =================
function runBFS() {
  if (isRunning) return;
  isRunning = true;

  let queue = [[start.r, start.c]];
  let visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  let parent = {};

  visited[start.r][start.c] = true;

  let i = 0;

  function bfsStep() {
    if (queue.length === 0) {
      isRunning = false;
      return;
    }

    let [r, c] = queue.shift();

    if (r === end.r && c === end.c) {
      drawPath(parent);
      isRunning = false;
      return;
    }

    let directions = [[1,0], [-1,0], [0,1], [0,-1]];

    for (let [dr, dc] of directions) {
      let nr = r + dr;
      let nc = c + dc;

      if (
        nr >= 0 && nc >= 0 && nr < rows && nc < cols &&
        !visited[nr][nc] &&
        !cells[nr][nc].classList.contains("wall")
      ) {
        queue.push([nr, nc]);
        visited[nr][nc] = true;
        parent[`${nr}-${nc}`] = [r, c];

        setTimeout(() => {
          if (!cells[nr][nc].classList.contains("end")) {
            cells[nr][nc].classList.add("visited");
          }
        }, i * getSpeed());

        i++;
      }
    }

    setTimeout(bfsStep, getSpeed());
  }

  bfsStep();
}


// ================= DRAW PATH =================
function drawPath(parent) {
  let cur = `${end.r}-${end.c}`;
  let delay = 0;

  while (parent[cur]) {
    let [r, c] = parent[cur];

    setTimeout(() => {
      if (
        !cells[r][c].classList.contains("start") &&
        !cells[r][c].classList.contains("end")
      ) {
        cells[r][c].classList.add("path");
      }
    }, delay);

    delay += 30;
    cur = `${r}-${c}`;
  }
}


// ================= CLEAR =================
function clearGrid() {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.classList.remove("visited", "path", "wall", "weight", "start", "end");
  });

  cells[start.r][start.c].classList.add("start");
  cells[end.r][end.c].classList.add("end");

  isRunning = false;
}


// ================= DIJKSTRA =================
function runDijkstra() {
  if (isRunning) return;
  isRunning = true;

  let dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  let visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  let parent = {};

  dist[start.r][start.c] = 0;

  let i = 0;

  function step() {
    let minDist = Infinity;
    let curr = null;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!visited[r][c] && dist[r][c] < minDist) {
          minDist = dist[r][c];
          curr = [r, c];
        }
      }
    }

    if (!curr) {
      isRunning = false;
      return;
    }

    let [r, c] = curr;
    visited[r][c] = true;

    if (
      !cells[r][c].classList.contains("start") &&
      !cells[r][c].classList.contains("end")
    ) {
      setTimeout(() => {
        cells[r][c].classList.add("visited");
      }, i * getSpeed());
    }

    if (r === end.r && c === end.c) {
      drawPath(parent);
      isRunning = false;
      return;
    }

    let directions = [[1,0], [-1,0], [0,1], [0,-1]];

    for (let [dr, dc] of directions) {
      let nr = r + dr;
      let nc = c + dc;

      if (
        nr >= 0 && nc >= 0 && nr < rows && nc < cols &&
        !cells[nr][nc].classList.contains("wall")
      ) {
        let weight = cells[nr][nc].classList.contains("weight") ? 5 : 1;

        let newDist = dist[r][c] + weight;

        if (newDist < dist[nr][nc]) {
          dist[nr][nc] = newDist;
          parent[`${nr}-${nc}`] = [r, c];
        }
      }
    }

    i++;
    setTimeout(step, getSpeed());
  }

  step();
}