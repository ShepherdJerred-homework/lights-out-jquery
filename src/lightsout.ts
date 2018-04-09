interface Game {
  maxX: number;
  maxY: number;
  randomization: number;
  board: JQuery[][];
}

interface Coordinate {
  x: number;
  y: number;
}

$(() => {
  let form = $('#settings form');
  form.on('submit', function (e) {
    e.preventDefault();
    clearBoard();
    hideVictory();
    initializeGame();
  });
  form.trigger('submit');
});

function clearBoard () {
  let table = $('#board table');
  table.empty();
}

function initializeGame () {
  let game: Game = createGameObject();
  randomize(game);
}

function createGameObject (): Game {
  let maxX: number = getMaxX();
  let maxY: number = getMaxY();
  let randomization: number = getRandomization();
  let game: Game = {
    maxX: maxX,
    maxY: maxY,
    randomization: randomization,
    board: []
  };
  fillGameBoard(game);
  return game;
}

function getMaxX (): number {
  let form = $('#settings form');
  return form.find('input[name="maxX"]').val() as number;
}

function getMaxY (): number {
  let form = $('#settings form');
  return form.find('input[name="maxY"]').val() as number;
}

function getRandomization (): number {
  let form = $('#settings form');
  return form.find('input[name="randomization"]').val() as number;
}

function fillGameBoard (game: Game) {
  let table = $('#board table');
  for (let x = 0; x < game.maxX; x++) {
    game.board[x] = [];
    let row = createRow();
    table.append(row);
    for (let y = 0; y < game.maxY; y++) {
      let node = createNode(game, {
        x: x,
        y: y
      });
      row.append(node);
    }
  }
}

function createRow () {
  let row = $('<tr></tr>');
  return row;
}

function createNode (game: Game, c: Coordinate) {
  let node = $('<td class="node"></td>').on('click', function () {
    toggleAdjacent(game, c.x, c.y);
    if (hasWon(game)) {
      showVictory();
    }
  });
  game.board[c.x][c.y] = node;
  return node;
}

function toggleAdjacent (game: Game, x: number, y: number) {
  let coordinatesToToggle: Coordinate[] = [];

  // console.log({
  //   x: x,
  //   y: y
  // });

  coordinatesToToggle.push({
    x: x,
    y: y
  });

  // Top
  if (y > 0) {
    coordinatesToToggle.push({
      x: x,
      y: y - 1
    });
  }

  // Left
  if (x > 0) {
    coordinatesToToggle.push({
      x: x - 1,
      y: y
    });
  }

  // Right
  if (x < game.maxX - 1) {
    coordinatesToToggle.push({
      x: x + 1,
      y: y
    });
  }

  // Bottom
  if (y < game.maxY - 1) {
    coordinatesToToggle.push({
      x: x,
      y: y + 1
    });
  }

  // Top Left
  if (y > 0 && x > 0) {
    // console.log('TL');
    coordinatesToToggle.push({
      x: x - 1,
      y: y - 1
    });
  }

  // Bottom Right
  if (y < game.maxY - 1 && x < game.maxX - 1) {
    // console.log('BR');
    coordinatesToToggle.push({
      x: x + 1,
      y: y + 1
    });
  }

  // Top Right
  if (y < game.maxY - 1 && x > 0) {
    // console.log('TR');
    coordinatesToToggle.push({
      x: x - 1,
      y: y + 1
    });
  }

  // Top Left
  if (y > 0 && x < game.maxX - 1) {
    // console.log('TL');
    coordinatesToToggle.push({
      x: x + 1,
      y: y - 1
    });
  }

  for (let c of coordinatesToToggle) {
    toggle(game, c);
  }
}

function toggle (game: Game, c: Coordinate) {
  let node: JQuery = game.board[c.x][c.y];
  node.toggleClass('on');
}

function randomize (game: Game) {
  for (let i = 0; i < game.randomization; i++) {
    let randomX: number = Math.floor(Math.random() * game.maxX);
    let randomY: number = Math.floor(Math.random() * game.maxY);
    let cell: JQuery = game.board[randomX][randomY];
    cell.trigger('click');
  }
}

function hasWon (game: Game): boolean {
  for (let row of game.board) {
    for (let rowNode of row) {
      if (rowNode.hasClass('on')) {
        return true;
      }
    }
  }
  return true;
}

function hideVictory () {
  let victory = $('#victory');
  victory.removeClass('active');
}

function showVictory () {
  let victory = $('#victory');
  victory.addClass('active');
}
