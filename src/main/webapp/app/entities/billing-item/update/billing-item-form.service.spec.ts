import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../billing-item.test-samples';

import { BillingItemFormService } from './billing-item-form.service';

describe('BillingItem Form Service', () => {
  let service: BillingItemFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillingItemFormService);
  });

  describe('Service methods', () => {
    describe('createBillingItemFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBillingItemFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quantity: expect.any(Object),
            unitPrice: expect.any(Object),
            adjustPrice: expect.any(Object),
          }),
        );
      });

      it('passing IBillingItem should create a new form with FormGroup', () => {
        const formGroup = service.createBillingItemFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quantity: expect.any(Object),
            unitPrice: expect.any(Object),
            adjustPrice: expect.any(Object),
          }),
        );
      });
    });

    describe('getBillingItem', () => {
      it('should return NewBillingItem for default BillingItem initial value', () => {
        const formGroup = service.createBillingItemFormGroup(sampleWithNewData);

        const billingItem = service.getBillingItem(formGroup) as any;

        expect(billingItem).toMatchObject(sampleWithNewData);
      });

      it('should return NewBillingItem for empty BillingItem initial value', () => {
        const formGroup = service.createBillingItemFormGroup();

        const billingItem = service.getBillingItem(formGroup) as any;

        expect(billingItem).toMatchObject({});
      });

      it('should return IBillingItem', () => {
        const formGroup = service.createBillingItemFormGroup(sampleWithRequiredData);

        const billingItem = service.getBillingItem(formGroup) as any;

        expect(billingItem).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBillingItem should not enable id FormControl', () => {
        const formGroup = service.createBillingItemFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBillingItem should disable id FormControl', () => {
        const formGroup = service.createBillingItemFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
