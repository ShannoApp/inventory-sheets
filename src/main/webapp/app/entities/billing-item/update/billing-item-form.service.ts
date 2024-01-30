import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBillingItem, NewBillingItem } from '../billing-item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBillingItem for edit and NewBillingItemFormGroupInput for create.
 */
type BillingItemFormGroupInput = IBillingItem | PartialWithRequiredKeyOf<NewBillingItem>;

type BillingItemFormDefaults = Pick<NewBillingItem, 'id'>;

type BillingItemFormGroupContent = {
  id: FormControl<IBillingItem['id'] | NewBillingItem['id']>;
  quantity: FormControl<IBillingItem['quantity']>;
  unitPrice: FormControl<IBillingItem['unitPrice']>;
  adjustPrice: FormControl<IBillingItem['adjustPrice']>;
};

export type BillingItemFormGroup = FormGroup<BillingItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BillingItemFormService {
  createBillingItemFormGroup(billingItem: BillingItemFormGroupInput = { id: null }): BillingItemFormGroup {
    const billingItemRawValue = {
      ...this.getFormDefaults(),
      ...billingItem,
    };
    return new FormGroup<BillingItemFormGroupContent>({
      id: new FormControl(
        { value: billingItemRawValue.id, disabled: billingItemRawValue.id !== null },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      quantity: new FormControl(billingItemRawValue.quantity, {
        validators: [Validators.required, Validators.min(1)],
      }),
      unitPrice: new FormControl(billingItemRawValue.unitPrice, {
        validators: [Validators.required, Validators.min(0)],
      }),
      adjustPrice: new FormControl(billingItemRawValue.adjustPrice, {
        validators: [Validators.required, Validators.min(0)],
      }),
    });
  }

  getBillingItem(form: BillingItemFormGroup): IBillingItem | NewBillingItem {
    return form.getRawValue() as IBillingItem | NewBillingItem;
  }

  resetForm(form: BillingItemFormGroup, billingItem: BillingItemFormGroupInput): void {
    const billingItemRawValue = { ...this.getFormDefaults(), ...billingItem };
    form.reset(
      {
        ...billingItemRawValue,
        id: { value: billingItemRawValue.id, disabled: billingItemRawValue.id !== null },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BillingItemFormDefaults {
    return {
      id: null,
    };
  }
}
