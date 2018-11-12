import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DashboardModule } from './dashboard.module';
import { DashboardPage } from './dashboard.page';
import mockAcquisitions from './mocks/acquisition.json';
import mockMonetizations from './mocks/monetization.json';

const start = new Date();
const end = new Date();
start.setDate(start.getDate() - 1);

const initAcquisitionUrl = [
  'http://host:port/acquisition?api_key=acquisitionKey&start=',
  start.toISOString().slice(0, 10),
  '&end=',
  end.toISOString().slice(0, 10),
  '&format=json&columns=cost,country,platform,application',
].join('');

const initMonetizationUrl = [
  'https://cors-anywhere.herokuapp.com/http://host:port/monetization?start=',
  start.toISOString().slice(0, 10),
  '&end=',
  end.toISOString().slice(0, 10),
  '&dimensions=country,os,game&aggregates=revenue',
].join('');

const success = (data: any) => ({
  headers: {
    get: (contentType: string) => contentType === 'content-type'
      ? 'application/json'
      : null,
  },
  json: () => Promise.resolve(data),
  status: 200,
});

const failure = () => ({
  status: 400,
});

describe('Dashboard Page', () => {
  let fixture: ComponentFixture<DashboardPage>;

  beforeAll(async(() => {

    jest.spyOn(window, 'fetch')
      .mockImplementation((url: RequestInfo, params = {}) => {
        const { headers } = params;
        if (url === initAcquisitionUrl) {
          return Promise.resolve(success(mockAcquisitions));
        }

        if (url === initMonetizationUrl
          && headers.Authorization === 'Bearer monetizationKey'
          && headers.Origin === window.location.href
        ) {
          return Promise.resolve(success(mockMonetizations));
        }

        throw new Error('Unknown API call');
      });

    fixture = TestBed
      .configureTestingModule({
        imports: [
          DashboardModule,
          NoopAnimationsModule,
          RouterModule.forRoot([], { useHash: true }),
        ],
      })
      .createComponent(DashboardPage);

    fixture.autoDetectChanges();
  }));

  it('Should be defined', () => expect(fixture).toBeDefined());

  it('Should display a dashboard for range', () => {
    const { componentInstance } = fixture;
    expect(componentInstance.error).toBeUndefined();
    const { detail } = componentInstance;
    if (!detail) {
      throw new Error('No detail');
    }
    expect(detail.acquisitions).toEqual(mockAcquisitions.data);
    expect(detail.monetizations).toEqual(mockMonetizations.data);
    expect(detail.start.toISOString().slice(0, 10)).toEqual(start.toISOString().slice(0, 10));
    expect(detail.end.toISOString().slice(0, 10)).toEqual(end.toISOString().slice(0, 10));
  });

  describe('When I select a new range', () => {
    const end2 = new Date();
    end2.setDate(end.getDate() + 1);

    const refreshAcquisitionUrl = [
      'http://host:port/acquisition?api_key=acquisitionKey&start=',
      start.toISOString().slice(0, 10),
      '&end=',
      end2.toISOString().slice(0, 10),
      '&format=json&columns=cost,country,platform,application',
    ].join('');

    const refereshMonetizationUrl = [
      'https://cors-anywhere.herokuapp.com/http://host:port/monetization?start=',
      start.toISOString().slice(0, 10),
      '&end=',
      end2.toISOString().slice(0, 10),
      '&dimensions=country,os,game&aggregates=revenue',
    ].join('');

    beforeAll(async(() => {
      jest
        .spyOn(window, 'fetch')
        .mockImplementation((url: RequestInfo, params = {}) => {
          const { headers } = params;
          if (url === refreshAcquisitionUrl) {
            return Promise.resolve(success(mockAcquisitions));
          }

          if (url === refereshMonetizationUrl
            && headers.Authorization === 'Bearer monetizationKey'
            && headers.Origin === window.location.href
          ) {
            return Promise.resolve(success(mockMonetizations));
          }

          throw new Error('Unknown API call');
        });
      fixture.componentInstance.refreshDashboard({
        end: end2,
        start,
      });
    }));

    it('Should display a dashboard for range', () => {
      const { componentInstance } = fixture;
      expect(componentInstance.error).toBeUndefined();
      const { detail } = componentInstance;
      if (!detail) {
        throw new Error('No detail');
      }
      expect(detail.acquisitions).toEqual(mockAcquisitions.data);
      expect(detail.monetizations).toEqual(mockMonetizations.data);
      expect(detail.start.toISOString().slice(0, 10)).toEqual(start.toISOString().slice(0, 10));
      expect(detail.end.toISOString().slice(0, 10)).toEqual(end2.toISOString().slice(0, 10));
    });
  });

  describe('When fetch fails', () => {
    beforeAll(async(() => {
      jest
        .spyOn(window, 'fetch')
        .mockImplementation(() => Promise.resolve(failure()));
      fixture.componentInstance.refreshDashboard({
        end,
        start,
      });
    }));

    it('Should display an error', () => {
      const { componentInstance } = fixture;
      expect(componentInstance.error).toEqual({
        status: 400,
      });
      const { detail } = componentInstance;
      expect(detail).toBeUndefined();
    });
  });
});
