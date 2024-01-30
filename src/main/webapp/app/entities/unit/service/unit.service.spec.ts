import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUnit } from '../unit.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../unit.test-samples';

import { UnitService, RestUnit } from './unit.service';

const requireRestSample: RestUnit = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  modifiedDate: sampleWithRequiredData.modifiedDate?.toJSON(),
};

describe('Unit Service', () => {
  let service: UnitService;
  let httpMock: HttpTestingController;
  let expectedResult: IUnit | IUnit[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UnitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Unit', () => {
      const unit = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(unit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Unit', () => {
      const unit = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(unit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Unit', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Unit', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Unit', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUnitToCollectionIfMissing', () => {
      it('should add a Unit to an empty array', () => {
        const unit: IUnit = sampleWithRequiredData;
        expectedResult = service.addUnitToCollectionIfMissing([], unit);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(unit);
      });

      it('should not add a Unit to an array that contains it', () => {
        const unit: IUnit = sampleWithRequiredData;
        const unitCollection: IUnit[] = [
          {
            ...unit,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUnitToCollectionIfMissing(unitCollection, unit);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Unit to an array that doesn't contain it", () => {
        const unit: IUnit = sampleWithRequiredData;
        const unitCollection: IUnit[] = [sampleWithPartialData];
        expectedResult = service.addUnitToCollectionIfMissing(unitCollection, unit);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(unit);
      });

      it('should add only unique Unit to an array', () => {
        const unitArray: IUnit[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const unitCollection: IUnit[] = [sampleWithRequiredData];
        expectedResult = service.addUnitToCollectionIfMissing(unitCollection, ...unitArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const unit: IUnit = sampleWithRequiredData;
        const unit2: IUnit = sampleWithPartialData;
        expectedResult = service.addUnitToCollectionIfMissing([], unit, unit2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(unit);
        expect(expectedResult).toContain(unit2);
      });

      it('should accept null and undefined values', () => {
        const unit: IUnit = sampleWithRequiredData;
        expectedResult = service.addUnitToCollectionIfMissing([], null, unit, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(unit);
      });

      it('should return initial array if no Unit is added', () => {
        const unitCollection: IUnit[] = [sampleWithRequiredData];
        expectedResult = service.addUnitToCollectionIfMissing(unitCollection, undefined, null);
        expect(expectedResult).toEqual(unitCollection);
      });
    });

    describe('compareUnit', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUnit(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareUnit(entity1, entity2);
        const compareResult2 = service.compareUnit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareUnit(entity1, entity2);
        const compareResult2 = service.compareUnit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareUnit(entity1, entity2);
        const compareResult2 = service.compareUnit(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
