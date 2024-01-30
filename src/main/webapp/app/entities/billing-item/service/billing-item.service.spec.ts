import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBillingItem } from '../billing-item.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../billing-item.test-samples';

import { BillingItemService } from './billing-item.service';

const requireRestSample: IBillingItem = {
  ...sampleWithRequiredData,
};

describe('BillingItem Service', () => {
  let service: BillingItemService;
  let httpMock: HttpTestingController;
  let expectedResult: IBillingItem | IBillingItem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BillingItemService);
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

    it('should create a BillingItem', () => {
      const billingItem = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(billingItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BillingItem', () => {
      const billingItem = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(billingItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BillingItem', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BillingItem', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BillingItem', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBillingItemToCollectionIfMissing', () => {
      it('should add a BillingItem to an empty array', () => {
        const billingItem: IBillingItem = sampleWithRequiredData;
        expectedResult = service.addBillingItemToCollectionIfMissing([], billingItem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(billingItem);
      });

      it('should not add a BillingItem to an array that contains it', () => {
        const billingItem: IBillingItem = sampleWithRequiredData;
        const billingItemCollection: IBillingItem[] = [
          {
            ...billingItem,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBillingItemToCollectionIfMissing(billingItemCollection, billingItem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BillingItem to an array that doesn't contain it", () => {
        const billingItem: IBillingItem = sampleWithRequiredData;
        const billingItemCollection: IBillingItem[] = [sampleWithPartialData];
        expectedResult = service.addBillingItemToCollectionIfMissing(billingItemCollection, billingItem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(billingItem);
      });

      it('should add only unique BillingItem to an array', () => {
        const billingItemArray: IBillingItem[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const billingItemCollection: IBillingItem[] = [sampleWithRequiredData];
        expectedResult = service.addBillingItemToCollectionIfMissing(billingItemCollection, ...billingItemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const billingItem: IBillingItem = sampleWithRequiredData;
        const billingItem2: IBillingItem = sampleWithPartialData;
        expectedResult = service.addBillingItemToCollectionIfMissing([], billingItem, billingItem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(billingItem);
        expect(expectedResult).toContain(billingItem2);
      });

      it('should accept null and undefined values', () => {
        const billingItem: IBillingItem = sampleWithRequiredData;
        expectedResult = service.addBillingItemToCollectionIfMissing([], null, billingItem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(billingItem);
      });

      it('should return initial array if no BillingItem is added', () => {
        const billingItemCollection: IBillingItem[] = [sampleWithRequiredData];
        expectedResult = service.addBillingItemToCollectionIfMissing(billingItemCollection, undefined, null);
        expect(expectedResult).toEqual(billingItemCollection);
      });
    });

    describe('compareBillingItem', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBillingItem(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareBillingItem(entity1, entity2);
        const compareResult2 = service.compareBillingItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareBillingItem(entity1, entity2);
        const compareResult2 = service.compareBillingItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareBillingItem(entity1, entity2);
        const compareResult2 = service.compareBillingItem(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
