import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicTacToeComponent } from './games/tic-tac-toe/tic-tac-toe.component';

const routes: Routes = [
  { path: '', component: TicTacToeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
