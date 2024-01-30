import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUnit } from '../unit.model';
import { UnitService } from '../service/unit.service';
import { UnitFormService, UnitFormGroup } from './unit-form.service';

@Component({
  standalone: true,
  selector: 'jhi-unit-update',
  templateUrl: './unit-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UnitUpdateComponent implements OnInit {
  isSaving = false;
  unit: IUnit | null = null;

  editForm: UnitFormGroup = this.unitFormService.createUnitFormGroup();

  constructor(
    protected unitService: UnitService,
    protected unitFormService: UnitFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ unit }) => {
      this.unit = unit;
      if (unit) {
        this.updateForm(unit);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const unit = this.unitFormService.getUnit(this.editForm);
    if (unit.id !== null) {
      this.subscribeToSaveResponse(this.unitService.update(unit));
    } else {
      this.subscribeToSaveResponse(this.unitService.create(unit));
    }
  }

  protected subscribeToSaveResponse(result: Promise<any>): void {
    result.then(
      () => {this.onSaveSuccess();this.onSaveFinalize();},
      () => {this.onSaveError();this.onSaveFinalize();},
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(unit: IUnit): void {
    this.unit = unit;
    this.unitFormService.resetForm(this.editForm, unit);
  }
}
