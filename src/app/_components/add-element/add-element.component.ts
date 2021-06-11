import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomValidators } from '../../_helpers/custom-validators';

import { Friend } from "../../_models/friend";
@Component({
  selector: 'app-add-element',
  templateUrl: './add-element.component.html',
  styleUrls: ['./add-element.component.scss']
})
export class AddElementComponent implements OnInit {

  addForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddElementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Friend,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: ['', [Validators.required, CustomValidators.numbers, CustomValidators.fixedSize(10)]],
      birthday: ['', [Validators.required, CustomValidators.date]],
      city: ['', Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
