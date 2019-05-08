import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicTacToeComponent } from './games/tic-tac-toe/tic-tac-toe.component';
import { DouShouQiComponent } from './games/dou-shou-qi/dou-shou-qi.component';

const routes: Routes = [
  { path: 'doushouqi', component: DouShouQiComponent },
  { path: '', component: TicTacToeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
