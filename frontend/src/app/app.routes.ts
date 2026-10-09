import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Painel } from './pages/painel/painel';
import { Disciplinas } from './pages/disciplinas/disciplinas';
import { Calendario } from './pages/calendario/calendario';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'painel', component: Painel, canActivate: [authGuard] },
  { path: 'disciplinas', component: Disciplinas, canActivate: [authGuard] },
  { path: 'calendario', component: Calendario, canActivate: [authGuard] },
  { path: '', redirectTo: 'painel', pathMatch: 'full' },
  { path: '**', redirectTo: 'painel' }
];
