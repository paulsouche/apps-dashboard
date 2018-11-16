import { InjectionToken } from '@angular/core';

export interface Locale {
  [key: string]: Locale | string;
}

export interface LocalesStoreData {
  [localeId: string]: Locale;
}

export const LOCALES_STORE_DATA = new InjectionToken<LocalesStoreData>('localesStoreData');
