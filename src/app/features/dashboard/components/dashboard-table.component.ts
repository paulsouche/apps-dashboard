import { Component, Input, OnInit } from '@angular/core';
import { Dashboard, DashboardMapper } from '../mappers/dashboard.mapper';
import { DashboardDetail } from '../services/dashboard.service';

@Component({
  selector: 'dashboard-table',
  styleUrls: ['./dashboard-table.component.scss'],
  template: `
    <ag-grid-angular
      class="ag-theme-balham dashboard-table"
      [columnDefs]="dashboard.columnDefs"
      [context]="dashboard.context"
      [enableCellExpressions]="dashboard.enableCellExpressions"
      [getNodeChildDetails]="dashboard.getNodeChildDetails"
      [getRowClass]="dashboard.getRowClass"
      [rowData]="dashboard.rowData"
    >
    </ag-grid-angular>
  `,
})
export class DashboardTableComponent implements OnInit {
  @Input()
  detail!: DashboardDetail;

  dashboard!: Dashboard;

  constructor(private mapper: DashboardMapper) { }

  ngOnInit() {
    this.dashboard = this.mapper.getDashboard(this.detail);
  }
}
