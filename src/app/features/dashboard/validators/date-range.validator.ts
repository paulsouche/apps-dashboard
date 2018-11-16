import { FormGroup, ValidationErrors } from '@angular/forms';

export function dateRangeValidator(startDateKey: string, endDateKey: string) {
  const getErrors = (errors: ValidationErrors) => Object.keys(errors).length > 0 ? errors : null;

  return (group: FormGroup): ValidationErrors | null => {
    const { controls } = group;
    const start = controls[startDateKey];
    const end = controls[endDateKey];
    const startErrors = start.errors || {};
    const endErrors = end.errors || {};

    if (start.value > end.value) {
      const error = {
        invalidDateRange: true,
      };
      start.setErrors({
        ...startErrors,
        ...error,
      });
      end.setErrors({
        ...endErrors,
        ...error,
      });
      end.markAsTouched();
      return error;
    }
    delete startErrors.invalidDateRange;
    delete endErrors.invalidDateRange;
    start.setErrors(getErrors(startErrors));
    end.setErrors(getErrors(endErrors));
    return null;
  };
}
