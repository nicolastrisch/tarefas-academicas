import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Disciplina, SalvarDisciplina } from '../models/disciplina';

@Injectable({ providedIn: 'root' })
export class DisciplinaService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/disciplinas`;

  listar(): Observable<Disciplina[]> {
    return this.http.get<Disciplina[]>(this.url);
  }

  criar(disciplina: SalvarDisciplina): Observable<Disciplina> {
    return this.http.post<Disciplina>(this.url, disciplina);
  }

  atualizar(id: number, disciplina: SalvarDisciplina): Observable<Disciplina> {
    return this.http.put<Disciplina>(`${this.url}/${id}`, disciplina);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
