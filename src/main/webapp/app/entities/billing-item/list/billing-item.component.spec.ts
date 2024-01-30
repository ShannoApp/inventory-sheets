import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BillingItemService } from '../service/billing-item.service';

import { BillingItemComponent } from './billing-item.component';

describe('BillingItem Management Component', () => {
  let comp: BillingItemComponent;
  let fixture: ComponentFixture<BillingItemComponent>;
  let service: BillingItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'billing-item', component: BillingItemComponent }]),
        HttpClientTestingModule,
        BillingItemComponent,
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
      .overrideTemplate(BillingItemComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BillingItemComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BillingItemService);

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
    expect(comp.billingItems?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to billingItemService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getBillingItemIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBillingItemIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
