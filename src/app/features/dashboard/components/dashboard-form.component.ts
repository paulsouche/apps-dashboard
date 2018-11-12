import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInput } from '@angular/material';
import { debounceTime } from 'rxjs/operators';
import { DashboardRange } from '../services/dashboard.service';
import { dateRangeValidator } from '../validators/date-range.validator';

@Component({
  selector: 'dashboard-form',
  styleUrls: ['./dashboard-form.component.scss'],
  template: `
    <form
      [formGroup]="formGroup"
    >
      <mat-form-field
        class="dashboard-form__container"
      >
        <input matInput
          formControlName="start"
          [matDatepicker]="dateStart"
          [placeholder]="'dateStart' | translate"
        >
        <mat-datepicker-toggle matSuffix
          [for]="dateStart"
        >
        </mat-datepicker-toggle>
        <mat-datepicker #dateStart>
        </mat-datepicker>
        <mat-error
          *ngIf="startErrors?.required && !startErrors?.matDatepickerParse"
        >
          {{'requiredField' | translate}}
        </mat-error>
        <mat-error
          *ngIf="startErrors?.matDatepickerParse"
        >
          {{'invalidDate' | translate:startErrors?.matDatepickerParse}}
        </mat-error>
      </mat-form-field>

      <mat-form-field
        class="dashboard-form__container"
      >
        <input matInput
          formControlName="end"
          [matDatepicker]="dateEnd"
          [placeholder]="'dateEnd' | translate"
        >
        <mat-datepicker-toggle matSuffix
          [for]="dateEnd"
        >
        </mat-datepicker-toggle>
        <mat-datepicker #dateEnd>
        </mat-datepicker>
        <mat-error
          *ngIf="endErrors?.required && !endErrors?.matDatepickerParse"
        >
          {{'requiredField' | translate}}
        </mat-error>
        <mat-error
          *ngIf="endErrors?.matDatepickerParse"
        >
          {{'invalidDate' | translate:endErrors?.matDatepickerParse}}
        </mat-error>
      </mat-form-field>
      <span
        *ngIf="formErrors?.invalidDateRange"
        class="dashboard-form__feedback"
      >
        {{'invalidDateRange' | translate}}
      </span>
    </form>
  `,
})
export class DashboardFormComponent implements OnInit, AfterViewInit {
  @Input()
  start: Date | undefined;

  @Input()
  end: Date | undefined;

  @Output()
  onDate = new EventEmitter<DashboardRange>();

  @ViewChildren(MatDatepickerInput)
  datepickers!: QueryList<MatDatepickerInput<Date>>;

  formGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  get startErrors() {
    return this.formGroup.controls.start.errors;
  }

  get endErrors() {
    return this.formGroup.controls.end.errors;
  }

  get formErrors() {
    return this.formGroup.errors;
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      end: [this.end, Validators.required],
      start: [this.start, Validators.required],
    }, {
        validator: dateRangeValidator('start', 'end'),
      });
  }

  ngAfterViewInit() {
    const formGroup = this.formGroup;
    this.datepickers.forEach((dp) => dp.dateInput
      .pipe(debounceTime(500))
      .subscribe(() => {
        if (formGroup.valid) {
          this.onDate.emit(formGroup.value);
        }
      }));
  }
}
