import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StockSummaryService } from '../service/stock-summary.service';
import { IStockSummary } from '../stock-summary.model';
import { StockSummaryFormService } from './stock-summary-form.service';

import { StockSummaryUpdateComponent } from './stock-summary-update.component';

describe('StockSummary Management Update Component', () => {
  let comp: StockSummaryUpdateComponent;
  let fixture: ComponentFixture<StockSummaryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let stockSummaryFormService: StockSummaryFormService;
  let stockSummaryService: StockSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), StockSummaryUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(StockSummaryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StockSummaryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    stockSummaryFormService = TestBed.inject(StockSummaryFormService);
    stockSummaryService = TestBed.inject(StockSummaryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const stockSummary: IStockSummary = { id: 'CBA' };

      activatedRoute.data = of({ stockSummary });
      comp.ngOnInit();

      expect(comp.stockSummary).toEqual(stockSummary);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStockSummary>>();
      const stockSummary = { id: 'ABC' };
      jest.spyOn(stockSummaryFormService, 'getStockSummary').mockReturnValue(stockSummary);
      jest.spyOn(stockSummaryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stockSummary });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stockSummary }));
      saveSubject.complete();

      // THEN
      expect(stockSummaryFormService.getStockSummary).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(stockSummaryService.update).toHaveBeenCalledWith(expect.objectContaining(stockSummary));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStockSummary>>();
      const stockSummary = { id: 'ABC' };
      jest.spyOn(stockSummaryFormService, 'getStockSummary').mockReturnValue({ id: null });
      jest.spyOn(stockSummaryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stockSummary: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stockSummary }));
      saveSubject.complete();

      // THEN
      expect(stockSummaryFormService.getStockSummary).toHaveBeenCalled();
      expect(stockSummaryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStockSummary>>();
      const stockSummary = { id: 'ABC' };
      jest.spyOn(stockSummaryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stockSummary });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(stockSummaryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
