import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TlacuServices } from 'src/app/services/index';
import { Product } from 'src/app/models/index';

import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent {

  form: FormGroup;

  product: Product;

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

  @Input() set productValue(value: Product) {
    this.product = value;
    this.nameForm.setValue(value.name);
    this.descriptionForm.setValue(value.description);
    this.quantityInStockForm.setValue(value.quantityInStock);
    this.buyPriceForm.setValue(value.buyPrice);
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

    this.updateProduct();
  }

  updateProduct() {
    const product = new Product({
      name: this.nameForm.value,
      description: this.descriptionForm.value,
      quantityInStock: this.quantityInStockForm.value,
      buyPrice: this.buyPriceForm.value,
      maxCacaoBuyPrice: null,
      fkStore: this.product.fkStore,
      fkCategoryEnum: this.product.fkCategoryEnum
    });

    this.tlacu.product.updateProduct(this.product.idProduct, product).subscribe(response => {
      let result = response;

      if (response.success) {
        result = { success: true, productName: product.name, response };
      }

      this.activeModal.close(result);
    });
  }
}
