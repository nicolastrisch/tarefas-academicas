import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { FiltrosService } from './filtros.service';

interface LoginResposta {
  token: string;
  nome: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private filtrosService = inject(FiltrosService);
  private url = `${environment.apiUrl}/auth`;

  login(email: string, senha: string): Observable<LoginResposta> {
    return this.http
      .post<LoginResposta>(`${this.url}/login`, { email, senha })
      .pipe(tap((resposta) => this.salvarSessao(resposta)));
  }

  cadastrar(nome: string, email: string, senha: string): Observable<LoginResposta> {
    return this.http
      .post<LoginResposta>(`${this.url}/cadastro`, { nome, email, senha })
      .pipe(tap((resposta) => this.salvarSessao(resposta)));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    this.filtrosService.limpar();
    this.router.navigate(['/login']);
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get nome(): string {
    return localStorage.getItem('nome') ?? '';
  }

  estaLogado(): boolean {
    return this.token != null;
  }

  private salvarSessao(resposta: LoginResposta) {
    localStorage.setItem('token', resposta.token);
    localStorage.setItem('nome', resposta.nome);
  }
}
