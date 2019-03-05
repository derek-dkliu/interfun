import { Role } from 'src/app/players/role';
import { Move } from 'src/app/players/move';

const MARK_COLOR = 'cyan';

export enum Mark {
  X = 'X',
  O = 'O',
  Empty = ''
}

export enum Winner {
  Tie = 'tie',
  Empty = ''
}

export class Cell {
  public mark: string;
  public color: string;

  constructor() {
    this.mark = Mark.Empty;
    this.color = '';
  }

  clone(): Cell {
    const copy = new Cell();
    copy.mark = this.mark;
    copy.color = '';
    return copy;
  }

  isEmpty(): boolean {
    return this.mark === Mark.Empty;
  }
}

export class Board {
  public static roleNames = [Mark.X, Mark.O];
  public static firstPlay = Board.roleNames[0];

  private constructor(protected cells: Cell[], protected roles: Role[], protected controller: Role) {}

  static create(): Board {
    // setup cells
    const cells = [];
    for (let i = 0; i < 9; i++) {
      cells[i] = new Cell();
    }

    // setup roles
    const roles = [];
    for (const name of this.roleNames) {
      roles.push(Role.create(name));
    }

    // X plays first
    const controller = Role.create(this.firstPlay);

    return new Board(cells, roles, controller);
  }

  clone(): Board {
    const cells = this.cells.map(cell => cell.clone());
    return new Board(cells, this.roles, this.controller);
  }

  mark(move: Move): void {
    if (move.actionable()) {
      const index = +move.getAction();
      this.getCell(index).mark = this.getController().getName();
      this.updateController();
    }
  }

  updateController(): void {
    const index = (this.roles.findIndex(role => role.equals(this.controller)) + 1) % this.roles.length;
    this.controller = this.roles[index];
  }

  isController(role: Role): boolean {
    return this.getController().equals(role);
  }

  getController(): Role {
    return this.controller;
  }

  getRole(index: number): Role {
    return this.roles[index];
  }

  getRoles(): Role[] {
    return this.roles;
  }

  getLegalMoves(): Move[] {
    const moves = [];
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].isEmpty()) {
        moves.push(Move.create(i.toString()));
      }
    }
    return moves;
  }

  getCell(index: number): Cell {
    return this.cells[index];
  }

  getCells(): Cell[] {
    return this.cells;
  }

  getWinner(): string {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (const line of lines) {
      if (this.cells[line[0]].mark === this.cells[line[1]].mark &&
          this.cells[line[1]].mark === this.cells[line[2]].mark &&
          !this.cells[line[0]].isEmpty()) {

        // highlight winning cells
        this.cells[line[0]].color = MARK_COLOR;
        this.cells[line[1]].color = MARK_COLOR;
        this.cells[line[2]].color = MARK_COLOR;

        return this.cells[line[0]].mark;
      }
    }

    if (this.isFullyMarked()) {
      return Winner.Tie;
    }

    return Winner.Empty;
  }

  isFullyMarked(): boolean {
    return !this.cells.some(cell => cell.isEmpty());
  }
}
