import { Inject, Injectable } from '@angular/core';
import { PLATFORM_FETCH, PLATFORM_LOCATION } from '@santech/angular-platform';
import { VOODOO_CONFIG } from '../tokens/voodoo-config.token';

export interface MonetizationRange {
  start: string;
  end: string;
}

export interface MonetizationDto {
  country: string;
  os: string;
  game: string;
  revenue: number;
}

@Injectable()
export class MonetizationRepository {
  private endPoint: string;
  private key: string;
  private doRequest: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;

  constructor(
    @Inject(VOODOO_CONFIG) config: VoodooConfig,
    @Inject(PLATFORM_FETCH) client: typeof fetch,
    @Inject(PLATFORM_LOCATION) private location: Location,
  ) {
    const { monetizationKey, endPoint } = config;
    if (!monetizationKey || !endPoint) {
      throw new Error('MonetizationRepository: project not configured ! See Readme.md for more details');
    }
    this.endPoint = endPoint;
    this.key = monetizationKey;
    this.doRequest = (input: RequestInfo, init?: RequestInit) => client(input, init);
  }

  public async getMonetizationss(range: MonetizationRange): Promise<{ data: MonetizationDto[] }> {
    const response = await this
      .doRequest(`https://cors-anywhere.herokuapp.com/${this.endPoint}/monetization?${this.getQueryParams(range)}`, {
        headers: {
          Authorization: `Bearer ${this.key}`,
          Origin: this.location.href,
        },
      });
    const { headers, status } = response;
    if (status >= 300) {
      throw response;
    }

    switch (headers.get('content-type')) {
      case 'application/json':
        return response.json();
      default:
        throw response;
    }
  }

  private getQueryParams({ start, end }: MonetizationRange) {
    return [
      `start=${start}`,
      `end=${end}`,
      `dimensions=${[
        'country',
        'os',
        'game',
      ].join()}`,
      `aggregates=${[
        'revenue',
      ].join()}`,
    ].join('&');
  }
}
