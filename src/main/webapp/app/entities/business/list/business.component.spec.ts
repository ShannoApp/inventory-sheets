import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BusinessService } from '../service/business.service';

import { BusinessComponent } from './business.component';

describe('Business Management Component', () => {
  let comp: BusinessComponent;
  let fixture: ComponentFixture<BusinessComponent>;
  let service: BusinessService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'business', component: BusinessComponent }]),
        HttpClientTestingModule,
        BusinessComponent,
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
      .overrideTemplate(BusinessComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BusinessComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BusinessService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
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
    expect(comp.businesses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to businessService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBusinessIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBusinessIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
