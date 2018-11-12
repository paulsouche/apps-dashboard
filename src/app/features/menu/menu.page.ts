import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'menu-page',
  styleUrls: ['./menu.page.scss'],
  template: `
    <mat-sidenav-container
      class="sidenav-container"
    >
      <mat-sidenav
        #drawer
        class="sidenav"
        fixedInViewport="true"
        [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
        [mode]="(isHandset$ | async) ? 'over' : 'side'"
        [opened]="!(isHandset$ | async)"
      >
        <mat-toolbar>
          {{ 'menu' | translate }}
        </mat-toolbar>
        <mat-nav-list>
          <a
            mat-list-item
            routerLink="/dashboard"
          >
            {{ 'dashboard' | translate }}
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar
          color="primary"
        >
          <button
            *ngIf="isHandset$ | async"
            mat-button
            type="button"
            (click)="drawer.toggle()"
          >
            {{ 'menu' | translate }}
          </button>
          <span>
            {{ 'appName' | translate }}
          </span>
        </mat-toolbar>
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export class MenuPage {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  constructor(private breakpointObserver: BreakpointObserver) { }
}
