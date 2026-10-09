import { Injectable } from '@angular/core';
import { FiltroTarefa } from '../models/tarefa';

// guarda o filtro do painel e o mês do calendário enquanto o usuário navega,
// para que ao voltar de uma edição a tela continue como estava
@Injectable({ providedIn: 'root' })
export class FiltrosService {
  painel: FiltroTarefa = {};
  anoCalendario = new Date().getFullYear();
  mesCalendario = new Date().getMonth() + 1;

  limpar() {
    this.painel = {};
    this.anoCalendario = new Date().getFullYear();
    this.mesCalendario = new Date().getMonth() + 1;
  }
}
