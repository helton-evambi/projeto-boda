import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { BodaEvent, Venue } from '../../core/models/models';

@Component({
    selector: 'app-organizer',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="content-header">
      <h2><i class="ri-bar-chart-box-line"></i> Painel Organizador</h2>
    </div>

    <div class="content-body fade-in">
      <div class="tabs">
        <button class="tab" [class.active]="tab === 'overview'" (click)="tab = 'overview'"><i class="ri-dashboard-line"></i> Visão Geral</button>
        <button class="tab" [class.active]="tab === 'events'" (click)="tab = 'events'"><i class="ri-calendar-event-line"></i> Meus Eventos</button>
        <button class="tab" [class.active]="tab === 'create'" (click)="tab = 'create'"><i class="ri-add-circle-line"></i> Criar Evento</button>
      </div>

      @if (tab === 'overview') {
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-icon gold"><i class="ri-calendar-event-line"></i></div><div class="stat-value">{{ myEvents.length }}</div><div class="stat-label">Eventos</div></div>
          <div class="stat-card"><div class="stat-icon green"><i class="ri-heart-3-fill"></i></div><div class="stat-value">{{ totalLikes }}</div><div class="stat-label">Likes</div></div>
          <div class="stat-card"><div class="stat-icon blue"><i class="ri-chat-3-line"></i></div><div class="stat-value">{{ totalComments }}</div><div class="stat-label">Comentários</div></div>
          <div class="stat-card"><div class="stat-icon orange"><i class="ri-share-forward-line"></i></div><div class="stat-value">{{ totalShares }}</div><div class="stat-label">Partilhas</div></div>
        </div>
        <h3 style="margin:20px 0 12px">Próximos Eventos</h3>
        @if (upcomingEvents.length === 0) {
          <div class="empty-state"><h3>Sem eventos próximos</h3></div>
        } @else {
          <div class="events-grid">
            @for (e of upcomingEvents; track e.id) {
              <div class="event-card">
                <div class="event-image-wrapper"><img [src]="e.imageUrl" [alt]="e.title"><div class="event-date-badge"><div class="day">{{ getDay(e.startDateTime) }}</div><div class="month">{{ getMonth(e.startDateTime) }}</div></div></div>
                <div class="event-content"><div class="event-title">{{ e.title }}</div><div style="display:flex;gap:12px;font-size:0.8rem;color:var(--text-muted);margin-top:6px"><span><i class="ri-heart-3-line"></i> {{ e.likesCount }}</span><span><i class="ri-ticket-line"></i> {{ getTotalSold(e) }} vendidos</span></div></div>
              </div>
            }
          </div>
        }
      }

      @if (tab === 'events') {
        <table class="data-table">
          <thead><tr><th>Evento</th><th>Categoria</th><th>Data</th><th>Likes</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            @for (e of myEvents; track e.id) {
              <tr>
                <td style="font-weight:600">{{ e.title }}</td>
                <td>{{ e.category }}</td>
                <td>{{ e.startDateTime | date:'d MMM y' }}</td>
                <td><i class="ri-heart-3-line"></i> {{ e.likesCount }}</td>
                <td><span class="status-badge published">{{ e.status }}</span></td>
                <td><button class="btn btn-sm btn-secondary" style="padding:4px 10px;font-size:0.7rem" (click)="cancelEvent(e.id)"><i class="ri-close-circle-line"></i></button></td>
              </tr>
            }
          </tbody>
        </table>
      }

      @if (tab === 'create') {
        <div class="create-form">
          <!-- Image Selection -->
          <div class="card" style="margin-bottom:20px"><div class="card-body" style="padding:20px">
            <h3 style="margin-bottom:16px"><i class="ri-image-line"></i> Foto do Evento</h3>
            <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:12px">Seleciona uma imagem que represente o teu evento</p>
            <div class="img-grid">
              @for (img of imageOptions; track img.url) {
                <div class="img-opt" [class.sel]="newEvent.imageUrl===img.url" (click)="newEvent.imageUrl=img.url">
                  <img [src]="img.url" [alt]="img.label">
                  <span class="img-lbl">{{ img.label }}</span>
                  @if (newEvent.imageUrl===img.url) { <span class="img-chk"><i class="ri-checkbox-circle-fill"></i></span> }
                </div>
              }
            </div>
            <div style="margin-top:12px;display:flex;gap:8px;align-items:center">
              <span style="font-size:0.75rem;color:var(--text-muted);white-space:nowrap">ou URL:</span>
              <input type="url" class="form-control" style="flex:1;font-size:0.8rem" [(ngModel)]="customUrl" placeholder="https://..." (blur)="newEvent.imageUrl=customUrl||newEvent.imageUrl">
            </div>
            @if (newEvent.imageUrl) {
              <div class="img-preview"><img [src]="newEvent.imageUrl"><div class="pv-overlay"><span class="pv-badge"><i class="ri-check-line"></i> Selecionada</span></div></div>
            }
          </div></div>

          <!-- Details -->
          <div class="card" style="margin-bottom:20px"><div class="card-body" style="padding:20px">
            <h3 style="margin-bottom:16px"><i class="ri-file-text-line"></i> Detalhes do Evento</h3>
            <div class="form-group"><label><i class="ri-text"></i> Título</label><input type="text" class="form-control" [(ngModel)]="newEvent.title" placeholder="Nome do evento"></div>
            <div class="form-group"><label><i class="ri-file-text-line"></i> Descrição</label><textarea class="form-control" [(ngModel)]="newEvent.description" rows="3" placeholder="Descreve o evento..."></textarea></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
              <div class="form-group"><label><i class="ri-price-tag-3-line"></i> Tipo / Categoria</label>
                <div class="cat-sel">
                  @for (cat of catOpts; track cat.n) {
                    <button class="cat-chip" [class.active]="newEvent.category===cat.n" (click)="newEvent.category=cat.n"><i [class]="cat.i"></i> {{ cat.n }}</button>
                  }
                </div>
              </div>
              <div class="form-group"><label><i class="ri-group-line"></i> Capacidade</label><input type="number" class="form-control" [(ngModel)]="newEvent.capacity" placeholder="1000"></div>
              <div class="form-group"><label><i class="ri-map-pin-2-line"></i> Local</label>
                <select class="form-control" [(ngModel)]="newEvent.venueId"><option [ngValue]="null">Selecionar...</option>@for (v of venues; track v.id) { <option [ngValue]="v.id">{{ v.name }} — {{ v.city }}</option> }</select>
              </div>
              <div class="form-group"><label><i class="ri-shield-user-line"></i> Idade Mínima</label>
                <select class="form-control" [(ngModel)]="newEvent.minAge"><option [ngValue]="0">Todos</option><option [ngValue]="16">16+</option><option [ngValue]="18">18+</option><option [ngValue]="21">21+</option></select>
              </div>
              <div class="form-group"><label><i class="ri-calendar-line"></i> Início</label><input type="datetime-local" class="form-control" [(ngModel)]="newEvent.startDateTime"></div>
              <div class="form-group"><label><i class="ri-calendar-check-line"></i> Fim</label><input type="datetime-local" class="form-control" [(ngModel)]="newEvent.endDateTime"></div>
            </div>
          </div></div>

          <!-- Tickets -->
          <div class="card" style="margin-bottom:20px"><div class="card-body" style="padding:20px">
            <h3 style="margin-bottom:16px"><i class="ri-ticket-line"></i> Bilhetes</h3>
            @for (tier of tiers; track tier.type) {
              <div class="tier-row">
                <label style="display:flex;gap:6px;align-items:center;min-width:100px;font-size:0.85rem"><input type="checkbox" [(ngModel)]="tier.on"> <strong>{{ tier.type }}</strong></label>
                <input type="number" class="form-control" style="width:110px;font-size:0.8rem" [(ngModel)]="tier.price" placeholder="Preço" [disabled]="!tier.on||tier.type==='Free'">
                <span style="font-size:0.7rem;color:var(--text-muted)">Kz</span>
                <input type="number" class="form-control" style="width:80px;font-size:0.8rem" [(ngModel)]="tier.qty" placeholder="Qtd" [disabled]="!tier.on">
              </div>
            }
          </div></div>

          <button class="btn btn-primary btn-lg" style="width:100%;padding:16px;font-size:1.1rem" (click)="createEvent()" [disabled]="creating||!newEvent.title||!newEvent.imageUrl">
            <i class="ri-calendar-check-line"></i> {{ creating ? 'A criar...' : 'Publicar Evento' }}
          </button>
        </div>
      }
    </div>
  `,
    styles: [`
    .img-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
    .img-opt{position:relative;border-radius:var(--radius-md);overflow:hidden;cursor:pointer;border:3px solid transparent;transition:all .2s;aspect-ratio:16/10}
    .img-opt:hover{border-color:var(--accent-primary)}.img-opt.sel{border-color:var(--accent-primary);box-shadow:0 0 12px rgba(242,196,0,.3)}
    .img-opt img{width:100%;height:100%;object-fit:cover;display:block}
    .img-lbl{position:absolute;bottom:0;left:0;right:0;padding:4px 8px;font-size:.6rem;font-weight:600;background:linear-gradient(transparent,rgba(0,0,0,.8));color:#fff;text-transform:uppercase}
    .img-chk{position:absolute;top:6px;right:6px;color:var(--accent-primary);font-size:1.3rem;filter:drop-shadow(0 1px 2px rgba(0,0,0,.5))}
    .img-preview{margin-top:16px;border-radius:var(--radius-lg);overflow:hidden;position:relative;max-height:200px}
    .img-preview img{width:100%;height:200px;object-fit:cover;display:block}
    .pv-overlay{position:absolute;bottom:0;left:0;right:0;padding:12px;background:linear-gradient(transparent,rgba(0,0,0,.7));display:flex;justify-content:flex-end}
    .pv-badge{font-size:.7rem;font-weight:600;padding:4px 10px;border-radius:50px;background:var(--accent-gradient);color:#000}
    .cat-sel{display:flex;flex-wrap:wrap;gap:6px}
    .cat-chip{padding:8px 14px;border:1px solid var(--border-color);border-radius:50px;background:var(--bg-surface);color:var(--text-secondary);font-family:inherit;font-size:.75rem;font-weight:500;cursor:pointer;transition:all .2s}
    .cat-chip:hover{border-color:var(--accent-primary);color:var(--accent-primary)}
    .cat-chip.active{background:var(--accent-gradient);color:#000;border-color:transparent;font-weight:600}
    .tier-row{display:flex;align-items:center;gap:12px;padding:10px 12px;border:1px solid var(--border-color);border-radius:var(--radius-md);margin-bottom:8px}
    @media(max-width:600px){.img-grid{grid-template-columns:repeat(2,1fr)}}
  `]
})
export class OrganizerComponent implements OnInit {
    tab = 'overview';
    myEvents: BodaEvent[] = [];
    upcomingEvents: BodaEvent[] = [];
    venues: Venue[] = [];
    totalLikes = 0; totalComments = 0; totalShares = 0;
    creating = false;
    customUrl = '';

    newEvent: any = {
        title: '', description: '', category: 'Festa', capacity: 1000,
        startDateTime: '', endDateTime: '', imageUrl: '', minAge: 18, venueId: null, isHybrid: false
    };

    tiers = [
        { type: 'Free', price: 0, qty: 100, on: true },
        { type: 'EarlyBird', price: 2500, qty: 50, on: false },
        { type: 'Normal', price: 5000, qty: 200, on: true },
        { type: 'VIP', price: 15000, qty: 30, on: false },
    ];

    catOpts = [
        { n: 'Festa', i: 'ri-goblet-line' }, { n: 'Festival', i: 'ri-music-2-line' },
        { n: 'Show', i: 'ri-mic-2-line' }, { n: 'Gala', i: 'ri-vip-crown-line' },
        { n: 'Conferência', i: 'ri-presentation-line' }, { n: 'Workshop', i: 'ri-tools-line' },
        { n: 'Desporto', i: 'ri-boxing-line' }, { n: 'Cultural', i: 'ri-palette-line' },
    ];

    imageOptions = [
        { url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', label: 'Festa' },
        { url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', label: 'Festival' },
        { url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', label: 'Concerto' },
        { url: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800', label: 'DJ / Club' },
        { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', label: 'Conferência' },
        { url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800', label: 'Gala' },
        { url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800', label: 'Ao Ar Livre' },
        { url: 'https://images.unsplash.com/photo-1571266028243-d220e6a767e3?w=800', label: 'Cultural' },
    ];

    constructor(private api: ApiService, private auth: AuthService) { }

    ngOnInit() {
        this.api.getEvents().subscribe(events => {
            const userId = this.auth.currentUser()?.id;
            this.myEvents = events.filter(e => e.organizerId === userId);
            this.upcomingEvents = this.myEvents.filter(e => new Date(e.startDateTime) > new Date());
            this.totalLikes = this.myEvents.reduce((s, e) => s + e.likesCount, 0);
            this.totalComments = this.myEvents.reduce((s, e) => s + e.commentsCount, 0);
            this.totalShares = this.myEvents.reduce((s, e) => s + e.sharesCount, 0);
        });
        this.api.getVenues().subscribe(v => this.venues = v);
    }

    createEvent() {
        this.creating = true;
        const payload = {
            ...this.newEvent,
            tickets: this.tiers.filter(t => t.on).map(t => ({ type: t.type, price: t.price, quantityTotal: t.qty }))
        };
        this.api.createEvent(payload).subscribe({
            next: () => { this.creating = false; this.tab = 'events'; this.ngOnInit(); },
            error: () => this.creating = false
        });
    }

    cancelEvent(id: number) {
        if (confirm('Cancelar este evento?')) this.api.cancelEvent(id).subscribe(() => this.ngOnInit());
    }

    getDay(d: string) { return new Date(d).getDate().toString().padStart(2, '0'); }
    getMonth(d: string) { return new Date(d).toLocaleString('pt', { month: 'short' }).toUpperCase(); }
    getTotalSold(e: BodaEvent) { return e.tickets?.reduce((s, t) => s + t.quantitySold, 0) || 0; }
}
