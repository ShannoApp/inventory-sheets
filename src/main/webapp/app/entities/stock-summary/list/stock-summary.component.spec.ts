import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StockSummaryService } from '../service/stock-summary.service';

import { StockSummaryComponent } from './stock-summary.component';

describe('StockSummary Management Component', () => {
  let comp: StockSummaryComponent;
  let fixture: ComponentFixture<StockSummaryComponent>;
  let service: StockSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'stock-summary', component: StockSummaryComponent }]),
        HttpClientTestingModule,
        StockSummaryComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(StockSummaryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StockSummaryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StockSummaryService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 'ABC' }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.stockSummaries?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to stockSummaryService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getStockSummaryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getStockSummaryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
