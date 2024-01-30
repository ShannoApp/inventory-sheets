import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUnit, NewUnit } from '../unit.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUnit for edit and NewUnitFormGroupInput for create.
 */
type UnitFormGroupInput = IUnit | PartialWithRequiredKeyOf<NewUnit>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IUnit | NewUnit> = Omit<T, 'createdDate' | 'modifiedDate'> & {
  createdDate?: string | null;
  modifiedDate?: string | null;
};

type UnitFormRawValue = FormValueOf<IUnit>;

type NewUnitFormRawValue = FormValueOf<NewUnit>;

type UnitFormDefaults = Pick<NewUnit, 'id' | 'createdDate' | 'modifiedDate'>;

type UnitFormGroupContent = {
  id: FormControl<UnitFormRawValue['id'] | NewUnit['id']>;
  name: FormControl<UnitFormRawValue['name']>;
  description: FormControl<UnitFormRawValue['description']>;
  createdDate: FormControl<UnitFormRawValue['createdDate']>;
  modifiedDate: FormControl<UnitFormRawValue['modifiedDate']>;
};

export type UnitFormGroup = FormGroup<UnitFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UnitFormService {
  createUnitFormGroup(unit: UnitFormGroupInput = { id: null }): UnitFormGroup {
    const unitRawValue = this.convertUnitToUnitRawValue({
      ...this.getFormDefaults(),
      ...unit,
    });
    return new FormGroup<UnitFormGroupContent>({
      id: new FormControl(
        { value: unitRawValue.id, disabled: unitRawValue.id !== null },
        {
          nonNullable: true,
        },
      ),
      name: new FormControl(unitRawValue.name, {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      description: new FormControl(unitRawValue.description),
      createdDate: new FormControl(unitRawValue.createdDate),
      modifiedDate: new FormControl(unitRawValue.modifiedDate),
    });
  }

  getUnit(form: UnitFormGroup): IUnit | NewUnit {
    return this.convertUnitRawValueToUnit(form.getRawValue() as UnitFormRawValue | NewUnitFormRawValue);
  }

  resetForm(form: UnitFormGroup, unit: UnitFormGroupInput): void {
    const unitRawValue = this.convertUnitToUnitRawValue({ ...this.getFormDefaults(), ...unit });
    form.reset(
      {
        ...unitRawValue,
        id: { value: unitRawValue.id, disabled: unitRawValue.id !== null },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UnitFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      modifiedDate: currentTime,
    };
  }

  private convertUnitRawValueToUnit(rawUnit: UnitFormRawValue | NewUnitFormRawValue): IUnit | NewUnit {
    return {
      ...rawUnit,
      createdDate: dayjs(rawUnit.createdDate, DATE_TIME_FORMAT),
      modifiedDate: dayjs(rawUnit.modifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertUnitToUnitRawValue(
    unit: IUnit | (Partial<NewUnit> & UnitFormDefaults),
  ): UnitFormRawValue | PartialWithRequiredKeyOf<NewUnitFormRawValue> {
    return {
      ...unit,
      createdDate: unit.createdDate ? unit.createdDate.format(DATE_TIME_FORMAT) : undefined,
      modifiedDate: unit.modifiedDate ? unit.modifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
