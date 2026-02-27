import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo-dot" style="margin: 0 auto 8px"></div>
          <h1>Boda</h1>
          <p style="color: var(--text-tertiary); font-size: 0.85rem">Criar nova conta</p>
        </div>

        @if (error) {
          <div class="alert alert-error"><i class="ri-error-warning-line"></i> {{ error }}</div>
        }

        <div class="form-group">
          <label><i class="ri-user-3-line"></i> Nome completo</label>
          <input type="text" class="form-control" [(ngModel)]="name" placeholder="João Silva">
        </div>
        <div class="form-group">
          <label><i class="ri-mail-line"></i> Email</label>
          <input type="email" class="form-control" [(ngModel)]="email" placeholder="email@boda.ao">
        </div>
        <div class="form-group">
          <label><i class="ri-phone-line"></i> Telefone</label>
          <input type="tel" class="form-control" [(ngModel)]="phone" placeholder="+244 9XX XXX XXX">
        </div>
        <div class="form-group">
          <label><i class="ri-lock-2-line"></i> Password</label>
          <input type="password" class="form-control" [(ngModel)]="password" placeholder="Mín. 8 caracteres">
        </div>
        <div class="form-group">
          <label><i class="ri-user-settings-line"></i> Tipo de conta</label>
          <select class="form-control" [(ngModel)]="role">
            <option value="User">Utilizador</option>
            <option value="Organizer">Organizador de Eventos</option>
            <option value="DjArtist">DJ / Artista</option>
            <option value="Developer">Desenvolvedor</option>
          </select>
        </div>
        <button class="btn btn-primary btn-lg btn-block" (click)="register()" [disabled]="loading">
          {{ loading ? 'A criar...' : 'Criar Conta' }}
        </button>

        <div style="text-align: center; margin-top: 16px">
          <a routerLink="/login" style="color: var(--accent-primary); text-decoration: none; font-size: 0.85rem">
            Já tens conta? <strong>Iniciar sessão</strong>
          </a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name = '';
  email = '';
  phone = '';
  password = '';
  role = 'User';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) { }

  register() {
    this.loading = true;
    this.error = '';
    this.auth.register(this.name, this.email, this.password, this.phone, this.role).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/feed']); },
      error: (err) => { this.loading = false; this.error = err.error?.message || 'Erro ao criar conta'; }
    });
  }
}
