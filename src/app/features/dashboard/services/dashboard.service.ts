import { Injectable } from '@angular/core';
// import mockAcquisitions from '../mocks/acquisition.json';
// import mockMonetizations from '../mocks/monetization.json';
import { AcquisitionDto, AcquisitionRange, AcquisitionRepository } from '../repositories/acquisition.repository';
import { MonetizationDto, MonetizationRange, MonetizationRepository } from '../repositories/monetization.repository';

export interface DashboardRange {
  end: Date;
  start: Date;
}

export type DtoRange = AcquisitionRange & MonetizationRange;

// tslint:disable-next-line:no-empty-interface
export interface DashboardDetail extends DashboardRange {
  acquisitions: AcquisitionDto[];
  monetizations: MonetizationDto[];
}

@Injectable()
export class DashboardService {

  constructor(private acquisitionRepo: AcquisitionRepository, private monetizationRepo: MonetizationRepository) { }

  getDashboardRange(): DashboardRange {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 1);

    return {
      end,
      start,
    };
  }

  // async getMockDashboardDetail(range: DashboardRange): Promise<DashboardDetail> {
  //   const [{ data: acquisitions }, { data: monetizations }] = await Promise.all([
  //     Promise.resolve(mockAcquisitions),
  //     Promise.resolve(mockMonetizations),
  //   ]);

  //   return {
  //     ...range,
  //     acquisitions,
  //     monetizations,
  //   };
  // }

  async getRealDashboardDetail(range: DashboardRange): Promise<DashboardDetail> {
    const apiRange = this.toApiRangeBecauseIsoStringWasTooEasy(range);

    const [{ data: acquisitions }, { data: monetizations }] = await Promise.all([
      this.acquisitionRepo.getAcquisitions(apiRange),
      this.monetizationRepo.getMonetizationss(apiRange),
    ]);

    return {
      ...range,
      acquisitions,
      monetizations,
    };
  }

  private toApiRangeBecauseIsoStringWasTooEasy({ start, end }: DashboardRange): DtoRange {
    return {
      end: `${end.toISOString().slice(0, 10)}`,
      start: `${start.toISOString().slice(0, 10)}`,
    };
  }
}
