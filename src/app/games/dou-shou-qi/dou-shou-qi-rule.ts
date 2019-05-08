import { State } from 'src/app/players/state';
import { Role } from 'src/app/players/role';
import { Move } from 'src/app/players/move';
import { Qi, ROLE_NAMES, SETTINGS, ANIMALS, WEIGHTS } from './dou-shou-qi-data';

export class Piece {
  constructor(
    public type: number,
    public owner: string,
    public grid: Grid,
    public text: string,
    public color: string,
    public border: string,
  ) {}

  clone(): Piece {
    // need to update piece's grid after grids are cloned
    return new Piece(this.type, this.owner, null, this.text, this.color, this.border);
  }

  canMove(cell: Grid): boolean {
    if (cell.isEmpty() || (!cell.isEmpty() && this.canCapture(cell.piece))) {

      if (this.grid.neighbors.includes(cell)) {
        if (cell.type === Qi.river && this.type !== Qi.rat) {           // Only rat goint river
          return false;
        }
        if ((cell.type === Qi.black_den && this.owner === Qi.black) ||  // Piece cannot move into its own den
            (cell.type === Qi.white_den && this.owner === Qi.white)) {
          return false;
        }
        return true;
      } else if ((this.type === Qi.tiger || this.type === Qi.lion) &&   // The lion and tiger can jump over a river
                  cell.type === Qi.land) {                              // horizontally or vertically, when there is
        if (this.grid.row === cell.row && this.grid.col !== cell.col) { // no rat blocking in the river
          return this.canJumpHorizontally(cell);
        }
        if (this.grid.col === cell.col && this.grid.row !== cell.row) {
          return this.canJumpVertically(cell);
        }
        return false;
      }
    }

    return false;
  }

  private canJumpHorizontally(cell: Grid): boolean {
    const difference = cell.col - this.grid.col;
    const delta = difference / Math.abs(difference);
    let col = cell.col - delta;
    let grid = cell;
    while (col !== this.grid.col) {
      grid = grid.getNeighbor(cell.row, col);
      if (!grid.isTypeOf(Qi.river) || !grid.isEmpty()) {   // river grid and has no animal
        return false;
      }
      col -= delta;
    }
    return true;
  }

  private canJumpVertically(cell: Grid): boolean {
    const difference = cell.row - this.grid.row;
    const delta = difference / Math.abs(difference);
    let row = cell.row - delta;
    let grid = cell;
    while (row !== this.grid.row) {
      grid = grid.getNeighbor(row, cell.col);
      if (!grid.isTypeOf(Qi.river) || !grid.isEmpty()) {   // river grid and has no animal
        return false;
      }
      row -= delta;
    }
    return true;
  }

  private canCapture(opponent: Piece): boolean {
    if (this.owner === opponent.owner) {
      return false;
    }

    if ((opponent.grid.type === Qi.black_trap && this.owner === Qi.white) ||
        (opponent.grid.type === Qi.white_trap && this.owner === Qi.black)) {
      return true;
    } else if (this.type === Qi.rat && opponent.type === Qi.elephant) {
      if (this.grid.type !== Qi.river) {      // rat(non-water) > elephant
        return true;
      } else {
        return false;
      }
    } else if (opponent.type === Qi.rat && opponent.grid.type === Qi.river) {
      if (this.type === Qi.rat && this.grid.type === Qi.river) {
        return true;
      } else {
        return false;
      }
    } else if (this.type >= opponent.type) {  // capture same or lower rank
      if (this.type === Qi.elephant && opponent.type === Qi.rat) {
        return false;
      }
      return true;
    }
    return false;
  }

  move(cell: Grid): void {
    this.grid.piece = null;
    cell.piece = this;
    this.grid = cell;
  }

  toString(): string {
    return `${this.text}(${this.owner})`;
  }
}

export class Grid {
  public piece: Piece;
  public type: string;
  public color: string;
  public row: number;
  public col: number;
  public neighbors: Grid[];

  constructor(row: number, col: number) {
    this.piece = null;
    this.type = Qi.land;
    this.color = Qi.land_color;
    this.row = row;
    this.col = col;
    this.neighbors = [];
  }

  clone(): Grid {
    const copy = new Grid(this.row, this.col);
    copy.piece = this.isEmpty() ? null : this.piece.clone();
    copy.type = this.type;
    copy.color = this.color;
    copy.neighbors = [];   // need to update neighbor after grids are cloned
    return copy;
  }

  isEmpty(): boolean {
    return this.piece === null;
  }

  isTypeOf(type: string): boolean {
    return this.type === type;
  }

  hasPieceOf(owner: string): boolean {
    if (this.isEmpty()) {
      return false;
    }
    return this.piece.owner === owner;
  }

  getNeighbor(row: number, col: number): Grid {
    return this.neighbors.find(neighbor => neighbor.row === row && neighbor.col === col);
  }

  initNeighbors(grids: Grid[][]): void {
    const options = [-1, 1];
    for (const r of options) {
      const row = this.row + r;
      if (row >= 0 && row < Qi.row) {
        this.neighbors.push(grids[row][this.col]);
      }
    }
    for (const c of options) {
      const col = this.col + c;
      if (col >= 0 && col < Qi.col) {
        this.neighbors.push(grids[this.row][col]);
      }
    }
  }

  toAxis(): string {
    return this.row + Qi.separator + this.col;
  }

  toString(): string {
    return this.isEmpty() ? '' : this.piece.toString();
  }
}

export class Board extends State {
  public static firstPlay = ROLE_NAMES[0];
  protected grids: Grid[][];

  static create(): Board {
    // setup grid
    const grids = [];
    for (let i = 0; i < Qi.row; i++) {
      grids[i] = [];
      for (let j = 0; j < Qi.col; j++) {
        grids[i][j] = new Grid(i, j);
      }
    }

    // setup landmarks
    for (const setting of SETTINGS) {
      for (const landmark of setting) {
        grids[landmark.row][landmark.col].type = landmark.type;
        grids[landmark.row][landmark.col].color = landmark.color;
      }
    }

    // setup pieces
    // for (const piece of [ANIMALS[3], ANIMALS[11]]) {
    for (const piece of ANIMALS) {
      grids[piece.row][piece.col].piece = new Piece(
        +piece.type,
        piece.owner.toString(),
        grids[piece.row][piece.col],
        piece.text.toString(),
        piece.color.toString(),
        piece.border.toString()
      );
    }

    // setup roles
    const roles = [];
    for (const name of ROLE_NAMES) {
      roles.push(Role.create(name));
    }

    // Black plays first
    const controller = Role.create(this.firstPlay);
    const board = new Board(grids, roles, controller, 1);

    // init grid neighbors
    board.initAllNeighbors();
    return board;
  }

  private constructor(grids: Grid[][], roles: Role[], controller: Role, round: number) {
    super(roles, controller, round);
    this.grids = grids;
  }

  initAllNeighbors(): void {
    for (const grid of this.getCells()) {
      grid.initNeighbors(this.grids);
    }
  }

  initAllPiecesGrid(): void {
    for (const grid of this.getCells()) {
      if (!grid.isEmpty()) {
        const row = grid.row;
        const col = grid.col;
        grid.piece.grid = this.grids[row][col];
      }
    }
  }

  clone(): Board {
    const grids = this.grids.map(row => row.map(grid => grid.clone()));
    const board = new Board(grids, this.roles, this.controller, this.round);
    board.initAllNeighbors();
    board.initAllPiecesGrid();
    return board;
  }

  hash(): string {
    return this.getCells().map(grid => grid.toString()).join('|');
  }

  getRepresentation(): string {
    return this.grids.map(row => row.map(grid => grid.toString())).join('/n');
  }

  getLegalMoves(role: Role): Move[] {
    const moves = [];
    if (this.isController(role)) {
      for (const grid of this.getCells()) {
        if (!grid.isEmpty() && role.is(grid.piece.owner)) {
          for (const cell of this.getCells()) {
            const move = [];
            move.push(grid.toAxis());
            if (grid.piece.canMove(cell)) {
              move.push(cell.toAxis());
              moves.push(Move.create(move.join(Qi.separator)));
            }
          }
        }
      }
    } else {      // noop only, if not this role's turn
      moves.push(Move.noop());
    }
    return moves;
  }

  getHeuristic(role: Role): number {
    let blackPieces = 0;
    let whitePieces = 0;
    for (const grid of this.getCells()) {
      if (!grid.isEmpty()) {

        if (grid.isTypeOf(Qi.white_trap) && grid.hasPieceOf(Qi.black)) {
          if (grid.neighbors.every(g => g.isEmpty())) {
            if (role.is(Qi.black)) {
              blackPieces += 600;
            } else {
              whitePieces -= 600;
            }
          }
        }

        if (grid.isTypeOf(Qi.black_trap) && grid.hasPieceOf(Qi.white)) {
          if (grid.neighbors.every(g => g.isEmpty())) {
            if (role.is(Qi.white)) {
              whitePieces += 600;
            } else {
              blackPieces -= 600;
            }
          }
        }

        if (grid.hasPieceOf(Qi.black)) {
          blackPieces += WEIGHTS[grid.piece.type];
        }

        if (grid.hasPieceOf(Qi.white)) {
          whitePieces += WEIGHTS[grid.piece.type];
        }
      }
    }

    if (role.is(Qi.black)) {
      return blackPieces - whitePieces;
    } else {
      return whitePieces - blackPieces;
    }
  }

  getWinner(): string {
    let blackPiecesCount = 0;
    let whitePiecesCount = 0;
    for (const grid of this.getCells()) {
      if (!grid.isEmpty()) {
        // black wins by occuping white's den
        if (grid.isTypeOf(Qi.white_den) && grid.hasPieceOf(Qi.black)) {
          return Qi.black;
        }

        // white wins by occuping black's den
        if (grid.isTypeOf(Qi.black_den) && grid.hasPieceOf(Qi.white)) {
          return Qi.white;
        }

        // count black's piece
        if (grid.hasPieceOf(Qi.black)) {
          blackPiecesCount++;
        }

        // count white's piece
        if (grid.hasPieceOf(Qi.white)) {
          whitePiecesCount++;
        }
      }
    }

    // black wins by capturing all white's pieces
    if (whitePiecesCount === 0) {
      return Qi.black;
    }

    // white wins by capturing all black's pieces
    if (blackPiecesCount === 0) {
      return Qi.white;
    }

    // black wins by blocking white's last piece
    if (whitePiecesCount <= 3 && this.getLegalMoves(Role.create(Qi.white)).length === 0) {
      return Qi.black;
    }

    // white wins by blocking black's last piece
    if (blackPiecesCount <= 3 && this.getLegalMoves(Role.create(Qi.black)).length === 0) {
      return Qi.white;
    }

    return Qi.empty;
  }

  updateController(): void {
    const index = (this.roles.findIndex(role => role.equals(this.controller)) + 1) % this.roles.length;
    this.controller = this.roles[index];
    this.nextRound();
  }

  takeMove(move: Move): void {
    if (move === undefined) {
      throw new Error(this.getRepresentation());
    }
    if (move.actionable()) {
      const locs = move.getAction().split(Qi.separator);
      if (locs.length !== 4) {
        throw new Error('Invalid action format.');
      }
      const fromRow = +locs[0];
      const fromCol = +locs[1];
      const toRow = +locs[2];
      const toCol = +locs[3];
      const grid = this.grids[fromRow][fromCol];
      const cell = this.grids[toRow][toCol];
      if (!grid || !cell) {
        throw new Error(`Grid or Cell is null from (${fromRow}, ${fromCol}), (${toRow}, ${toCol}).`);
      }
      if (grid.isEmpty()) {
        throw new Error(`Empty piece from grid (${fromRow}, ${fromCol}).`);
      }
      grid.piece.move(cell);
      this.updateController();
    }
  }

  getCells(): Grid[] {
    const cells = [];
    for (const row of this.grids) {
      for (const cell of row) {
        cells.push(cell);
      }
    }
    return cells;
  }
}
