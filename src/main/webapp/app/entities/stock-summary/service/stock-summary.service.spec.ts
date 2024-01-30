import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IStockSummary } from '../stock-summary.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../stock-summary.test-samples';

import { StockSummaryService, RestStockSummary } from './stock-summary.service';

const requireRestSample: RestStockSummary = {
  ...sampleWithRequiredData,
  lastPurchaseDate: sampleWithRequiredData.lastPurchaseDate?.format(DATE_FORMAT),
  lastSaleDate: sampleWithRequiredData.lastSaleDate?.format(DATE_FORMAT),
};

describe('StockSummary Service', () => {
  let service: StockSummaryService;
  let httpMock: HttpTestingController;
  let expectedResult: IStockSummary | IStockSummary[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StockSummaryService);
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

    it('should create a StockSummary', () => {
      const stockSummary = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(stockSummary).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a StockSummary', () => {
      const stockSummary = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(stockSummary).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a StockSummary', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of StockSummary', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a StockSummary', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addStockSummaryToCollectionIfMissing', () => {
      it('should add a StockSummary to an empty array', () => {
        const stockSummary: IStockSummary = sampleWithRequiredData;
        expectedResult = service.addStockSummaryToCollectionIfMissing([], stockSummary);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stockSummary);
      });

      it('should not add a StockSummary to an array that contains it', () => {
        const stockSummary: IStockSummary = sampleWithRequiredData;
        const stockSummaryCollection: IStockSummary[] = [
          {
            ...stockSummary,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStockSummaryToCollectionIfMissing(stockSummaryCollection, stockSummary);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a StockSummary to an array that doesn't contain it", () => {
        const stockSummary: IStockSummary = sampleWithRequiredData;
        const stockSummaryCollection: IStockSummary[] = [sampleWithPartialData];
        expectedResult = service.addStockSummaryToCollectionIfMissing(stockSummaryCollection, stockSummary);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stockSummary);
      });

      it('should add only unique StockSummary to an array', () => {
        const stockSummaryArray: IStockSummary[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const stockSummaryCollection: IStockSummary[] = [sampleWithRequiredData];
        expectedResult = service.addStockSummaryToCollectionIfMissing(stockSummaryCollection, ...stockSummaryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const stockSummary: IStockSummary = sampleWithRequiredData;
        const stockSummary2: IStockSummary = sampleWithPartialData;
        expectedResult = service.addStockSummaryToCollectionIfMissing([], stockSummary, stockSummary2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stockSummary);
        expect(expectedResult).toContain(stockSummary2);
      });

      it('should accept null and undefined values', () => {
        const stockSummary: IStockSummary = sampleWithRequiredData;
        expectedResult = service.addStockSummaryToCollectionIfMissing([], null, stockSummary, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stockSummary);
      });

      it('should return initial array if no StockSummary is added', () => {
        const stockSummaryCollection: IStockSummary[] = [sampleWithRequiredData];
        expectedResult = service.addStockSummaryToCollectionIfMissing(stockSummaryCollection, undefined, null);
        expect(expectedResult).toEqual(stockSummaryCollection);
      });
    });

    describe('compareStockSummary', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStockSummary(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareStockSummary(entity1, entity2);
        const compareResult2 = service.compareStockSummary(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareStockSummary(entity1, entity2);
        const compareResult2 = service.compareStockSummary(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareStockSummary(entity1, entity2);
        const compareResult2 = service.compareStockSummary(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
