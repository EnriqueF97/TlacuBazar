import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TlacuServices } from 'src/app/services/index';

import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import { Store, User, CategoryEnum } from 'src/app/models';

@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrls: ['./create-store.component.css']
})
export class CreateStoreComponent {

  form: FormGroup;
  @Input() user: User;
  @Input() fkCategory: number;

  get nameForm() {
    return this.form.get('name');
  }

  get descriptionForm() {
    return this.form.get('description');
  }

  get isServiceStoreForm() {
    return this.form.get('isServiceStore');
  }

  constructor(
    public activeModal: NgbActiveModal,
    private tlacu: TlacuServices
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl(''),
      isServiceStore: new FormControl('')
    });
  }

  submit() {
    /* If this.form is valid, all form controls are storable in the database. */
    if (!this.form.valid) {
      this.form.setErrors({
        invalidForm: true
      });
      return;
    }

    this.createStore();
  }

  createStore() {
    const store = new Store({
      name: this.nameForm.value,
      description: this.descriptionForm.value,
      phone: '',
      link: '',
      fkAddress: 1,
      isServiceStore: this.isServiceStoreForm.value === '' ? 0 : 1,
      acceptsCacao: 0,
      fkStatusEnum: 8,
      fkVendor: this.tlacu.manager.user.idUser,
      fkCategoryEnum: 2
    });

    console.log('look at me im fucking empty');
    console.log(store);

    this.tlacu.store.createStore(store).subscribe(response => {
      let result: any = response;

      if (response.success) {
        result = {success: true };
      }

      this.activeModal.close(result);
    });
  }
}
