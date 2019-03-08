import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatGridListModule, MatButtonModule, MatIconModule,
         MatFormFieldModule, MatInputModule, MatSelectModule,
         MatListModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TicTacToeComponent } from './games/tic-tac-toe/tic-tac-toe.component';
import { DouShouQiComponent } from './games/dou-shou-qi/dou-shou-qi.component';

@NgModule({
  declarations: [
    AppComponent,
    TicTacToeComponent,
    DouShouQiComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
