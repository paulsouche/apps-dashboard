import { Inject, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DateAdapter,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
} from '@angular/material';
import { Route, RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { I18nModule } from '../../common/i18n/i18n.module';
import { SharedModule } from '../../common/modules/shared.module';
import { SpinnerModule } from '../../common/modules/spinner.module';
import { DashboardFormComponent } from './components/dashboard-form.component';
import { DashboardTableComponent } from './components/dashboard-table.component';
import { DashboardPage } from './dashboard.page';
import { voodooConfigFactory } from './factories/voodoo-config.factory';
import en from './locales/en.json';
import fr from './locales/fr.json';
import { DashboardMapper } from './mappers/dashboard.mapper';
import { AcquisitionRepository } from './repositories/acquisition.repository';
import { MonetizationRepository } from './repositories/monetization.repository';
import { DashboardService } from './services/dashboard.service';
import { VOODOO_CONFIG } from './tokens/voodoo-config.token';

const routes: Route[] = [
  {
    component: DashboardPage,
    path: '',
  },
];

@NgModule({
  declarations: [
    DashboardFormComponent,
    DashboardTableComponent,
    DashboardPage,
  ],
  imports: [
    AgGridModule.withComponents([]),
    FormsModule,
    I18nModule.forRoot({
      en,
      fr,
    }),
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SpinnerModule,
    SharedModule,
  ],
  providers: [
    DashboardMapper,
    DashboardService,
    AcquisitionRepository,
    MonetizationRepository,
    {
      provide: VOODOO_CONFIG,
      useFactory: voodooConfigFactory,
    },
  ],
})
export class DashboardModule {
  constructor(adapter: DateAdapter<Date>, @Inject(LOCALE_ID) localeId: string) {
    adapter.setLocale(localeId);
  }
}
