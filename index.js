let mapSizeLabelValue = document.getElementById("mapSizeLabelValue");
let cellSizeLabelValue = document.getElementById("cellSizeLabelValue");
let mapSizeInput = document.getElementById("mapSizeInput");
let cellSizeInput = document.getElementById("cellSizeInput");

let cellSize = +cellSizeInput.value;

addFunctionalsForSettingPannel();

function addFunctionalsForSettingPannel() {
  if (
    !!(mapSizeLabelValue && cellSizeLabelValue && mapSizeInput && cellSizeInput)
  ) {
    mapSizeInput.addEventListener("input", () =>
      updateElementContent(mapSizeLabelValue, mapSizeInput.value)
    );

    cellSizeInput.addEventListener("input", () => {
      updateElementContent(cellSizeLabelValue, cellSizeInput.value);
      cellSize = +cellSizeInput.value;
    });

    let createMapButton = document.getElementById("mapCreateButton");
    createMapButton.addEventListener("click", createPlaneMap, {
      once: true,
    });
  }
}

function updateElementContent(element, newValue) {
  element.innerHTML = newValue;
}

function createPlaneMap() {
  let map = document.createElement("div");
  map.id = "theMap";
  let cellsNumber = mapSizeInput.value;
  let mapSize = cellsNumber * cellSize + "px";
  map.style.minWidth = map.style.minHeight = mapSize;

  let mapWrapper = document.querySelector(".map-wrapper");
  let cellsGrid = createCellsGrid(cellsNumber, cellSize);
  map.innerHTML = cellsGrid;
  generateTerrain(map.children, cellsNumber);
  mapWrapper.append(map);
  document.addEventListener("keydown", filterKeyDowns);
}

function generateTerrain(cells, fieldSize) {
  // first cell (left top corner)
  let shadowMap = [[getRandomInt(0, 1) == 0 ? "grass" : "water"]];
  cells[0].classList.add(shadowMap[0][0]);

  // first cells row (top side)
  for (let j = 1; j < fieldSize; j++) {
    let randomInt = getRandomInt(0, 6);
    let grassChanses = 0;
    if (shadowMap[0][j - 1] == "grass") {
      grassChanses += 5;
    }
    shadowMap[0][j] = randomInt <= grassChanses ? "grass" : "water";
    cells[j].classList.add(shadowMap[0][j]);
  }

  // other cells
  for (let i = 1; i < fieldSize; i++) {
    shadowMap.push([]);
    for (let j = 0; j < fieldSize; j++) {
      // first column (left side)
      if (j == 0) {
        let grassChanses = 0;
        if (shadowMap[i - 1][0] == "grass") {
          grassChanses += 5;
        }
        if (shadowMap[i][1] == "grass") {
          grassChanses++;
        }
        let randomInt = getRandomInt(0, 7);
        shadowMap[i][0] = randomInt <= grassChanses ? "grass" : "water";
        cells[i * fieldSize].classList.add(shadowMap[i][0]);
      } else if (j != fieldSize - 1) {
        // main cells part
        let grassChanses = 0;
        if (shadowMap[i][j - 1] == "grass") {
          grassChanses += 5;
        }
        if (shadowMap[i - 1][j - 1] == "grass") {
          grassChanses++;
        }
        if (shadowMap[i - 1][j] == "grass") {
          grassChanses += 5;
        }
        if (shadowMap[i - 1][j + 1] == "grass") {
          grassChanses++;
        }
        let randomInt = getRandomInt(0, 13);
        shadowMap[i][j] = randomInt <= grassChanses ? "grass" : "water";
        cells[i * fieldSize + j].classList.add(shadowMap[i][j]);
      } else {
        // last cells column
        let grassChanses = 0;
        if (shadowMap[i][j - 1] == "grass") {
          grassChanses += 5;
        }
        if (shadowMap[i - 1][j - 1] == "grass") {
          grassChanses++;
        }
        if (shadowMap[i - 1][j] == "grass") {
          grassChanses += 5;
        }
        let randomInt = getRandomInt(0, 11);
        shadowMap[i][j] = randomInt <= grassChanses ? "grass" : "water";
        cells[i * fieldSize + j].classList.add(shadowMap[i][j]);
      }
    }
  }
}

function createCellsGrid(cellsNumber, cellSize) {
  let cellsGrid = "";
  for (let i = 1; i <= cellsNumber; i++) {
    for (let j = 1; j <= cellsNumber; j++) {
      cellsGrid += `<div style="width: ${cellSize}px; height: ${cellSize}px;" class="map-cell""></div>`;
    }
  }
  return cellsGrid;
}

function getRandomInt(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function filterKeyDowns(event) {
  if (
    ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(event.code)
  ) {
    moveMap(event.code);
  }
}

function moveMap(key) {
  let map = document.getElementById("theMap");
  switch (key) {
    case "ArrowUp":
      map.style.top = `${(parseInt(map.style.top) || 0) + cellSize}px`;
      // transform: translateY(17px);
      // map.style.transform = `translateY(${
      //   (parseInt(map.style.top) || 0) + cellSize
      // }px)`;
      break;
    case "ArrowRight":
      map.style.left = `${(parseInt(map.style.left) || 0) - cellSize}px`;
      break;
    case "ArrowDown":
      map.style.top = `${(parseInt(map.style.top) || 0) - cellSize}px`;
      break;
    case "ArrowLeft":
      map.style.left = `${(parseInt(map.style.left) || 0) + cellSize}px`;
      break;
  }
}
