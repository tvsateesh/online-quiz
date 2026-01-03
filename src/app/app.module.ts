import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { QuestionComponent } from './question/question.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { ChangeBgDirective } from './directives/change-bg.directive';
import { DiceGameComponent } from './components/dice-game/dice-game.component';
import { LoginComponent } from './login/login.component';
import { WordGameComponent } from './components/word-game/word-game.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LoginHeaderComponent } from './header/login-header/login-header.component';
import { MultiSelectionComponent } from './components/multi-selection/multi-selection.component';
import { FormComponent } from './components/form/form.component';
import { TicTacToeComponent } from './components/tic-tac-toe/tic-tac-toe.component';
import { SquareComponent } from './components/tic-tac-toe/square/square.component';
import { BoardComponent } from './components/tic-tac-toe/board/board.component';
import { SudokuComponent } from './components/sudoku/sudoku.component';
import { AngularComponent } from './components/angular/angular.component';
import { GamesComponent } from './components/games/games.component';
import { HtmlComponent } from './components/html/html.component';
import { JavascriptComponent } from './components/javascript/javascript.component';
import { CssComponent } from './components/css/css.component';
import { WordHuntComponent } from './components/games/word-hunt/word-hunt.component';
import { OddManOutComponent } from './components/games/odd-man-out/odd-man-out.component';
import { ChessComponent } from './components/games/chess/chess.component';
import { CheckersComponent } from './components/games/checkers/checkers.component';
import { EscapeRoomComponent } from './components/games/escape-room/escape-room.component';
@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    QuestionComponent,
    HeaderComponent,
    ChangeBgDirective,
    DiceGameComponent,
    LoginComponent,
    WordGameComponent,
    DashboardComponent,
    LoginHeaderComponent,
    MultiSelectionComponent,
    FormComponent,
    TicTacToeComponent,
    SquareComponent,
    BoardComponent,
    SudokuComponent,
    AngularComponent,
    GamesComponent,
    HtmlComponent,
    JavascriptComponent,
    CssComponent,
    WordHuntComponent,
    OddManOutComponent,
    ChessComponent,
    CheckersComponent,
    EscapeRoomComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    DragDropModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
