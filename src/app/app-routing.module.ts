import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiceGameComponent } from './components/dice-game/dice-game.component';
import { WordGameComponent } from './components/word-game/word-game.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { QuestionComponent } from './question/question.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MultiSelectionComponent } from './components/multi-selection/multi-selection.component';
const routes: Routes = [
  {
    path: "welcome",
    component: WelcomeComponent
  },
  {
    path: "question",
    component: QuestionComponent
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login',component: LoginComponent },
  {path: 'dice-game', component: DiceGameComponent},
  {path: 'multi-selection', component: MultiSelectionComponent},
  {path: 'dashboard', component: DashboardComponent},
  { path:'word-game', component: WordGameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
