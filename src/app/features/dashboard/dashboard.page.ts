import { Component, OnInit } from '@angular/core';
import { DashboardDetail, DashboardRange, DashboardService } from './services/dashboard.service';

@Component({
  selector: 'dashboard-page',
  styleUrls: ['./dashboard.page.scss'],
  template: `
    <dashboard-form
      [end]="range.end"
      [start]="range.start"
      (onDate)="this.refreshDashboard($event)"
    >
    </dashboard-form>

    <ng-container *ngIf="!detail && !error">
      <spinner
        class="dashboard-page__spinner"
      >
      </spinner>
    </ng-container>

    <!-- TODO this should work -->
    <ng-container *ngIf="detail loadingModel">
      <dashboard-table
        [detail]="detail"
      >
      </dashboard-table>
    </ng-container>

    <ng-container *ngIf="error">
      <p
        class="dashboard-page__error"
        [innerHTML]="'errorRetrievingData' | translate"
      >
      </p>
    </ng-container>
  `,
})
export class DashboardPage implements OnInit {
  detail: DashboardDetail | undefined;
  range!: DashboardRange;
  error: any;

  constructor(private dashboardService: DashboardService) { }

  async ngOnInit() {
    this.getDasboardDetail(this.range = this.dashboardService.getDashboardRange());
  }

  async refreshDashboard(range: DashboardRange) {
    this.getDasboardDetail(this.range = range);
  }

  private async getDasboardDetail(range: DashboardRange) {
    delete this.detail;
    delete this.error;
    try {
      this.detail = await this.dashboardService.getRealDashboardDetail(range);
    } catch (e) {
      this.error = e;
    }
  }
}
