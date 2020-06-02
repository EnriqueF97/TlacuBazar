import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TlacuServices } from 'src/app/services/index';

import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import {
  Product,
  Store,
  CategoryEnum
} from 'src/app/models/index';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {

  form: FormGroup;
  categoryArray: CategoryEnum[];

  @Input() store: Store;

  get nameForm() {
    return this.form.get('name');
  }

  get descriptionForm() {
    return this.form.get('description');
  }

  get quantityInStockForm() {
    return this.form.get('quantityInStock');
  }

  get buyPriceForm() {
    return this.form.get('buyPrice');
  }

  constructor(
    public activeModal: NgbActiveModal,
    private tlacu: TlacuServices
  ) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.maxLength(280)),
      quantityInStock: new FormControl('1', [Validators.required, Validators.min(1)]),
      buyPrice: new FormControl('0.0', [Validators.required, Validators.pattern(/^(?!-).*$/)]),
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

    this.createProduct();
  }

  createProduct() {
    const product = new Product({
      name: this.nameForm.value,
      description: this.descriptionForm.value,
      quantityInStock: this.quantityInStockForm.value,
      buyPrice: this.buyPriceForm.value,
      maxCacaoBuyPrice: null,
      fkStore: this.store.idStore,
      fkCategoryEnum: this.store.fkCategoryEnum
    });

    this.tlacu.product.createProduct(product).subscribe(response => {
      let result = response;

      if (response.success) {
        result = { success: true, productName: product.name, response };
      }

      this.activeModal.close(result);
    });
  }
}
