import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-developer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-header">
      <h2><i class="ri-code-s-slash-line"></i> Painel Desenvolvedor</h2>
    </div>

    <div class="content-body fade-in">
      <div class="tabs">
        <button class="tab" [class.active]="tab === 'api'" (click)="tab = 'api'"><i class="ri-book-open-line"></i> API Docs</button>
        <button class="tab" [class.active]="tab === 'keys'" (click)="tab = 'keys'"><i class="ri-key-2-line"></i> API Keys</button>
        <button class="tab" [class.active]="tab === 'webhooks'" (click)="tab = 'webhooks'"><i class="ri-links-line"></i> Webhooks</button>
        <button class="tab" [class.active]="tab === 'logs'" (click)="tab = 'logs'"><i class="ri-file-list-3-line"></i> Logs</button>
      </div>

      @if (tab === 'api') {
        <div class="card">
          <div class="card-body" style="padding: 24px">
            <h3 style="margin-bottom: 16px"><i class="ri-book-open-line"></i> API RESTful — Boda v1</h3>
            <p style="color: var(--text-secondary); margin-bottom: 20px">Base URL: <code style="background: var(--bg-surface); padding: 4px 8px; border-radius: 4px; font-family: monospace; color: var(--accent-primary)">http://localhost:5000/api</code></p>

            @for (endpoint of endpoints; track endpoint.path) {
              <div class="api-endpoint">
                <span class="method-badge" [class]="endpoint.method.toLowerCase()">{{ endpoint.method }}</span>
                <code>{{ endpoint.path }}</code>
                <span style="margin-left: auto; font-size: 0.8rem; color: var(--text-muted)">{{ endpoint.description }}</span>
              </div>
            }
          </div>
        </div>
      }

      @if (tab === 'keys') {
        <div class="card">
          <div class="card-body" style="padding: 24px">
            <h3 style="margin-bottom: 16px"><i class="ri-key-2-line"></i> API Keys</h3>
            <div class="api-key-card">
              <div>
                <div style="font-weight: 600; margin-bottom: 4px">Development Key</div>
                <code style="font-size: 0.8rem; color: var(--accent-primary); background: var(--bg-surface); padding: 6px 10px; border-radius: 6px; display: block; margin-top: 6px">boda_dev_sk_test_51Abc...XYZ</code>
              </div>
              <div style="margin-top: 8px; font-size: 0.75rem; color: var(--text-muted)">Criada: {{ today | date:'d MMM y' }} · Ambiente: Development</div>
            </div>
            <button class="btn btn-primary" style="margin-top: 16px"><i class="ri-add-line"></i> Gerar Nova Key</button>
          </div>
        </div>
      }

      @if (tab === 'webhooks') {
        <div class="card">
          <div class="card-body" style="padding: 24px; text-align: center">
            <div style="font-size: 3rem; margin-bottom: 12px"><i class="ri-links-line"></i></div>
            <h3>Webhooks</h3>
            <p style="color: var(--text-tertiary); margin-top: 8px">Configure webhooks para receber notificações em tempo real sobre pagamentos, novos pedidos e alterações de eventos.</p>
            <button class="btn btn-primary" style="margin-top: 16px"><i class="ri-add-line"></i> Configurar Webhook</button>
          </div>
        </div>
      }

      @if (tab === 'logs') {
        <div class="card">
          <div class="card-body" style="padding: 24px">
            <h3 style="margin-bottom: 16px"><i class="ri-file-list-3-line"></i> Logs de API</h3>
            <table class="data-table">
              <thead><tr><th>Hora</th><th>Método</th><th>Endpoint</th><th>Status</th><th>Latência</th></tr></thead>
              <tbody>
                <tr><td>{{ today | date:'HH:mm:ss' }}</td><td><span class="method-badge get">GET</span></td><td>/api/events</td><td><span class="status-badge paid">200</span></td><td>45ms</td></tr>
                <tr><td>{{ today | date:'HH:mm:ss' }}</td><td><span class="method-badge post">POST</span></td><td>/api/auth/login</td><td><span class="status-badge paid">200</span></td><td>120ms</td></tr>
                <tr><td>{{ today | date:'HH:mm:ss' }}</td><td><span class="method-badge get">GET</span></td><td>/api/auth/me</td><td><span class="status-badge paid">200</span></td><td>23ms</td></tr>
                <tr><td>{{ today | date:'HH:mm:ss' }}</td><td><span class="method-badge get">GET</span></td><td>/api/notifications</td><td><span class="status-badge paid">200</span></td><td>67ms</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .api-endpoint {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--border-color);
      font-size: 0.85rem;
    }
    .api-endpoint code {
      font-family: monospace;
      color: var(--text-primary);
    }
    .method-badge {
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      min-width: 48px;
      text-align: center;
      display: inline-block;
    }
    .method-badge.get { background: rgba(34,197,94,0.12); color: #22c55e; }
    .method-badge.post { background: rgba(59,130,246,0.12); color: #3b82f6; }
    .method-badge.put { background: rgba(245,158,11,0.12); color: #f59e0b; }
    .method-badge.delete { background: rgba(239,68,68,0.12); color: #ef4444; }
    .api-key-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 16px;
    }
  `]
})
export class DeveloperComponent {
  tab = 'api';
  today = new Date();

  endpoints = [
    { method: 'POST', path: '/auth/register', description: 'Registar utilizador' },
    { method: 'POST', path: '/auth/login', description: 'Login → JWT' },
    { method: 'GET', path: '/auth/me', description: 'Perfil do utilizador autenticado' },
    { method: 'GET', path: '/events', description: 'Listar eventos (filtros: city, category, q)' },
    { method: 'GET', path: '/events/:slug', description: 'Detalhes do evento' },
    { method: 'POST', path: '/events', description: 'Criar evento (Organizador)' },
    { method: 'GET', path: '/events/categories', description: 'Listar categorias' },
    { method: 'GET', path: '/users/:id', description: 'Perfil público' },
    { method: 'POST', path: '/users/:id/follow', description: 'Seguir utilizador' },
    { method: 'DELETE', path: '/users/:id/follow', description: 'Deixar de seguir' },
    { method: 'GET', path: '/comments/event/:id', description: 'Comentários do evento' },
    { method: 'POST', path: '/comments/event/:id', description: 'Criar comentário' },
    { method: 'GET', path: '/messages', description: 'Inbox de mensagens' },
    { method: 'POST', path: '/messages', description: 'Enviar mensagem' },
    { method: 'GET', path: '/notifications', description: 'Listar notificações' },
    { method: 'PUT', path: '/notifications/:id/read', description: 'Marcar como lida' },
    { method: 'GET', path: '/admin/dashboard', description: 'Dashboard admin' },
    { method: 'GET', path: '/admin/reports/sales', description: 'Relatórios de vendas' },
  ];
}
