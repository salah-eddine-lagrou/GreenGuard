import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router) {}

  showHeader(): boolean {
    const currentRoute = this.router.url;
    return currentRoute.includes('/listing') || currentRoute.includes('/settings');
  }

  showTabs(): boolean {
    const currentRoute = this.router.url;
    return currentRoute.includes('/listing') || currentRoute.includes('/settings');
  }
}
