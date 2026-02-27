import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'dark' | 'gold';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    theme = signal<ThemeMode>(this.loadTheme());

    constructor() {
        effect(() => {
            const t = this.theme();
            document.documentElement.setAttribute('data-theme', t);
            localStorage.setItem('boda-theme', t);
        });
    }

    toggle(): void {
        this.theme.update(t => t === 'dark' ? 'gold' : 'dark');
    }

    private loadTheme(): ThemeMode {
        const saved = localStorage.getItem('boda-theme');
        if (saved === 'gold' || saved === 'dark') return saved;
        return 'dark';
    }
}
