import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IInvoice, NewInvoice } from '../invoice.model';
import dayjs from 'dayjs/esm';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInvoice for edit and NewInvoiceFormGroupInput for create.
 */
type InvoiceFormGroupInput = IInvoice | PartialWithRequiredKeyOf<NewInvoice>;

type InvoiceFormDefaults = Pick<NewInvoice, 'id'>;

type InvoiceFormGroupContent = {
  id: FormControl<IInvoice['id'] | NewInvoice['id']>;
  invoiceNumber: FormControl<IInvoice['invoiceNumber']>;
  issueDate: FormControl<IInvoice['issueDate']>;
  dueDate: FormControl<IInvoice['dueDate']>;
  amount: FormControl<IInvoice['amount']>;
  tax: FormControl<IInvoice['tax']>;
  discount: FormControl<IInvoice['discount']>;
  shippingCharges: FormControl<IInvoice['shippingCharges']>;
  customerId: FormControl<IInvoice['customerId']>;
  totalAmount: FormControl<IInvoice['totalAmount']>;
  customerName: FormControl<IInvoice['customerName']>;
};

export type InvoiceFormGroup = FormGroup<InvoiceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InvoiceFormService {
  createInvoiceFormGroup(invoice: InvoiceFormGroupInput = { id: null }): InvoiceFormGroup {
    const invoiceRawValue = {
      ...this.getFormDefaults(),
      ...invoice,
    };
    return new FormGroup<InvoiceFormGroupContent>({
      id: new FormControl(
        { value: invoiceRawValue.id, disabled: invoiceRawValue.id !== null },
        {
          nonNullable: true,
        },
      ),
      invoiceNumber: new FormControl(invoiceRawValue.invoiceNumber, {
        validators: [Validators.minLength(1)],
      }),
      issueDate: new FormControl(invoiceRawValue.issueDate??dayjs(), {
        validators: [Validators.required],
      }),
      dueDate: new FormControl(invoiceRawValue.dueDate??dayjs().add(7, 'day'), {
        validators: [Validators.required],
      }),
      amount: new FormControl(invoiceRawValue.amount, {
        validators: [Validators.required, Validators.min(0)],
      }),
      tax: new FormControl(invoiceRawValue.tax, {
      }),
      discount: new FormControl(invoiceRawValue.discount, {
      }),
      shippingCharges: new FormControl(invoiceRawValue.shippingCharges, {
      }),
      customerId: new FormControl(invoiceRawValue.customerId),
      totalAmount: new FormControl(invoiceRawValue.totalAmount, {
        // validators: [Validators.required, Validators.min(0)],
      }),
      customerName: new FormControl("customerName"),
    });
  }

  getInvoice(form: InvoiceFormGroup): IInvoice | NewInvoice {
    return form.getRawValue() as IInvoice | NewInvoice;
  }

  resetForm(form: InvoiceFormGroup, invoice: InvoiceFormGroupInput): void {
    const invoiceRawValue = { ...this.getFormDefaults(), ...invoice };
    form.reset(
      {
        ...invoiceRawValue,
        id: { value: invoiceRawValue.id, disabled: invoiceRawValue.id !== null },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InvoiceFormDefaults {
    return {
      id: null,
    };
  }
}
