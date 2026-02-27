import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { ApiService } from './core/services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <!-- Auth pages (no sidebar) -->
    @if (!auth.isLoggedIn()) {
      <router-outlet />
    } @else {
      <!-- Main Layout with Sidebar -->
      <div class="app-layout">
        <!-- Sidebar -->
        <aside class="sidebar">
          <div class="sidebar-logo">
            <div class="logo-dot"></div>
            <h1>Boda</h1>
          </div>

          <nav class="sidebar-nav">
            <a routerLink="/feed" routerLinkActive="active" class="nav-item">
              <span class="nav-icon"><i class="ri-home-5-fill"></i></span> Feed
            </a>
            <a routerLink="/explore" routerLinkActive="active" class="nav-item">
              <span class="nav-icon"><i class="ri-compass-3-line"></i></span> Explorar
            </a>
            <a routerLink="/notifications" routerLinkActive="active" class="nav-item">
              <span class="nav-icon"><i class="ri-notification-3-line"></i></span> Notificações
              @if (unreadCount > 0) {
                <span class="badge">{{ unreadCount }}</span>
              }
            </a>
            <a routerLink="/messages" routerLinkActive="active" class="nav-item">
              <span class="nav-icon"><i class="ri-message-3-line"></i></span> Mensagens
            </a>
            <a routerLink="/tickets" routerLinkActive="active" class="nav-item">
              <span class="nav-icon"><i class="ri-ticket-line"></i></span> Meus Bilhetes
            </a>
            <a routerLink="/profile" routerLinkActive="active" class="nav-item">
              <span class="nav-icon"><i class="ri-user-3-line"></i></span> Perfil
            </a>

            @if (auth.currentUser()?.role === 'Organizer' || auth.currentUser()?.role === 'Admin') {
              <div style="margin: 12px 0; border-top: 1px solid var(--border-color)"></div>
              <a routerLink="/organizer" routerLinkActive="active" class="nav-item">
                <span class="nav-icon"><i class="ri-bar-chart-box-line"></i></span> Painel Organizador
              </a>
            }

            @if (auth.currentUser()?.role === 'Admin') {
              <a routerLink="/admin" routerLinkActive="active" class="nav-item">
                <span class="nav-icon"><i class="ri-settings-3-line"></i></span> Administração
              </a>
            }

            @if (auth.currentUser()?.role === 'Developer') {
              <div style="margin: 12px 0; border-top: 1px solid var(--border-color)"></div>
              <a routerLink="/developer" routerLinkActive="active" class="nav-item">
                <span class="nav-icon"><i class="ri-code-s-slash-line"></i></span> Desenvolvedor
              </a>
            }
          </nav>

          <div class="sidebar-footer">
            <button class="theme-toggle" (click)="theme.toggle()">
              <i [class]="theme.theme() === 'dark' ? 'ri-sun-line' : 'ri-moon-line'"></i>
              {{ theme.theme() === 'dark' ? 'Modo Dourado' : 'Modo Escuro' }}
            </button>

            <div class="sidebar-user" (click)="navigateProfile()">
              <img [src]="auth.currentUser()?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'" [alt]="auth.currentUser()?.name">
              <div class="sidebar-user-info">
                <div class="name">{{ auth.currentUser()?.name }}</div>
                <div class="role">{{ getRoleLabel(auth.currentUser()?.role) }}</div>
              </div>
            </div>

            <button class="nav-item" style="margin-top: 8px; color: var(--danger)" (click)="auth.logout()">
              <span class="nav-icon"><i class="ri-logout-box-r-line"></i></span> Sair
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
          <router-outlet />
        </main>

        <!-- Bottom Nav (Mobile) -->
        <nav class="bottom-nav">
          <div class="bottom-nav-items">
            <a routerLink="/feed" routerLinkActive="active" class="bottom-nav-item">
              <span class="bnav-icon"><i class="ri-home-5-fill"></i></span>Feed
            </a>
            <a routerLink="/explore" routerLinkActive="active" class="bottom-nav-item">
              <span class="bnav-icon"><i class="ri-compass-3-line"></i></span>Explorar
            </a>
            <a routerLink="/notifications" routerLinkActive="active" class="bottom-nav-item">
              <span class="bnav-icon"><i class="ri-notification-3-line"></i></span>Alertas
            </a>
            <a routerLink="/messages" routerLinkActive="active" class="bottom-nav-item">
              <span class="bnav-icon"><i class="ri-message-3-line"></i></span>Chat
            </a>
            <a routerLink="/profile" routerLinkActive="active" class="bottom-nav-item">
              <span class="bnav-icon"><i class="ri-user-3-line"></i></span>Perfil
            </a>
          </div>
        </nav>
      </div>
    }
  `,
  styles: []
})
export class AppComponent {
  unreadCount = 0;

  constructor(
    public auth: AuthService,
    public theme: ThemeService,
    private api: ApiService,
    private router: Router
  ) {
    if (auth.isLoggedIn()) {
      this.loadUnreadCount();
    }
  }

  loadUnreadCount() {
    this.api.getUnreadCount().subscribe({
      next: count => this.unreadCount = count,
      error: () => { }
    });
  }

  navigateProfile() {
    this.router.navigate(['/profile']);
  }

  getRoleLabel(role?: string): string {
    const labels: Record<string, string> = {
      Admin: 'Administrador',
      Organizer: 'Organizador',
      DjArtist: 'DJ / Artista',
      User: 'Utilizador',
      Developer: 'Desenvolvedor'
    };
    return labels[role || ''] || role || '';
  }
}
