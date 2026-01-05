import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DiceGameComponent } from "./components/dice-game/dice-game.component";
import { WordGameComponent } from "./components/word-game/word-game.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./login/login.component";
import { QuestionComponent } from "./question/question.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { MultiSelectionComponent } from "./components/multi-selection/multi-selection.component";
import { FormComponent } from "./components/form/form.component";
import { TicTacToeComponent } from "./components/tic-tac-toe/tic-tac-toe.component";
import { SudokuComponent } from "./components/sudoku/sudoku.component";
import { AngularComponent } from "./components/angular/angular.component";
import { GamesComponent } from "./components/games/games.component";
import { HtmlComponent } from "./components/html/html.component";
import { JavascriptComponent } from "./components/javascript/javascript.component";
import { WordHuntComponent } from "./components/games/word-hunt/word-hunt.component";
import { OddManOutComponent } from "./components/games/odd-man-out/odd-man-out.component";
import { ChessComponent } from "./components/games/chess/chess.component";
import { CheckersComponent } from "./components/games/checkers/checkers.component";
import { EscapeRoomComponent } from "./components/games/escape-room/escape-room.component";
import { AuthGuard } from "./guards/auth.guard";
import { SignupComponent } from "./signup/signup.component";
import { SentenceGameComponent } from "./components/sentence-game/sentence-game.component";
const routes: Routes = [
  {
    path: "welcome",
    component: WelcomeComponent,
  },
  {
    path: "question",
    component: QuestionComponent,
  },
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "multi-selection", component: MultiSelectionComponent },
  { path: "form", component: FormComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "angular", component: AngularComponent },
  { path: "html", component: HtmlComponent},
  { path: "javascript", component: JavascriptComponent},
  { 
    path: "games", 
    component: GamesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "chess-game", pathMatch: "full" },
      { path: "dice-game", component: DiceGameComponent },
      { path: "word-game", component: WordGameComponent },
      { path: "word-hunt", component: WordHuntComponent},
      { path: "odd-man-out", component: OddManOutComponent},
      { path: "chess-game", component: ChessComponent},
      { path: "checkers-game", component: CheckersComponent},
      { path: "escape-room", component: EscapeRoomComponent},
      { path: "sudoku", component: SudokuComponent },
      { path: "tic-tac-toe", component: TicTacToeComponent },
      { path: "sentence-game", component: SentenceGameComponent },
    ]
  },
  // Stock/Finance section
  { path: 'stocks', loadChildren: () => import('./stock/stock.module').then(m => m.StockModule) },
  // Redirect old game routes to new nested structure
  { path: "dice-game", redirectTo: "games/dice-game" },
  { path: "word-game", redirectTo: "games/word-game" },
  { path: "word-hunt", redirectTo: "games/word-hunt" },
  { path: "odd-man-out", redirectTo: "games/odd-man-out" },
  { path: "chess-game", redirectTo: "games/chess-game" },
  { path: "checkers-game", redirectTo: "games/checkers-game" },
  { path: "escape-room", redirectTo: "games/escape-room" },
  { path: "sudoku", redirectTo: "games/sudoku" },
  { path: "tic-tac-toe", redirectTo: "games/tic-tac-toe" },
  { path: "sentence-game", redirectTo: "games/sentence-game" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
