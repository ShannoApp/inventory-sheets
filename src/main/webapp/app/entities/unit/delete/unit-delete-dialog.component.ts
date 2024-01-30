import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IUnit } from '../unit.model';
import { UnitService } from '../service/unit.service';

@Component({
  standalone: true,
  templateUrl: './unit-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class UnitDeleteDialogComponent {
  unit?: IUnit;

  constructor(
    protected unitService: UnitService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.unitService.delete(id).then(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
