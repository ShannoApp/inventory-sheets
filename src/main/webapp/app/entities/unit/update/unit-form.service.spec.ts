import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../unit.test-samples';

import { UnitFormService } from './unit-form.service';

describe('Unit Form Service', () => {
  let service: UnitFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitFormService);
  });

  describe('Service methods', () => {
    describe('createUnitFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUnitFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            createdDate: expect.any(Object),
            modifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing IUnit should create a new form with FormGroup', () => {
        const formGroup = service.createUnitFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            createdDate: expect.any(Object),
            modifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getUnit', () => {
      it('should return NewUnit for default Unit initial value', () => {
        const formGroup = service.createUnitFormGroup(sampleWithNewData);

        const unit = service.getUnit(formGroup) as any;

        expect(unit).toMatchObject(sampleWithNewData);
      });

      it('should return NewUnit for empty Unit initial value', () => {
        const formGroup = service.createUnitFormGroup();

        const unit = service.getUnit(formGroup) as any;

        expect(unit).toMatchObject({});
      });

      it('should return IUnit', () => {
        const formGroup = service.createUnitFormGroup(sampleWithRequiredData);

        const unit = service.getUnit(formGroup) as any;

        expect(unit).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUnit should not enable id FormControl', () => {
        const formGroup = service.createUnitFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUnit should disable id FormControl', () => {
        const formGroup = service.createUnitFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
