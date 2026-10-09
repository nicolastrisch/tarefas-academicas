import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { mensagemDeErro } from '../../utils/mensagem-erro';

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './cadastro.html',
  styleUrl: '../login/login.scss'
})
export class Cadastro {
  private authService = inject(AuthService);
  private router = inject(Router);

  form = inject(FormBuilder).nonNullable.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });
  erro = '';
  enviando = false;

  cadastrar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.erro = '';
    const { nome, email, senha } = this.form.getRawValue();

    this.authService.cadastrar(nome, email, senha).subscribe({
      next: () => this.router.navigate(['/painel']),
      error: (erro: HttpErrorResponse) => {
        this.erro = mensagemDeErro(erro, 'Não foi possível fazer o cadastro.');
        this.enviando = false;
      }
    });
  }
}
