import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BillingItemService } from '../service/billing-item.service';
import { IBillingItem } from '../billing-item.model';
import { BillingItemFormService } from './billing-item-form.service';

import { BillingItemUpdateComponent } from './billing-item-update.component';

describe('BillingItem Management Update Component', () => {
  let comp: BillingItemUpdateComponent;
  let fixture: ComponentFixture<BillingItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let billingItemFormService: BillingItemFormService;
  let billingItemService: BillingItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), BillingItemUpdateComponent],
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
      .overrideTemplate(BillingItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BillingItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    billingItemFormService = TestBed.inject(BillingItemFormService);
    billingItemService = TestBed.inject(BillingItemService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const billingItem: IBillingItem = { id: 'CBA' };

      activatedRoute.data = of({ billingItem });
      comp.ngOnInit();

      expect(comp.billingItem).toEqual(billingItem);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBillingItem>>();
      const billingItem = { id: 'ABC' };
      jest.spyOn(billingItemFormService, 'getBillingItem').mockReturnValue(billingItem);
      jest.spyOn(billingItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ billingItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: billingItem }));
      saveSubject.complete();

      // THEN
      expect(billingItemFormService.getBillingItem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(billingItemService.update).toHaveBeenCalledWith(expect.objectContaining(billingItem));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBillingItem>>();
      const billingItem = { id: 'ABC' };
      jest.spyOn(billingItemFormService, 'getBillingItem').mockReturnValue({ id: null });
      jest.spyOn(billingItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ billingItem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: billingItem }));
      saveSubject.complete();

      // THEN
      expect(billingItemFormService.getBillingItem).toHaveBeenCalled();
      expect(billingItemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBillingItem>>();
      const billingItem = { id: 'ABC' };
      jest.spyOn(billingItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ billingItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(billingItemService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
