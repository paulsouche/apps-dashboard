import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import { Inject, LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PLATFORM_NAVIGATOR, SantechPlatformModule } from '@santech/angular-platform';
import { localeIdFactory } from './factories/locale-id.factory';
import { LOCALES_STORE_DATA, LocalesStoreData } from './locales-store-data.token';

@NgModule({
  exports: [
    TranslateModule,
  ],
  imports: [
    SantechPlatformModule.forRoot(),
    TranslateModule.forRoot(),
  ],
  providers: [
    {
      deps: [PLATFORM_NAVIGATOR],
      provide: LOCALE_ID,
      useFactory: localeIdFactory,
    },
  ],
})
export class I18nModule {
  public static forRoot(data: LocalesStoreData): ModuleWithProviders {
    return {
      ngModule: I18nModule,
      providers: [
        {
          provide: LOCALES_STORE_DATA,
          useValue: data,
        },
      ],
    };
  }

  constructor(
    translate: TranslateService,
    @Inject(LOCALE_ID) localeId: string,
    @Inject(LOCALES_STORE_DATA) data: LocalesStoreData,
  ) {
    Object.keys(data)
      .forEach((lang) => translate.setTranslation(lang, data[lang]));
    translate.setDefaultLang('en');
    translate.use(localeId);
    switch (localeId) {
      case 'fr':
        registerLocaleData(localeFr);
        break;
      default:
        registerLocaleData(localeEn);
        break;
    }
  }
}
