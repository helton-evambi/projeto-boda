import { Routes } from '@angular/router';
import { authGuard, adminGuard, organizerGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'feed', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
    { path: 'feed', loadComponent: () => import('./pages/feed/feed.component').then(m => m.FeedComponent), canActivate: [authGuard] },
    { path: 'explore', loadComponent: () => import('./pages/explore/explore.component').then(m => m.ExploreComponent), canActivate: [authGuard] },
    { path: 'event/:slug', loadComponent: () => import('./pages/event-details/event-details.component').then(m => m.EventDetailsComponent), canActivate: [authGuard] },
    { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
    { path: 'profile/:id', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
    { path: 'messages', loadComponent: () => import('./pages/messages/messages.component').then(m => m.MessagesComponent), canActivate: [authGuard] },
    { path: 'notifications', loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent), canActivate: [authGuard] },
    { path: 'tickets', loadComponent: () => import('./pages/tickets/tickets.component').then(m => m.TicketsComponent), canActivate: [authGuard] },
    { path: 'admin', loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent), canActivate: [adminGuard] },
    { path: 'organizer', loadComponent: () => import('./pages/organizer/organizer.component').then(m => m.OrganizerComponent), canActivate: [organizerGuard] },
    { path: 'developer', loadComponent: () => import('./pages/developer/developer.component').then(m => m.DeveloperComponent), canActivate: [authGuard] },
    { path: '**', redirectTo: 'feed' }
];
