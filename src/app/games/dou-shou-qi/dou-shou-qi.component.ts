import { Component, OnInit } from '@angular/core';
import { Board, Piece, Grid } from './dou-shou-qi-rule';
import { Qi, ROLE_NAMES } from './dou-shou-qi-data';
import { Move } from 'src/app/players/move';
import { DouShouQiMachine } from './dou-shou-qi-machine';
import { BasePlayer } from 'src/app/players/base-player';
import { MctsPlayer } from 'src/app/players/mcts-player';
import { MinimaxPlayer } from 'src/app/players/minimax-player';
import { MontecarloPlayer } from 'src/app/players/montecarlo-player';

@Component({
  selector: 'app-dou-shou-qi',
  templateUrl: './dou-shou-qi.component.html',
  styleUrls: ['./dou-shou-qi.component.scss']
})
export class DouShouQiComponent implements OnInit {
  public board: Board;
  public stateMachine: DouShouQiMachine;
  public computers: BasePlayer<Board>[];
  public huamRoles: string[] = [Qi.black.toString()];
  public computerRoles: string[] = [Qi.white.toString()];
  public activePiece: Piece = null;
  public winner: string = Qi.empty;
  public hint: string;

  constructor() {}

  ngOnInit() {
    this.initGame();
  }

  resetGame() {
    this.initGame();
  }

  isGameOver(): boolean {
    return this.winner !== Qi.empty;
  }

  getTitle(): string {
    return Qi.title;
  }

  private initGame() {
    this.hint = '';
    this.winner = Qi.empty;
    this.board = Board.create();

    this.computers = [];
    for (const computerRole of this.computerRoles) {
      const stateMachine = new DouShouQiMachine(this.board, computerRole);
      this.computers.push(new MinimaxPlayer<Board>(stateMachine, 5));
    }
  }

  select(cell: Grid) {
    if (this.isHumanTurn() && !this.isGameOver()) {
      if (!cell.isEmpty() && this.isControllerOwned(cell.piece.owner)) {
        this.setActivePiece(cell);
        this.hint = '';

      } else if (this.activePiece !== null) {
        if (this.activePiece.canMove(cell)) {
          const action = this.activePiece.grid.toAxis() + Qi.separator + cell.toAxis();
          this.board.takeMove(Move.create(action));
          this.checkWinner();
          this.unsetActivePiece();
          this.hint = '';

          setTimeout(() => this.runComputer(), 0);

        } else {
          this.hint = 'cannot move to this area or capture this piece';
        }
      } else {
        const controller = this.board.getController().getName();
        this.hint = `please select a ${controller} piece`;
      }
    } else {
      this.hint = '';
    }
  }

  private runComputer(): void {
    if (!this.isGameOver()) {
      const timeout = Date.now() + Qi.play_time * 1000;
      const move = this.computers[0].selectMove(timeout);
      this.board.takeMove(move);
      this.checkWinner();
    }
  }

  private checkWinner(): void {
    this.winner = this.board.getWinner();
  }

  private setActivePiece(cell: Grid): void {
    if (this.activePiece !== null) {
      this.activePiece.border = Qi.piece_border;
    }
    this.activePiece = cell.piece;
    this.activePiece.border = Qi.piece_active;
  }

  private unsetActivePiece(): void {
    this.activePiece.border = Qi.piece_border;
    this.activePiece = null;
  }

  private isControllerOwned(role: string): boolean {
    return this.board.getController().is(role);
  }

  private isHumanTurn(): boolean {
    return this.huamRoles.includes(this.board.getController().getName());
  }
}
