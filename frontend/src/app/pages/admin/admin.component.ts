import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { DashboardStats, User, BodaEvent } from '../../core/models/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-header">
      <h2><i class="ri-settings-3-line"></i> Administração</h2>
    </div>

    <div class="content-body fade-in">
      <div class="tabs">
        <button class="tab" [class.active]="tab === 'dashboard'" (click)="tab = 'dashboard'"><i class="ri-dashboard-line"></i> Dashboard</button>
        <button class="tab" [class.active]="tab === 'users'" (click)="tab = 'users'; loadUsers()"><i class="ri-group-line"></i> Utilizadores</button>
        <button class="tab" [class.active]="tab === 'events'" (click)="tab = 'events'; loadEvents()"><i class="ri-calendar-event-line"></i> Eventos</button>
        <button class="tab" [class.active]="tab === 'reports'" (click)="tab = 'reports'; loadSales()"><i class="ri-line-chart-line"></i> Relatórios</button>
        <button class="tab" [class.active]="tab === 'settings'" (click)="tab = 'settings'"><i class="ri-equalizer-line"></i> Configurações</button>
      </div>

      @if (tab === 'dashboard') {
        @if (stats) {
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon gold"><i class="ri-group-line"></i></div>
              <div class="stat-value">{{ stats.totalUsers }}</div>
              <div class="stat-label">Utilizadores</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon green"><i class="ri-calendar-event-line"></i></div>
              <div class="stat-value">{{ stats.totalEvents }}</div>
              <div class="stat-label">Eventos</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon blue"><i class="ri-ticket-line"></i></div>
              <div class="stat-value">{{ stats.totalOrders }}</div>
              <div class="stat-label">Pedidos</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon orange"><i class="ri-money-dollar-circle-line"></i></div>
              <div class="stat-value">{{ stats.totalRevenue | number }} Kz</div>
              <div class="stat-label">Receita Total</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px">
            <div class="stat-card">
              <div class="stat-value" style="color: var(--success)">{{ stats.activeEvents }}</div>
              <div class="stat-label">Eventos Ativos</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" style="color: var(--accent-primary)">{{ stats.totalCommission | number }} Kz</div>
              <div class="stat-label">Comissão Total</div>
            </div>
          </div>

          @if (stats.recentOrders.length > 0) {
            <h3 style="margin: 24px 0 12px"><i class="ri-file-list-3-line"></i> Pedidos Recentes</h3>
            <table class="data-table">
              <thead>
                <tr><th>#</th><th>Utilizador</th><th>Valor</th><th>Estado</th><th>Data</th></tr>
              </thead>
              <tbody>
                @for (order of stats.recentOrders; track order.id) {
                  <tr>
                    <td>{{ order.id }}</td>
                    <td>{{ order.userName }}</td>
                    <td style="font-weight: 600; color: var(--accent-primary)">{{ order.amount | number }} Kz</td>
                    <td><span class="status-badge" [class]="order.status.toLowerCase()">{{ order.status }}</span></td>
                    <td>{{ order.createdAt | date:'d MMM HH:mm' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          }
        }
      }

      @if (tab === 'users') {
        <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap">
          <button class="btn btn-sm" [class]="userFilter === '' ? 'btn-primary' : 'btn-secondary'" (click)="filterUsers('')">Todos</button>
          <button class="btn btn-sm" [class]="userFilter === 'Admin' ? 'btn-primary' : 'btn-secondary'" (click)="filterUsers('Admin')"><i class="ri-shield-user-line"></i> Admin</button>
          <button class="btn btn-sm" [class]="userFilter === 'Organizer' ? 'btn-primary' : 'btn-secondary'" (click)="filterUsers('Organizer')"><i class="ri-calendar-event-line"></i> Organizador</button>
          <button class="btn btn-sm" [class]="userFilter === 'DjArtist' ? 'btn-primary' : 'btn-secondary'" (click)="filterUsers('DjArtist')"><i class="ri-disc-line"></i> DJ/Artista</button>
          <button class="btn btn-sm" [class]="userFilter === 'User' ? 'btn-primary' : 'btn-secondary'" (click)="filterUsers('User')"><i class="ri-user-3-line"></i> Utilizador</button>
          <button class="btn btn-sm" [class]="userFilter === 'Developer' ? 'btn-primary' : 'btn-secondary'" (click)="filterUsers('Developer')"><i class="ri-code-s-slash-line"></i> Dev</button>
        </div>
        <table class="data-table">
          <thead><tr><th>Nome</th><th>Email</th><th>Tipo</th><th>Verificado</th><th>Desde</th></tr></thead>
          <tbody>
            @for (u of users; track u.id) {
              <tr>
                <td style="display: flex; align-items: center; gap: 10px">
                  <img [src]="u.avatarUrl" style="width: 32px; height: 32px; border-radius: 50%">
                  {{ u.name }}
                </td>
                <td>{{ u.email }}</td>
                <td><span class="status-badge published">{{ u.role }}</span></td>
                <td><i [class]="u.verified ? 'ri-checkbox-circle-fill' : 'ri-close-circle-line'" [style.color]="u.verified ? 'var(--success)' : 'var(--danger)'"></i></td>
                <td>{{ u.createdAt | date:'d MMM y' }}</td>
              </tr>
            }
          </tbody>
        </table>
      }

      @if (tab === 'events') {
        <table class="data-table">
          <thead><tr><th>Evento</th><th>Organizador</th><th>Categoria</th><th>Data</th><th>Estado</th><th>Likes</th></tr></thead>
          <tbody>
            @for (e of events; track e.id) {
              <tr>
                <td style="font-weight: 600">{{ e.title }}</td>
                <td>{{ e.organizerName }}</td>
                <td>{{ e.category }}</td>
                <td>{{ e.startDateTime | date:'d MMM y' }}</td>
                <td><span class="status-badge" [class]="e.status.toLowerCase()">{{ e.status }}</span></td>
                <td><i class="ri-heart-3-line"></i> {{ e.likesCount }}</td>
              </tr>
            }
          </tbody>
        </table>
      }

      @if (tab === 'reports') {
        <h3 style="margin-bottom: 12px"><i class="ri-line-chart-line"></i> Relatório de Vendas</h3>
        @if (salesReport.length > 0) {
          <table class="data-table">
            <thead><tr><th>#</th><th>Utilizador</th><th>Evento</th><th>Valor</th><th>Comissão</th><th>Método</th><th>Data</th></tr></thead>
            <tbody>
              @for (sale of salesReport; track sale.id) {
                <tr>
                  <td>{{ sale.id }}</td>
                  <td>{{ sale.user }}</td>
                  <td>{{ sale.event }}</td>
                  <td style="color: var(--accent-primary); font-weight: 600">{{ sale.totalAmount | number }} Kz</td>
                  <td>{{ sale.commissionAmount | number }} Kz</td>
                  <td>{{ sale.paymentMethod }}</td>
                  <td>{{ sale.paidAt | date:'d MMM' }}</td>
                </tr>
              }
            </tbody>
          </table>
        } @else {
          <div class="empty-state"><h3>Sem dados de vendas</h3></div>
        }
      }

      @if (tab === 'settings') {
        <div class="card">
          <div class="card-body" style="padding: 24px">
            <h3 style="margin-bottom: 20px"><i class="ri-equalizer-line"></i> Configurações da Plataforma</h3>
            <div class="form-group">
              <label><i class="ri-percent-line"></i> Comissão por venda (%)</label>
              <input type="number" class="form-control" value="7" style="max-width: 200px">
            </div>
            <div class="form-group">
              <label><i class="ri-money-dollar-circle-line"></i> Taxa fixa por transação (Kz)</label>
              <input type="number" class="form-control" value="2000" style="max-width: 200px">
            </div>
            <div class="form-group">
              <label><i class="ri-checkbox-circle-line"></i> Aprovação automática de eventos</label>
              <select class="form-control" style="max-width: 200px">
                <option>Sim</option>
                <option>Não — requer aprovação manual</option>
              </select>
            </div>
            <button class="btn btn-primary"><i class="ri-save-line"></i> Guardar Configurações</button>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminComponent implements OnInit {
  tab = 'dashboard';
  stats: DashboardStats | null = null;
  users: User[] = [];
  events: BodaEvent[] = [];
  salesReport: any[] = [];
  userFilter = '';

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getDashboard().subscribe(s => this.stats = s);
  }

  loadUsers() {
    this.api.getAdminUsers(this.userFilter || undefined).subscribe(u => this.users = u);
  }

  filterUsers(role: string) {
    this.userFilter = role;
    this.api.getAdminUsers(role || undefined).subscribe(u => this.users = u);
  }

  loadEvents() {
    this.api.getAdminEvents().subscribe(e => this.events = e);
  }

  loadSales() {
    this.api.getSalesReport().subscribe(r => this.salesReport = r);
  }
}
