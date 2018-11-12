import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeAll(async(() => {
    fixture = TestBed
      .configureTestingModule({
        imports: [AppModule],
      })
      .createComponent(AppComponent);

    fixture.autoDetectChanges();
  }));

  it('Should be defined', () => {
    expect(fixture).toBeDefined();
  });
});
