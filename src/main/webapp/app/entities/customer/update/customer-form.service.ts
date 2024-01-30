import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICustomer, NewCustomer } from '../customer.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICustomer for edit and NewCustomerFormGroupInput for create.
 */
type CustomerFormGroupInput = ICustomer | PartialWithRequiredKeyOf<NewCustomer>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICustomer | NewCustomer> = Omit<T, 'createdDate' | 'modifiedDate'> & {
  createdDate?: string | null;
  modifiedDate?: string | null;
};

type CustomerFormRawValue = FormValueOf<ICustomer>;

type NewCustomerFormRawValue = FormValueOf<NewCustomer>;

type CustomerFormDefaults = Pick<NewCustomer, 'id' | 'createdDate' | 'modifiedDate'>;

type CustomerFormGroupContent = {
  id: FormControl<CustomerFormRawValue['id'] | NewCustomer['id']>;
  firstName: FormControl<CustomerFormRawValue['firstName']>;
  lastName: FormControl<CustomerFormRawValue['lastName']>;
  email: FormControl<CustomerFormRawValue['email']>;
  phone: FormControl<CustomerFormRawValue['phone']>;
  address: FormControl<CustomerFormRawValue['address']>;
  createdDate: FormControl<CustomerFormRawValue['createdDate']>;
  modifiedDate: FormControl<CustomerFormRawValue['modifiedDate']>;
};

export type CustomerFormGroup = FormGroup<CustomerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CustomerFormService {
  createCustomerFormGroup(customer: CustomerFormGroupInput = { id: null }): CustomerFormGroup {
    const customerRawValue = this.convertCustomerToCustomerRawValue({
      ...this.getFormDefaults(),
      ...customer,
    });
    return new FormGroup<CustomerFormGroupContent>({
      id: new FormControl(
        { value: customerRawValue.id, disabled: customerRawValue.id !== null },
        {
          nonNullable: true,
        },
      ),
      firstName: new FormControl(customerRawValue.firstName, {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      lastName: new FormControl(customerRawValue.lastName, {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      email: new FormControl(customerRawValue.email),
      phone: new FormControl(customerRawValue.phone, {
        validators: [Validators.required],
      }),
      address: new FormControl(customerRawValue.address),
      createdDate: new FormControl(customerRawValue.createdDate),
      modifiedDate: new FormControl(customerRawValue.modifiedDate),
    });
  }

  getCustomer(form: CustomerFormGroup): ICustomer | NewCustomer {
    return this.convertCustomerRawValueToCustomer(form.getRawValue() as CustomerFormRawValue | NewCustomerFormRawValue);
  }

  resetForm(form: CustomerFormGroup, customer: CustomerFormGroupInput): void {
    const customerRawValue = this.convertCustomerToCustomerRawValue({ ...this.getFormDefaults(), ...customer });
    form.reset(
      {
        ...customerRawValue,
        id: { value: customerRawValue.id, disabled: customerRawValue.id !== null },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CustomerFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      modifiedDate: currentTime,
    };
  }

  private convertCustomerRawValueToCustomer(rawCustomer: CustomerFormRawValue | NewCustomerFormRawValue): ICustomer | NewCustomer {
    return {
      ...rawCustomer,
      createdDate: dayjs(rawCustomer.createdDate, DATE_TIME_FORMAT),
      modifiedDate: dayjs(rawCustomer.modifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertCustomerToCustomerRawValue(
    customer: ICustomer | (Partial<NewCustomer> & CustomerFormDefaults),
  ): CustomerFormRawValue | PartialWithRequiredKeyOf<NewCustomerFormRawValue> {
    return {
      ...customer,
      createdDate: customer.createdDate ? customer.createdDate.format(DATE_TIME_FORMAT) : undefined,
      modifiedDate: customer.modifiedDate ? customer.modifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
