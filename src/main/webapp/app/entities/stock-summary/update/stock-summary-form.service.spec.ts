import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../stock-summary.test-samples';

import { StockSummaryFormService } from './stock-summary-form.service';

describe('StockSummary Form Service', () => {
  let service: StockSummaryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockSummaryFormService);
  });

  describe('Service methods', () => {
    describe('createStockSummaryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStockSummaryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            currentStockQuantity: expect.any(Object),
            minimumStockQuantity: expect.any(Object),
            maximumStockQuantity: expect.any(Object),
            lastPurchaseDate: expect.any(Object),
            lastPurchaseQuantity: expect.any(Object),
            lastSaleDate: expect.any(Object),
            lastSaleQuantity: expect.any(Object),
          }),
        );
      });

      it('passing IStockSummary should create a new form with FormGroup', () => {
        const formGroup = service.createStockSummaryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            currentStockQuantity: expect.any(Object),
            minimumStockQuantity: expect.any(Object),
            maximumStockQuantity: expect.any(Object),
            lastPurchaseDate: expect.any(Object),
            lastPurchaseQuantity: expect.any(Object),
            lastSaleDate: expect.any(Object),
            lastSaleQuantity: expect.any(Object),
          }),
        );
      });
    });

    describe('getStockSummary', () => {
      it('should return NewStockSummary for default StockSummary initial value', () => {
        const formGroup = service.createStockSummaryFormGroup(sampleWithNewData);

        const stockSummary = service.getStockSummary(formGroup) as any;

        expect(stockSummary).toMatchObject(sampleWithNewData);
      });

      it('should return NewStockSummary for empty StockSummary initial value', () => {
        const formGroup = service.createStockSummaryFormGroup();

        const stockSummary = service.getStockSummary(formGroup) as any;

        expect(stockSummary).toMatchObject({});
      });

      it('should return IStockSummary', () => {
        const formGroup = service.createStockSummaryFormGroup(sampleWithRequiredData);

        const stockSummary = service.getStockSummary(formGroup) as any;

        expect(stockSummary).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStockSummary should not enable id FormControl', () => {
        const formGroup = service.createStockSummaryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStockSummary should disable id FormControl', () => {
        const formGroup = service.createStockSummaryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
