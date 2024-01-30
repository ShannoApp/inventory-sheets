import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UnitDetailComponent } from './unit-detail.component';

describe('Unit Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: UnitDetailComponent,
              resolve: { unit: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(UnitDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load unit on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', UnitDetailComponent);

      // THEN
      expect(instance.unit).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
