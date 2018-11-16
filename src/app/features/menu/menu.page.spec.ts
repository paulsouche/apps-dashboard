import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FeaturesModule } from '../features.module';
import { MenuPage } from './menu.page';

describe('Menu Page', () => {
  let fixture: ComponentFixture<MenuPage>;

  beforeAll(async(() => {
    fixture = TestBed
      .configureTestingModule({
        imports: [
          FeaturesModule,
          NoopAnimationsModule,
          RouterModule.forRoot([], { useHash: true }),
        ],
      })
      .createComponent(MenuPage);

    fixture.autoDetectChanges();
  }));

  it('Should be defined', () => {
    expect(fixture).toBeDefined();
  });
});
