import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ColDef, NodeChildDetails } from 'ag-grid-community';
import { AcquisitionDto } from '../repositories/acquisition.repository';
import { MonetizationDto } from '../repositories/monetization.repository';
import { DashboardDetail } from '../services/dashboard.service';

export interface DashboardColDef extends ColDef {
  field: string;
}

export interface Dashboard {
  columnDefs: DashboardColDef[];
  rowData: Array<RowGroup | RowData>;
  context: any;
  enableCellExpressions: boolean;
  getNodeChildDetails: (rowItem: RowItem) => NodeChildDetails | null;
  getRowClass: (params: any) => string;
}

export interface RowData {
  [rowCol: string]: number | string | RowData[] | undefined;
  type: string;
  row: string;
}

export interface RowSubGroup extends RowData {
  children: RowData[];
  row: 'expenditure' | 'revenue';
}

export interface RowExpendidureGroup extends RowSubGroup {
  row: 'expenditure';
}

export interface RowRevenueGroup extends RowSubGroup {
  row: 'revenue';
}

export interface RowGroup extends RowData {
  children: [RowExpendidureGroup, RowRevenueGroup];
}

export interface RowItem extends RowData {
  children?: RowSubGroup[] | RowData[];
}

@Injectable()
export class DashboardMapper {
  private expenditureKey: 'expenditure';
  private revenueKey: 'revenue';
  private totalField: string;

  constructor(translate: TranslateService) {
    const {
      expenditure,
      revenue,
      total,
    } = translate.instant([
      'expenditure',
      'revenue',
      'total',
    ]);
    this.expenditureKey = expenditure;
    this.revenueKey = revenue;
    this.totalField = total;
  }

  getDashboard(detail: DashboardDetail): Dashboard {
    const columnStart: DashboardColDef = {
      cellRenderer: 'agGroupCellRenderer',
      field: 'row',
      headerName: '',
      pinned: 'left',
    };

    const totalField = this.totalField;

    const {
      cols,
      rows,
      knownExpenditureApps,
      knownRevenueApps,
    } = this.getTableDimensions(detail);

    const totalRow: RowData = {
      row: totalField,
      type: 'group',
    };

    const totalCol: DashboardColDef = {
      field: totalField,
      headerName: totalField,
    };

    cols
      .forEach(({ field }) => {
        totalRow[field] = `=ctx.sumCol('${field}')`;
        rows
          .forEach((r) => {
            r[field] = `=ctx.sumGroup('${r.row}','${field}')`;
            r.children.forEach((c) => c[field] = `=ctx.sumSubGroup('${r.row}','${c.row}','${field}')`);
          });
      });

    totalRow[totalField] = `=ctx.sumTable()`;
    rows
      .forEach((r) => {
        r[totalField] = `=ctx.sumTableGroup('${r.row}')`;
        r.children.forEach((c) => {
          c[totalField] = `=ctx.sumTableSubGroup('${r.row}','${c.row}')`;
          c.children.forEach((l) => l[totalField] = `=ctx.sumTableRow('${r.row}','${c.row}', '${l.row}')`);
        });
      });

    const context = {
      sumCol: (col: string) => {
        return rows.reduce((p, { row }) => Math.round(p * 100 + context.sumGroup(row, col) * 100) / 100, 0);
      },
      sumGroup: (row: string, col: string) => {
        return Math.round(
          context.sumSubGroup(row, this.revenueKey, col) * 100 -
          context.sumSubGroup(row, this.expenditureKey, col) * 100) / 100;
      },
      sumSubGroup: (group: string, row: 'expenditure' | 'revenue', col: string) => {
        const apps = row === this.expenditureKey
          ? knownExpenditureApps[group]
          : knownRevenueApps[group];

        let amount: number;
        return Object.values(apps)
          // tslint:disable-next-line:no-conditional-assignment
          .reduce((p, n) => (n && (amount = n[col] as number))
            ? Math.round((p * 100 + amount * 100)) / 100
            : p, 0);
      },
      sumTable: () => {
        return rows.reduce((p, { row }) => Math.round(p * 100 + context.sumTableGroup(row) * 100) / 100, 0);
      },
      sumTableGroup: (group: string) => {
        return Math.round(
          context.sumTableSubGroup(group, this.revenueKey) * 100 -
          context.sumTableSubGroup(group, this.expenditureKey) * 100) / 100;
      },
      sumTableRow: (group: string, row: 'expenditure' | 'revenue', app: string) => {
        const line = row === this.expenditureKey
          ? knownExpenditureApps[group][app]
          : knownRevenueApps[group][app];

        return cols.reduce((p, { field }) => {
          if (line) {
            return Math.round(p * 100 + (line[field] as number) * 100) / 100;
          }
          return p;
        }, 0);
      },
      sumTableSubGroup: (group: string, row: 'expenditure' | 'revenue') => {
        const apps = row === this.expenditureKey
          ? knownExpenditureApps[group]
          : knownRevenueApps[group];
        return Object.values(apps)
          .reduce((p, n) => {
            if (n) {
              return Math.round(p * 100 + context.sumTableRow(group, row, n.row) * 100) / 100;
            }
            return p;
          }, 0);
      },
    };

    return {
      columnDefs: [columnStart, ...cols, totalCol],
      context,
      enableCellExpressions: true,
      rowData: [...rows, totalRow],
      getNodeChildDetails({ row, children }: RowItem) {
        if (children) {
          return {
            children,
            expanded: true,
            group: true,
            key: row,
          };
        } else {
          return null;
        }
      },
      getRowClass({ data }: { data: RowData }) {
        return `dashboard-table__${data.type}`;
      },
    };
  }

  private getTableDimensions(detail: DashboardDetail) {
    const [expenditureKey, revenueKey] = [
      this.expenditureKey,
      this.revenueKey,
    ];
    const knownCountries: {
      [countryCode: string]: DashboardColDef | undefined,
    } = {};
    const knownPlatforms: {
      [platformCode: string]: RowGroup | undefined,
    } = {};
    const knownExpenditureApps: {
      [platformCode: string]: {
        [expeditureApp: string]: RowData | undefined,
      },
    } = {};
    const knownRevenueApps: {
      [platformCode: string]: {
        [revenueApp: string]: RowData | undefined,
      },
    } = {};
    const rows: RowGroup[] = [];
    const cols = [...detail.acquisitions, ...detail.monetizations]
      .reduce((p, item) => {
        const isAcquisition = this.isAcquisition(item);
        const {
          amount,
          app,
          country,
          platform,
        } = this.isAcquisition(item)
            ? {
              amount: item.cost,
              app: item.application,
              country: item.country,
              platform: item.platform,
            }
            : {
              amount: item.revenue,
              app: item.game,
              country: item.country,
              platform: item.os,
            };

        if (!knownCountries[country]) {
          p.push(knownCountries[country] = {
            field: country,
            headerName: country,
          });
        }

        let platformRow = knownPlatforms[platform];
        if (!platformRow) {
          knownExpenditureApps[platform] = {};
          knownRevenueApps[platform] = {};
          rows.push(knownPlatforms[platform] = platformRow = {
            children: [
              {
                children: [],
                row: expenditureKey,
                type: 'sub-group',
              },
              {
                children: [],
                row: revenueKey,
                type: 'sub-group',
              },
            ],
            row: platform,
            type: 'group',
          });
        }

        const knownApps = isAcquisition ? knownExpenditureApps[platform] : knownRevenueApps[platform];
        let appRow = knownApps[app];
        if (!appRow) {
          const group = platformRow.children[isAcquisition ? 0 : 1];
          group.children.push(knownApps[app] = appRow = {
            row: app,
            type: 'cell',
          });
        }
        const prev = appRow[country];
        appRow[country] = Math.round(((typeof prev === 'number' ? prev : 0) * 100 + amount * 100)) / 100;

        return p;
      }, [] as DashboardColDef[]);

    return {
      cols,
      knownExpenditureApps,
      knownRevenueApps,
      rows,
    };
  }

  private isAcquisition(item: AcquisitionDto | MonetizationDto): item is AcquisitionDto {
    return !!(item as AcquisitionDto).platform;
  }
}
