import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TlacuServices } from 'src/app/services/index';

import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrls: ['./create-store.component.css']
})
export class CreateStoreComponent implements OnInit {

  form: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private tlacu: TlacuServices
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', Validators.required),
      isServiceStore: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
  }

  submit() {}
}
