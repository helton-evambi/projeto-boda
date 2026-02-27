import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo-dot" style="margin: 0 auto 8px"></div>
          <h1>Boda</h1>
          <p style="color: var(--text-tertiary); font-size: 0.85rem">Inicia sessão na tua conta</p>
        </div>

        @if (error) {
          <div class="alert alert-error"><i class="ri-error-warning-line"></i> {{ error }}</div>
        }

        <div class="form-group">
          <label><i class="ri-mail-line"></i> Email</label>
          <input type="email" class="form-control" [(ngModel)]="email" placeholder="email@boda.ao">
        </div>
        <div class="form-group">
          <label><i class="ri-lock-2-line"></i> Password</label>
          <input type="password" class="form-control" [(ngModel)]="password" placeholder="••••••••">
        </div>
        <button class="btn btn-primary btn-lg btn-block" (click)="login()" [disabled]="loading">
          {{ loading ? 'A entrar...' : 'Entrar' }}
        </button>

        <div style="text-align: center; margin-top: 16px">
          <a routerLink="/register" style="color: var(--accent-primary); text-decoration: none; font-size: 0.85rem">
            Não tens conta? <strong>Criar conta</strong>
          </a>
        </div>

        <!-- Quick Login Buttons -->
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color)">
          <p style="text-align: center; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 12px">Contas de demonstração</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px">
            <button class="btn btn-sm btn-secondary" (click)="quickLogin('admin&#64;boda.ao', 'Admin123!')"><i class="ri-shield-user-line"></i> Admin</button>
            <button class="btn btn-sm btn-secondary" (click)="quickLogin('maria&#64;boda.ao', 'Maria123!')"><i class="ri-calendar-event-line"></i> Organizador</button>
            <button class="btn btn-sm btn-secondary" (click)="quickLogin('dj&#64;boda.ao', 'Dj123456!')"><i class="ri-disc-line"></i> DJ/Artista</button>
            <button class="btn btn-sm btn-secondary" (click)="quickLogin('joao&#64;boda.ao', 'Joao1234!')"><i class="ri-user-3-line"></i> Utilizador</button>
            <button class="btn btn-sm btn-secondary" style="grid-column: span 2" (click)="quickLogin('dev&#64;boda.ao', 'Dev12345!')"><i class="ri-code-s-slash-line"></i> Developer</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) { }

  login() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/feed']); },
      error: (err) => { this.loading = false; this.error = err.error?.message || 'Credenciais inválidas'; }
    });
  }

  quickLogin(email: string, password: string) {
    this.email = email;
    this.password = password;
    this.login();
  }
}
