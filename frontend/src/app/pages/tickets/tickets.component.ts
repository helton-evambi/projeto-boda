import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { OrderDto } from '../../core/models/models';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="content-header">
      <h2><i class="ri-ticket-line"></i> Meus Bilhetes</h2>
    </div>

    <div class="content-body fade-in">
      @if (loading) {
        <div class="loading"><div class="spinner"></div></div>
      } @else if (orders.length === 0) {
        <div class="empty-state">
          <div class="empty-icon"><i class="ri-ticket-line" style="font-size: 3rem"></i></div>
          <h3>Sem bilhetes</h3>
          <p>Os bilhetes comprados aparecerão aqui.</p>
          <a routerLink="/explore" class="btn btn-primary" style="margin-top: 16px"><i class="ri-compass-3-line"></i> Explorar Eventos</a>
        </div>
      } @else {
        <div class="tickets-list">
          @for (order of orders; track order.id) {
            <div class="ticket-card">
              <div class="ticket-header">
                <div style="display: flex; gap: 12px; align-items: center">
                  @if (order.eventImage) {
                    <img [src]="order.eventImage" style="width: 60px; height: 60px; border-radius: var(--radius-md); object-fit: cover">
                  }
                  <div>
                    <div style="font-weight: 700; font-size: 1.1rem">{{ order.eventTitle || 'Evento' }}</div>
                    @if (order.venueName) {
                      <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px"><i class="ri-map-pin-2-line"></i> {{ order.venueName }}, {{ order.venueCity }}</div>
                    }
                    @if (order.eventDate) {
                      <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px"><i class="ri-calendar-line"></i> {{ order.eventDate | date:'d MMM y, HH:mm' }}</div>
                    }
                  </div>
                </div>
                <span class="status-badge" [class]="order.paymentStatus.toLowerCase()">
                  <i [class]="order.paymentStatus === 'Paid' ? 'ri-checkbox-circle-line' : 'ri-time-line'"></i> {{ order.paymentStatus === 'Paid' ? 'Pago' : 'Pendente' }}
                </span>
              </div>
              <div class="ticket-body">
                <div class="ticket-info">
                  <div><span class="label"><i class="ri-ticket-line"></i> Tipo</span><span>{{ order.ticketType }}</span></div>
                  <div><span class="label"><i class="ri-hashtag"></i> Qtd</span><span>{{ order.quantity }}</span></div>
                  <div><span class="label"><i class="ri-bank-card-line"></i> Pagamento</span><span>{{ order.paymentMethod }}</span></div>
                  <div><span class="label"><i class="ri-money-dollar-circle-line"></i> Total</span><span style="font-weight: 700; color: var(--accent-primary)">{{ order.totalAmount | number }} Kz</span></div>
                </div>

                @if (order.tickets.length > 0) {
                  <div style="margin-top: 14px; padding-top: 14px; border-top: 1px dashed var(--border-color)">
                    <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px"><i class="ri-qr-code-line"></i> Bilhetes Emitidos</div>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap">
                      @for (ticket of order.tickets; track ticket.id) {
                        <div class="issued-ticket">
                          @if (ticket.qrCodeUrl) {
                            <img [src]="ticket.qrCodeUrl" class="qr-img" alt="QR Code">
                          }
                          <code class="ticket-code">{{ ticket.ticketCode }}</code>
                          @if (ticket.used) {
                            <span style="font-size: 0.65rem; color: var(--text-muted)"><i class="ri-check-double-line"></i> Utilizado</span>
                          }
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .tickets-list { display: flex; flex-direction: column; gap: 16px; }
    .ticket-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden; transition: all 0.2s; }
    .ticket-card:hover { border-color: var(--accent-primary); transform: translateY(-2px); }
    .ticket-header { display: flex; justify-content: space-between; align-items: start; padding: 20px 20px 12px; }
    .ticket-body { padding: 0 20px 20px; }
    .ticket-info { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .ticket-info div { display: flex; flex-direction: column; gap: 2px; }
    .ticket-info .label { font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 500; letter-spacing: 0.5px; }
    .ticket-info .label i { margin-right: 4px; }
    .issued-ticket {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      padding: 10px; background: var(--bg-surface); border-radius: var(--radius-md);
      border: 1px dashed var(--border-color);
    }
    .qr-img { width: 100px; height: 100px; border-radius: 8px; background: #fff; padding: 4px; }
    .ticket-code { font-size: 0.7rem; letter-spacing: 1.5px; color: var(--accent-primary); }
  `]
})
export class TicketsComponent implements OnInit {
  orders: OrderDto[] = [];
  loading = true;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getMyOrders().subscribe({
      next: orders => { this.orders = orders; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
