import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { RpslsComponent } from './rpsls/rpsls.component';

export const routes: Routes = [
  { path: 'home', title: 'App Home Page', component: HomeComponent },
  { path: 'rpsls', title: 'RPSLS', component: RpslsComponent },
  { path: '**', redirectTo: '/rpsls' },
];
