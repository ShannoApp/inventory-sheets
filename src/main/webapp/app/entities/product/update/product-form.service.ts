import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IProduct, NewProduct } from '../product.model';
import { StockSummaryFormGroupContent, StockSummaryFormService } from 'app/entities/stock-summary/update/stock-summary-form.service';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProduct for edit and NewProductFormGroupInput for create.
 */
type ProductFormGroupInput = IProduct | PartialWithRequiredKeyOf<NewProduct>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IProduct | NewProduct> = Omit<T, 'createdDate' | 'modifiedDate'> & {
  createdDate?: string | null;
  modifiedDate?: string | null;
};

type ProductFormRawValue = FormValueOf<IProduct>;

type NewProductFormRawValue = FormValueOf<NewProduct>;

type ProductFormDefaults = Pick<NewProduct, 'id' | 'createdDate' | 'modifiedDate'>;

type ProductFormGroupContent = {
  id: FormControl<ProductFormRawValue['id']>;
  name: FormControl<ProductFormRawValue['name']>;
  description: FormControl<ProductFormRawValue['description']>;
  unit: FormControl<ProductFormRawValue['unit']>;
  sellingPrice: FormControl<ProductFormRawValue['sellingPrice']>;
  purchasePrice: FormControl<ProductFormRawValue['purchasePrice']>;
  minStockToMaintain: FormControl<ProductFormRawValue['minStockToMaintain']>;
  openingQuantity: FormControl<ProductFormRawValue['openingQuantity']>;
  asOfDate: FormControl<ProductFormRawValue['asOfDate']>;
  location: FormControl<ProductFormRawValue['location']>;
  createdDate: FormControl<ProductFormRawValue['createdDate']>;
  modifiedDate: FormControl<ProductFormRawValue['modifiedDate']>;
  category: FormControl<ProductFormRawValue['category']>;
  stockSummary: FormGroup<StockSummaryFormGroupContent>;
};


export type ProductFormGroup = FormGroup<ProductFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductFormService {

  constructor(protected stockSummaryFormService: StockSummaryFormService) {}
  
  createProductFormGroup(product: ProductFormGroupInput = { id: null }): ProductFormGroup {
    const productRawValue = this.convertProductToProductRawValue({
      ...this.getFormDefaults(),
      ...product,
    });
    return new FormGroup<ProductFormGroupContent>({
      id: new FormControl(
        { value: productRawValue.id, disabled: productRawValue.id !== null },
        {
          nonNullable: true,
        },
      ),
      name: new FormControl(productRawValue.name, {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      description: new FormControl(productRawValue.description),
      unit: new FormControl(productRawValue.unit),
      sellingPrice: new FormControl(productRawValue.sellingPrice, {
        validators: [Validators.required, Validators.min(0)],
      }),
      purchasePrice: new FormControl(productRawValue.purchasePrice, {
        validators: [Validators.required, Validators.min(0)],
      }),
      minStockToMaintain: new FormControl(productRawValue.minStockToMaintain, {
        validators: [Validators.min(0)],
      }),
      openingQuantity: new FormControl(productRawValue.openingQuantity, {
        validators: [ Validators.min(0)],
      }),
      asOfDate: new FormControl(productRawValue.asOfDate, {
        validators: [],
      }),
      location: new FormControl(productRawValue.location),
      createdDate: new FormControl(productRawValue.createdDate),
      modifiedDate: new FormControl(productRawValue.modifiedDate),
      category: new FormControl(productRawValue.category, {
        validators: [Validators.required],
      }),
      stockSummary: this.stockSummaryFormService.createStockSummaryFormGroup(),
    });
  }

  getProduct(form: ProductFormGroup): IProduct | NewProduct {
    return this.convertProductRawValueToProduct(form.getRawValue() as ProductFormRawValue | NewProductFormRawValue);
  }

  resetForm(form: ProductFormGroup, product: ProductFormGroupInput): void {
    const productRawValue = this.convertProductToProductRawValue({ ...this.getFormDefaults(), ...product });
    form.reset(
      {
        ...productRawValue,
        id: { value: productRawValue.id, disabled: productRawValue.id !== null },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProductFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      modifiedDate: currentTime,
    };
  }

  private convertProductRawValueToProduct(rawProduct: ProductFormRawValue | NewProductFormRawValue): IProduct | NewProduct {
    return {
      ...rawProduct,
      createdDate: dayjs(rawProduct.createdDate, DATE_TIME_FORMAT),
      modifiedDate: dayjs(rawProduct.modifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertProductToProductRawValue(
    product: IProduct | (Partial<NewProduct> & ProductFormDefaults),
  ): ProductFormRawValue | PartialWithRequiredKeyOf<NewProductFormRawValue> {
    return {
      ...product,
      createdDate: product.createdDate ? product.createdDate.format(DATE_TIME_FORMAT) : undefined,
      modifiedDate: product.modifiedDate ? product.modifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
