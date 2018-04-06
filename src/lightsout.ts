function createNode (): string {
  let nodeHtml = '<td>Node</td>';
  return nodeHtml;
}

function createRow () {
  let rowHtml = '<tr></tr>';
  return rowHtml;
}

function createTable (rows: number, columns: number) {
  let table = $('#game table');
  for (let x = 0; x < rows; x++) {
    table.append(createRow());
    for (let y = 0; y < columns; y++) {
      table.append(createNode());
    }
  }
}

function getRowCount (): number {
  let form = $('#settings form');
  return form.find('input[name="rows"]').val() as number;
}

function getColumnCount (): number {
  let form = $('#settings form');
  return form.find('input[name="columns"]').val() as number;

}

function initGame () {
  createTable(getRowCount(), getColumnCount());
}

$(() => {
  let form = $('#settings form');
  form.on('submit', function (e) {
    console.log('submit');
    e.preventDefault();
    initGame();
  });
});
