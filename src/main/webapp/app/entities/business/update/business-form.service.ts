import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IBusiness, NewBusiness } from '../business.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBusiness for edit and NewBusinessFormGroupInput for create.
 */
type BusinessFormGroupInput = IBusiness | PartialWithRequiredKeyOf<NewBusiness>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IBusiness | NewBusiness> = Omit<T, 'createdDate' | 'modifiedDate'> & {
  createdDate?: string | null;
  modifiedDate?: string | null;
};

type BusinessFormRawValue = FormValueOf<IBusiness>;

type NewBusinessFormRawValue = FormValueOf<NewBusiness>;

type BusinessFormDefaults = Pick<NewBusiness, 'id' | 'isDeflaut' | 'createdDate' | 'modifiedDate'>;

type BusinessFormGroupContent = {
  id: FormControl<BusinessFormRawValue['id'] | NewBusiness['id']>;
  name: FormControl<BusinessFormRawValue['name']>;
  website: FormControl<BusinessFormRawValue['website']>;
  email: FormControl<BusinessFormRawValue['email']>;
  isDeflaut: FormControl<BusinessFormRawValue['isDeflaut']>;
  phone: FormControl<BusinessFormRawValue['phone']>;
  createdDate: FormControl<BusinessFormRawValue['createdDate']>;
  modifiedDate: FormControl<BusinessFormRawValue['modifiedDate']>;
};

export type BusinessFormGroup = FormGroup<BusinessFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BusinessFormService {
  createBusinessFormGroup(business: BusinessFormGroupInput = { id: null }): BusinessFormGroup {
    const businessRawValue = this.convertBusinessToBusinessRawValue({
      ...this.getFormDefaults(),
      ...business,
    });
    return new FormGroup<BusinessFormGroupContent>({
      id: new FormControl(
        { value: businessRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(businessRawValue.name, {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      website: new FormControl(businessRawValue.website),
      email: new FormControl(businessRawValue.email),
      isDeflaut: new FormControl(businessRawValue.isDeflaut),
      phone: new FormControl(businessRawValue.phone),
      createdDate: new FormControl(businessRawValue.createdDate),
      modifiedDate: new FormControl(businessRawValue.modifiedDate),
    });
  }

  getBusiness(form: BusinessFormGroup): IBusiness | NewBusiness {
    return this.convertBusinessRawValueToBusiness(form.getRawValue() as BusinessFormRawValue | NewBusinessFormRawValue);
  }

  resetForm(form: BusinessFormGroup, business: BusinessFormGroupInput): void {
    const businessRawValue = this.convertBusinessToBusinessRawValue({ ...this.getFormDefaults(), ...business });
    form.reset(
      {
        ...businessRawValue,
        id: { value: businessRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BusinessFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      isDeflaut: false,
      createdDate: currentTime,
      modifiedDate: currentTime,
    };
  }

  private convertBusinessRawValueToBusiness(rawBusiness: BusinessFormRawValue | NewBusinessFormRawValue): IBusiness | NewBusiness {
    return {
      ...rawBusiness,
      createdDate: dayjs(rawBusiness.createdDate, DATE_TIME_FORMAT),
      modifiedDate: dayjs(rawBusiness.modifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertBusinessToBusinessRawValue(
    business: IBusiness | (Partial<NewBusiness> & BusinessFormDefaults),
  ): BusinessFormRawValue | PartialWithRequiredKeyOf<NewBusinessFormRawValue> {
    return {
      ...business,
      createdDate: business.createdDate ? business.createdDate.format(DATE_TIME_FORMAT) : undefined,
      modifiedDate: business.modifiedDate ? business.modifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
