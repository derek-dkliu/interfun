import { Component, OnInit } from '@angular/core';
import { timer, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Move } from 'src/app/players/move';
import { Winner, Board } from './tic-tac-toe-rule';
import { TicTacToeMachine } from './tic-tac-toe-machine';
import { MinimaxPlayer } from '../../players/minimax-player';
import { MontecarloPlayer } from 'src/app/players/montecarlo-player';
import { BasePlayer } from 'src/app/players/base-player';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent implements OnInit {
  public winner: string;
  public board: Board;
  public stateMachine: TicTacToeMachine;
  public computers: BasePlayer<Board>[];
  public huamRoles: string[] = [Board.firstPlay];
  public computerRoles: string[] = [Board.roleNames[1]];
  private subscription: Subscription;

  constructor() {}

  ngOnInit() {
    this.initGame();
  }

  getRoleNames(): string[] {
    return Board.roleNames;
  }

  isRole(role: string): boolean {
    return this.huamRoles.length === 1 && this.huamRoles.includes(role);
  }

  setRole(role: string): void {
    this.huamRoles = [role];
    if (this.huamRoles.length !== 2) {
      const anotherRole = this.isRole(Board.roleNames[0]) ? Board.roleNames[1] : Board.roleNames[0];
      this.computerRoles = [anotherRole];
    }
    this.resetGame();
  }

  set2P() {
    this.huamRoles = this.getRoleNames();
    this.computerRoles = [];
    this.resetGame();
  }

  set2C() {
    this.huamRoles = [];
    this.computerRoles = this.getRoleNames();
    this.resetGame();
  }

  isGameOver(): boolean {
    return this.winner !== Winner.Empty;
  }

  hasWinner(): boolean {
    return this.board.getRoles().some(role => role.is(this.winner));
  }

  handleClick(index: number) {
    if (!this.isGameOver() && this.isHumanTurn()) {
      this.mark(index);
      this.runComputer();
    }
  }

  private initGame() {
    this.winner = Winner.Empty;
    this.board = Board.create();

    this.computers = [];
    for (const computerRole of this.computerRoles) {
      const stateMachine = new TicTacToeMachine(this.board, computerRole);
      // this.computers.push(new MinimaxPlayer<Board>(stateMachine));
      this.computers.push(new MontecarloPlayer<Board>(stateMachine));
    }

    if (!this.isHumanTurn()) {
      this.runComputer();
    }
  }

  private resetGame() {
    this.initGame();
  }

  private isHumanTurn(): boolean {
    return this.huamRoles.includes(this.board.getController().getName());
  }

  private runComputer(): void {
    if (this.subscription) { this.subscription.unsubscribe(); }

    if (this.computers.length === 2) {
      const source = timer(500, 1000).pipe(take(9));
      this.subscription = source.subscribe(val => {
        const turn = +val % 2;
        this.computerMove(this.computers[turn]);
      });
    } else if (this.computers.length === 1) {
      this.computerMove(this.computers[0]);
    }
  }

  private computerMove(computer: BasePlayer<Board>): void {
    if (!this.isGameOver()) {
      const move = computer.selectMove();
      this.mark(+move.getAction());
    }
  }

  private mark(index: number) {
    const cell = this.board.getCell(index);
    if (cell !== undefined && cell.isEmpty()) {
      this.board.mark(Move.create(index.toString()));
      this.checkWinner();
    }
  }

  private checkWinner(): void {
    this.winner = this.board.getWinner();
  }
}
