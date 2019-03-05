import { StateMachine } from '../../players/state-machine';
import { Role } from 'src/app/players/role';
import { Move } from 'src/app/players/move';
import { State } from 'src/app/players/state';
import { Board, Winner } from './tic-tac-toe-rule';

export class TicTacToeMachine extends StateMachine<Board> {
  private shuffle(moves: Move[]) {
    for (let i = 0; i < moves.length; i++) {
      const index = Math.floor(Math.random() * (i + 1));
      const move = moves[i];
      moves[i] = moves[index];
      moves[index] = move;
    }
    return moves;
  }

  getLegalMoves(state: State<Board>, role: Role): Move[] {
    let moves = [ Move.noop() ];  // noop only, if not this role's turn

    const board = state.getContent();
    if (board.isController(role)) {
      moves = board.getLegalMoves();
    }

    // return moves;
    return this.shuffle(moves);
  }

  getNextState(state: State<Board>, moves: Move[]): State<Board> {
    const board = state.getContent().clone();
    for (const move of moves) {
      board.mark(move);
    }

    return new State<Board>(board);
  }

  isTerminal(state: State<Board>): boolean {
    const winner = state.getContent().getWinner();
    return winner !== Winner.Empty;
  }

  getGoal(state: State<Board>, role: Role): number {
    const winner = state.getContent().getWinner();
    if (role.is(winner)) {
      return 100;
    } else if (winner === Winner.Tie) {
      return 50;
    } else {
      return 0;
    }
  }

  getRoles(): Role[] {
    return this.getCurrentState().getContent().getRoles();
  }
}
