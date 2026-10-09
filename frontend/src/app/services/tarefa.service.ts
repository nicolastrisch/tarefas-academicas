import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FiltroTarefa, ResumoTarefas, SalvarTarefa, SituacaoTarefa, Tarefa } from '../models/tarefa';

@Injectable({ providedIn: 'root' })
export class TarefaService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/tarefas`;

  listar(filtro: FiltroTarefa): Observable<Tarefa[]> {
    let params = new HttpParams();
    if (filtro.disciplinaId) params = params.set('disciplinaId', filtro.disciplinaId);
    if (filtro.prioridade) params = params.set('prioridade', filtro.prioridade);
    if (filtro.situacao) params = params.set('situacao', filtro.situacao);
    if (filtro.prazo) params = params.set('prazo', filtro.prazo);

    return this.http.get<Tarefa[]>(this.url, { params });
  }

  resumo(): Observable<ResumoTarefas> {
    return this.http.get<ResumoTarefas>(`${this.url}/resumo`);
  }

  listarDoMes(ano: number, mes: number): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`${this.url}/calendario`, { params: { ano, mes } });
  }

  criar(tarefa: SalvarTarefa): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.url, tarefa);
  }

  atualizar(id: number, tarefa: SalvarTarefa): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.url}/${id}`, tarefa);
  }

  alterarSituacao(id: number, situacao: SituacaoTarefa): Observable<Tarefa> {
    return this.http.patch<Tarefa>(`${this.url}/${id}/situacao`, { situacao });
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
