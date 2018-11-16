import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatListModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { Route, RouterModule } from '@angular/router';
import { I18nModule } from '../common/i18n/i18n.module';
import { SharedModule } from '../common/modules/shared.module';
import en from './menu/locales/en.json';
import fr from './menu/locales/fr.json';
import { MenuPage } from './menu/menu.page';

const routes: Route[] = [
  {
    children: [
      {
        loadChildren: './dashboard/dashboard.module#DashboardModule',
        path: 'dashboard',
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
    component: MenuPage,
    path: '',
  },
];

@NgModule({
  declarations: [
    MenuPage,
  ],
  imports: [
    LayoutModule,
    MatButtonModule,
    MatListModule,
    I18nModule.forRoot({
      en,
      fr,
    }),
    MatSidenavModule,
    MatToolbarModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
})
export class FeaturesModule { }
