import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="content-header">
      <h2><i class="ri-settings-3-line"></i> Definições</h2>
    </div>

    <div class="content-body fade-in">
      <div class="settings-grid">

        <!-- Change Password -->
        <div class="card settings-card">
          <div class="card-body" style="padding: 24px">
            <div class="settings-card-header">
              <div class="settings-icon" style="background: rgba(245,158,11,0.12); color: #f59e0b"><i class="ri-lock-password-line"></i></div>
              <div>
                <h3>Alterar Password</h3>
                <p class="settings-desc">Atualiza a tua password de acesso</p>
              </div>
            </div>

            @if (pwMsg) {
              <div class="alert" [class.alert-success]="!pwError" [class.alert-error]="pwError" style="margin-bottom: 16px">
                <i [class]="pwError ? 'ri-error-warning-line' : 'ri-check-line'"></i> {{ pwMsg }}
              </div>
            }

            <div class="form-group">
              <label><i class="ri-lock-2-line"></i> Password Atual</label>
              <input type="password" class="form-control" [(ngModel)]="currentPassword" placeholder="••••••••">
            </div>
            <div class="form-group">
              <label><i class="ri-lock-line"></i> Nova Password</label>
              <input type="password" class="form-control" [(ngModel)]="newPassword" placeholder="Mín. 6 caracteres">
            </div>
            <div class="form-group">
              <label><i class="ri-lock-line"></i> Confirmar Nova Password</label>
              <input type="password" class="form-control" [(ngModel)]="confirmPassword" placeholder="••••••••">
            </div>
            <button class="btn btn-primary" (click)="changePassword()" [disabled]="changingPw">
              <i class="ri-save-line"></i> {{ changingPw ? 'A alterar...' : 'Alterar Password' }}
            </button>
          </div>
        </div>

        <!-- Notifications Preferences -->
        <div class="card settings-card">
          <div class="card-body" style="padding: 24px">
            <div class="settings-card-header">
              <div class="settings-icon" style="background: rgba(59,130,246,0.12); color: #3b82f6"><i class="ri-notification-3-line"></i></div>
              <div>
                <h3>Notificações</h3>
                <p class="settings-desc">Controla as notificações que recebes</p>
              </div>
            </div>

            <div class="toggle-group">
              <div class="toggle-item">
                <div>
                  <div class="toggle-label">Novos seguidores</div>
                  <div class="toggle-desc">Receber notificação quando alguém te começa a seguir</div>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="prefs.newFollower">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="toggle-item">
                <div>
                  <div class="toggle-label">Mensagens</div>
                  <div class="toggle-desc">Receber notificação de novas mensagens</div>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="prefs.messages">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="toggle-item">
                <div>
                  <div class="toggle-label">Lembretes de eventos</div>
                  <div class="toggle-desc">Receber lembretes antes dos eventos começarem</div>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="prefs.eventReminders">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="toggle-item">
                <div>
                  <div class="toggle-label">Compras de bilhetes</div>
                  <div class="toggle-desc">Receber confirmações de compra</div>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="prefs.ticketPurchased">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Language / Appearance -->
        <div class="card settings-card">
          <div class="card-body" style="padding: 24px">
            <div class="settings-card-header">
              <div class="settings-icon" style="background: rgba(168,85,247,0.12); color: #a855f7"><i class="ri-palette-line"></i></div>
              <div>
                <h3>Aparência</h3>
                <p class="settings-desc">Personaliza o aspecto da aplicação</p>
              </div>
            </div>

            <div class="form-group">
              <label><i class="ri-translate-2"></i> Idioma</label>
              <select class="form-control" [(ngModel)]="language">
                <option value="pt">Português</option>
                <option value="en">English</option>
              </select>
            </div>
            <div class="form-group">
              <label><i class="ri-contrast-2-line"></i> Tema</label>
              <select class="form-control" [(ngModel)]="theme">
                <option value="light">Claro</option>
                <option value="dark">Escuro (em breve)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Account Info -->
        <div class="card settings-card">
          <div class="card-body" style="padding: 24px">
            <div class="settings-card-header">
              <div class="settings-icon" style="background: rgba(34,197,94,0.12); color: #22c55e"><i class="ri-user-settings-line"></i></div>
              <div>
                <h3>Conta</h3>
                <p class="settings-desc">Informações da tua conta</p>
              </div>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Email</span>
                <span>{{ auth.currentUser()?.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Tipo de conta</span>
                <span>{{ getRoleLabel(auth.currentUser()?.role || '') }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Conta verificada</span>
                <span>{{ auth.currentUser()?.verified ? '✔ Sim' : '✘ Não' }}</span>
              </div>
            </div>

            <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color)">
              <button class="btn btn-secondary" style="width: 100%" (click)="logout()">
                <i class="ri-logout-box-r-line"></i> Terminar Sessão
              </button>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="card settings-card danger-card">
          <div class="card-body" style="padding: 24px">
            <div class="settings-card-header">
              <div class="settings-icon" style="background: rgba(239,68,68,0.12); color: #ef4444"><i class="ri-alert-line"></i></div>
              <div>
                <h3 style="color: #ef4444">Zona Perigosa</h3>
                <p class="settings-desc">Ações irreversíveis da conta</p>
              </div>
            </div>
            <button class="btn btn-danger" disabled>
              <i class="ri-delete-bin-line"></i> Eliminar Conta (em breve)
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
      gap: 20px;
    }
    .settings-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .settings-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.06);
    }
    .settings-card-header {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 20px;
    }
    .settings-card-header h3 {
      margin: 0 0 2px;
      font-size: 1rem;
    }
    .settings-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }
    .settings-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin: 0;
    }
    .toggle-group {
      display: flex;
      flex-direction: column;
    }
    .toggle-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 0;
      border-bottom: 1px solid var(--border-color);
      gap: 16px;
    }
    .toggle-item:last-child {
      border-bottom: none;
    }
    .toggle-label {
      font-size: 0.875rem;
      font-weight: 500;
    }
    .toggle-desc {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .toggle-switch {
      position: relative;
      width: 44px;
      height: 24px;
      flex-shrink: 0;
    }
    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background: var(--bg-tertiary);
      border-radius: 24px;
      transition: 0.3s;
    }
    .toggle-slider::before {
      content: '';
      position: absolute;
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background: white;
      border-radius: 50%;
      transition: 0.3s;
    }
    .toggle-switch input:checked + .toggle-slider {
      background: var(--accent-primary);
    }
    .toggle-switch input:checked + .toggle-slider::before {
      transform: translateX(20px);
    }
    .info-grid {
      display: flex;
      flex-direction: column;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--border-color);
      font-size: 0.85rem;
    }
    .info-item:last-child {
      border-bottom: none;
    }
    .info-label {
      color: var(--text-tertiary);
      font-weight: 500;
    }
    .danger-card {
      border: 1px solid rgba(239,68,68,0.2);
    }
    .btn-danger {
      background: rgba(239,68,68,0.1);
      color: #ef4444;
      border: 1px solid rgba(239,68,68,0.3);
      padding: 10px 20px;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-weight: 600;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .btn-danger:hover:not(:disabled) {
      background: rgba(239,68,68,0.2);
    }
    .btn-danger:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .alert-success {
      background: rgba(34,197,94,0.1);
      border: 1px solid rgba(34,197,94,0.3);
      color: #22c55e;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    @media (max-width: 600px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SettingsComponent {
    // Password
    currentPassword = '';
    newPassword = '';
    confirmPassword = '';
    changingPw = false;
    pwMsg = '';
    pwError = false;

    // Preferences (local-only for now)
    prefs = {
        newFollower: true,
        messages: true,
        eventReminders: true,
        ticketPurchased: true
    };

    // Appearance
    language = 'pt';
    theme = 'light';

    constructor(
        private api: ApiService,
        public auth: AuthService,
        private router: Router
    ) { }

    changePassword() {
        this.pwMsg = '';
        if (this.newPassword !== this.confirmPassword) {
            this.pwMsg = 'As passwords não coincidem.';
            this.pwError = true;
            return;
        }
        if (this.newPassword.length < 6) {
            this.pwMsg = 'A nova password deve ter pelo menos 6 caracteres.';
            this.pwError = true;
            return;
        }
        this.changingPw = true;
        this.api.changePassword(this.currentPassword, this.newPassword).subscribe({
            next: () => {
                this.changingPw = false;
                this.pwMsg = 'Password alterada com sucesso!';
                this.pwError = false;
                this.currentPassword = '';
                this.newPassword = '';
                this.confirmPassword = '';
            },
            error: (err) => {
                this.changingPw = false;
                this.pwMsg = err.error?.message || 'Erro ao alterar password.';
                this.pwError = true;
            }
        });
    }

    logout() {
        this.auth.logout();
    }

    getRoleLabel(role: string): string {
        const map: Record<string, string> = { Admin: 'Administrador', Organizer: 'Organizador', DjArtist: 'DJ / Artista', User: 'Utilizador', Developer: 'Desenvolvedor' };
        return map[role] || role;
    }
}
