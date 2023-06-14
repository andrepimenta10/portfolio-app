import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {PortfolioDetailComponent} from "./portfolio-detail/portfolio-detail.component";
import {SearchComponent} from "./search/search.component";

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'Portfolio Dashboard' },
  { path: 'detail/:portfolioId', component: PortfolioDetailComponent },
  { path: 'contractSearch', component: SearchComponent, title: 'Security Search'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
