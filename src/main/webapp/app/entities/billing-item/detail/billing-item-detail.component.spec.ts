import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BillingItemDetailComponent } from './billing-item-detail.component';

describe('BillingItem Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingItemDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: BillingItemDetailComponent,
              resolve: { billingItem: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(BillingItemDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load billingItem on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', BillingItemDetailComponent);

      // THEN
      expect(instance.billingItem).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
