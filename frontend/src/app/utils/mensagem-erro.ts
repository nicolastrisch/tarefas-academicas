import { HttpErrorResponse } from '@angular/common/http';

// a API devolve { mensagem } nas regras de negócio e { errors } nas validações dos campos
export function mensagemDeErro(erro: HttpErrorResponse, padrao: string): string {
  if (erro.status === 0) {
    return 'Não foi possível conectar com o servidor.';
  }
  if (erro.error?.mensagem) {
    return erro.error.mensagem;
  }
  if (erro.error?.errors) {
    const mensagens = Object.values(erro.error.errors) as string[][];
    return mensagens[0][0];
  }
  return padrao;
}
