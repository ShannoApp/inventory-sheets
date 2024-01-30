import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PaymentDetailComponent } from './payment-detail.component';

describe('Payment Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PaymentDetailComponent,
              resolve: { payment: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PaymentDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load payment on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PaymentDetailComponent);

      // THEN
      expect(instance.payment).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
