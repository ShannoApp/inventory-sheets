import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StockSummaryDetailComponent } from './stock-summary-detail.component';

describe('StockSummary Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockSummaryDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: StockSummaryDetailComponent,
              resolve: { stockSummary: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(StockSummaryDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load stockSummary on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', StockSummaryDetailComponent);

      // THEN
      expect(instance.stockSummary).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
