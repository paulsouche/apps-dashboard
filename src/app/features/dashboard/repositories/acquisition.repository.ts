import { Inject, Injectable } from '@angular/core';
import { PLATFORM_FETCH } from '@santech/angular-platform';
import { VOODOO_CONFIG } from '../tokens/voodoo-config.token';

export interface AcquisitionRange {
  start: string;
  end: string;
}

export interface AcquisitionDto {
  cost: number;
  country: string;
  platform: string;
  application: string;
}

@Injectable()
export class AcquisitionRepository {
  private endPoint: string;
  private key: string;
  private doRequest: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;

  constructor(@Inject(VOODOO_CONFIG) config: VoodooConfig, @Inject(PLATFORM_FETCH) client: typeof fetch) {
    const { acquisitionKey, endPoint } = config;
    if (!acquisitionKey || !endPoint) {
      throw new Error('AcquisitionRepository: project not configured ! See Readme.md for more details');
    }
    this.endPoint = endPoint;
    this.key = acquisitionKey;
    this.doRequest = (input: RequestInfo, init?: RequestInit) => client(input, init);
  }

  public async getAcquisitions(range: AcquisitionRange): Promise<{ data: AcquisitionDto[] }> {
    const response = await this.doRequest(`${this.endPoint}/acquisition?${this.getQueryParams(range)}`);
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

  private getQueryParams({ start, end }: AcquisitionRange) {
    return [
      `api_key=${this.key}`,
      `start=${start}`,
      `end=${end}`,
      `format=json`,
      `columns=${[
        'cost',
        'country',
        'platform',
        'application',
      ].join()}`,
    ].join('&');
  }
}
