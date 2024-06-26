import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export function preventPreviousValuesValidator(previousValues: { categoryId: any, ageBandId: any, benfitsId: any }): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!(control instanceof FormGroup)) {
      throw new Error('Validator must be used on a FormGroup.');
    }
    const formGroup = control as FormGroup;
    const categoryId = formGroup.get('categoryId')?.value;
    const ageBandId = formGroup.get('ageBandId')?.value;
    const benfitsId = formGroup.get('benfitsId')?.value;

    const isSame = categoryId === previousValues.categoryId && ageBandId === previousValues.ageBandId && benfitsId === previousValues.benfitsId;

    return isSame ? { 'preventPreviousValues': true } : null;
  };
}