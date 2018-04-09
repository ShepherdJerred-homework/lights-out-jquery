class Game {
  private readonly gameSettings: GameSettings;
  private readonly board: JQuery[][];
  private readonly status: GameStatus;
  private readonly mountPoint: string;

  constructor (gameSettings: GameSettings, mountPoint: string) {
    this.board = [];
    this.status = GameStatus.INIT;
    this.mountPoint = mountPoint;
    this.gameSettings = gameSettings;
    this.hideVictoryMessage();
    this.clearBoard();
    this.initializeBoard();
    this.randomizeBoard();
    this.status = GameStatus.PLAYING;
  }

  private initializeBoard () {
    let table = $(this.mountPoint + ' table');
    for (let x = 0; x < this.gameSettings.maxX; x++) {
      this.board[x] = [];
      let row = this.createRow();
      table.append(row);
      for (let y = 0; y < this.gameSettings.maxY; y++) {
        let node = this.createNode({
          x: x,
          y: y
        });
        row.append(node);
      }
    }
  }

  private randomizeBoard () {
    for (let i = 0; i < this.gameSettings.entropy; i++) {
      let randomX: number = Math.floor(Math.random() * this.gameSettings.maxX);
      let randomY: number = Math.floor(Math.random() * this.gameSettings.maxY);
      let randomCell: JQuery = this.board[randomX][randomY];
      randomCell.trigger('click');
    }
  }

  private clearBoard () {
    let table = $(this.mountPoint + ' table');
    table.empty();
  }

  private hasWon (): boolean {
    if (this.status === GameStatus.INIT) {
      return false;
    }
    for (let row of this.board) {
      for (let rowNode of row) {
        if (rowNode.hasClass('on')) {
          return false;
        }
      }
    }
    return true;
  }

  private createNode (c: Coordinate) {
    let node = $('<td class="node"></td>').on('click', () => {
      this.toggleAdjacentNodes(c.x, c.y);
      if (this.hasWon()) {
        this.showVictoryMessage();
      }
    });
    this.board[c.x][c.y] = node;
    return node;
  }

  // This could be more efficient
  private toggleAdjacentNodes (x: number, y: number) {
    let coordinatesToToggle: Coordinate[] = [];

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
    if (x < this.gameSettings.maxX - 1) {
      coordinatesToToggle.push({
        x: x + 1,
        y: y
      });
    }

    // Bottom
    if (y < this.gameSettings.maxY - 1) {
      coordinatesToToggle.push({
        x: x,
        y: y + 1
      });
    }

    // Top Left
    if (y > 0 && x > 0) {
      coordinatesToToggle.push({
        x: x - 1,
        y: y - 1
      });
    }

    // Bottom Right
    if (y < this.gameSettings.maxY - 1 && x < this.gameSettings.maxX - 1) {
      coordinatesToToggle.push({
        x: x + 1,
        y: y + 1
      });
    }

    // Top Right
    if (y < this.gameSettings.maxY - 1 && x > 0) {
      coordinatesToToggle.push({
        x: x - 1,
        y: y + 1
      });
    }

    // Top Left
    if (y > 0 && x < this.gameSettings.maxX - 1) {
      coordinatesToToggle.push({
        x: x + 1,
        y: y - 1
      });
    }

    for (let c of coordinatesToToggle) {
      this.toggleNode(c);
    }
  }

  private toggleNode (c: Coordinate) {
    let node: JQuery = this.board[c.x][c.y];
    node.toggleClass('on');
  }

  private hideVictoryMessage () {
    let victory = $(this.mountPoint + ' .victory');
    victory.removeClass('active');
  }

  private showVictoryMessage () {
    let victory = $(this.mountPoint + ' .victory');
    victory.addClass('active');
  }

  private createRow () {
    return $('<tr></tr>');
  }
}

interface GameSettings {
  maxX: number;
  maxY: number;
  entropy: number;
}

class HtmlInputGameSettings {
  mountPoint: string;

  constructor (mountPoint: string) {
    this.mountPoint = mountPoint;
  }

  getGameSettings (): GameSettings {
    return {
      maxX: this.getMaxX(),
      maxY: this.getMaxY(),
      entropy: this.getEntropy()
    };
  }

  private getMaxX (): number {
    let form = $(this.mountPoint + ' form');
    return form.find('input[name="maxX"]').val() as number;
  }

  private getMaxY (): number {
    let form = $(this.mountPoint + ' form');
    return form.find('input[name="maxY"]').val() as number;
  }

  private getEntropy (): number {
    let form = $(this.mountPoint + '  form');
    return form.find('input[name="entropy"]').val() as number;
  }
}

enum GameStatus {
  PLAYING,
  INIT
}

interface Coordinate {
  x: number;
  y: number;
}

$(() => {
  let form = $('#settings form');
  form.on('submit', function (e) {
    e.preventDefault();
    let gameSettings: GameSettings = new HtmlInputGameSettings('#settings').getGameSettings();
    new Game(gameSettings, '#game');
  });
  form.trigger('submit');
});
