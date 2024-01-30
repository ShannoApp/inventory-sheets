import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IStockSummary, NewStockSummary } from '../stock-summary.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStockSummary for edit and NewStockSummaryFormGroupInput for create.
 */
type StockSummaryFormGroupInput = IStockSummary | PartialWithRequiredKeyOf<NewStockSummary>;

type StockSummaryFormDefaults = Pick<NewStockSummary, 'id'>;

export type StockSummaryFormGroupContent = {
  id: FormControl<IStockSummary['id'] | NewStockSummary['id']>;
  currentStockQuantity: FormControl<IStockSummary['currentStockQuantity']>;
  minimumStockQuantity: FormControl<IStockSummary['minimumStockQuantity']>;
  maximumStockQuantity: FormControl<IStockSummary['maximumStockQuantity']>;
  lastPurchaseDate: FormControl<IStockSummary['lastPurchaseDate']>;
  lastPurchaseQuantity: FormControl<IStockSummary['lastPurchaseQuantity']>;
  lastSaleDate: FormControl<IStockSummary['lastSaleDate']>;
  lastSaleQuantity: FormControl<IStockSummary['lastSaleQuantity']>;
};

export type StockSummaryFormGroup = FormGroup<StockSummaryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StockSummaryFormService {
  createStockSummaryFormGroup(stockSummary: StockSummaryFormGroupInput = { id: null }): StockSummaryFormGroup {
    const stockSummaryRawValue = {
      ...this.getFormDefaults(),
      ...stockSummary,
    };
    return new FormGroup<StockSummaryFormGroupContent>({
      id: new FormControl(
        { value: stockSummaryRawValue.id, disabled: stockSummaryRawValue.id !== null },
        {
          nonNullable: true,
        },
      ),
      currentStockQuantity: new FormControl(stockSummaryRawValue.currentStockQuantity, {
        validators: [Validators.min(0)],
      }),
      minimumStockQuantity: new FormControl(stockSummaryRawValue.minimumStockQuantity, {
        validators: [Validators.min(0)],
      }),
      maximumStockQuantity: new FormControl(stockSummaryRawValue.maximumStockQuantity, {
        validators: [Validators.min(0)],
      }),
      lastPurchaseDate: new FormControl(stockSummaryRawValue.lastPurchaseDate),
      lastPurchaseQuantity: new FormControl(stockSummaryRawValue.lastPurchaseQuantity, {
        validators: [Validators.min(0)],
      }),
      lastSaleDate: new FormControl(stockSummaryRawValue.lastSaleDate),
      lastSaleQuantity: new FormControl(stockSummaryRawValue.lastSaleQuantity, {
        validators: [Validators.min(0)],
      }),
    });
  }

  getStockSummary(form: StockSummaryFormGroup): IStockSummary | NewStockSummary {
    return form.getRawValue() as IStockSummary | NewStockSummary;
  }

  resetForm(form: StockSummaryFormGroup, stockSummary: StockSummaryFormGroupInput): void {
    const stockSummaryRawValue = { ...this.getFormDefaults(), ...stockSummary };
    form.reset(
      {
        ...stockSummaryRawValue,
        id: { value: stockSummaryRawValue.id, disabled: stockSummaryRawValue.id !== null },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): StockSummaryFormDefaults {
    return {
      id: null,
    };
  }
}
