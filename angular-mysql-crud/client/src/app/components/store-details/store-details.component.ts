import { Component } from '@angular/core';
import { TlacuServices } from '../../services/index';
import { User, Store, CategoryEnum, StoreReview, Product, Address } from 'src/app/models/index';
import { faEdit, faTrashAlt, faPlusSquare, faMinusSquare } from '@fortawesome/free-regular-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddProductComponent } from 'src/app/components/add-product/add-product.component';
import { EditProductComponent } from 'src/app/components/edit-product/edit-product.component';

@Component({
  selector: 'app-store-details',
  templateUrl: './store-details.component.html',
  styleUrls: ['./store-details.component.css'],
  providers: [NgbModal]
})
export class StoreDetailsComponent {

  // icons
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlusSquare = faPlusSquare;
  faMinusSquare = faMinusSquare;

  // user
  user: User;
  store: Store = new Store();

  // products
  products: Product[] = new Array();
  storeAddress: Address;

  userOwnsStore = false;

  constructor(
    private tlacu: TlacuServices,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.user = this.tlacu.manager.user;
    const idStore = +this.activatedRoute.snapshot.paramMap.get('idStore');
    console.log('Este es el idStore: ' + idStore);

    // get store
    this.getStoreDetails(idStore);

    // get dtore products
    this.getProducts(idStore);
  }

  async getStoreDetails(idStore: number) {
    console.log('Get details');
    const storeRes = await this.tlacu.store.getStore(idStore).toPromise();
    this.store = new Store(storeRes.recordset[0]);
    // set the vendor
    this.setVendor(this.store);
    // set the category
    this.setCategory(this.store);
    // set the reviews and score
    this.setReviewsAndScore(this.store);
    // set the address
  }

  goProduct(idProduct: number) {
    this.router.navigate([`/product/${idProduct}`]);
  }


  // async setStoreAddress(store: Store){
  //  const address = await this.tlacu.address.getAddress(this.store.fkAddress).toPromise;
  //  this.storeAddress = new Address(address)
  // }

  async setVendor(store: Store) {
    const vendorRes = await this.tlacu.user.getUser(store.fkVendor).toPromise();
    store.vendor = new User(vendorRes.recordset);
    this.userOwnsStore = this.user.email === this.store.vendor.email;
  }

  async setCategory(store: Store) {
    const categoryRes = await this.tlacu.categoryEnum.listCategoryEnum(store.fkCategoryEnum, null).toPromise();
    store.categoryEnum = new CategoryEnum(categoryRes.recordset[0]);
  }

  async setReviewsAndScore(store: Store) {
    let score = 0;
    let scoreLenght = 0;
    let storeReviews: StoreReview[] = new Array();
    const reviewRes = await this.tlacu.storeReview.listStoreReview(store.idStore, null).toPromise();
    if (reviewRes.length > 0) {
      reviewRes.recordset.forEach( review => {
        const rev = new StoreReview(review);
        // set user
        this.tlacu.user.getUser(rev.fkUser).subscribe( user => {
          rev.user = new User(user.recordset);
          if (rev.review !== 'null' && rev.review !== 'undefined' && rev.review.length) {
            storeReviews.push(rev);
          }
        });
        // get starts
        if (rev.stars != null && rev.stars > 0 && rev.stars < 6) {
          scoreLenght += 1;
          score += rev.stars;
        }
      });
      store.score = parseFloat((score / scoreLenght).toFixed(1));
      store.scoreLenght = scoreLenght;
      store.storeReviews = storeReviews;
    }
  }

  async getProducts(idStore: number) {
    const productsRes = await this.tlacu.product.listProduct(null, idStore, null).toPromise();
    console.log('idStore dentro de getProducts: ' + idStore);
    if (productsRes.length > 0) {
      console.log(productsRes.length + ' products');
      productsRes.recordset.forEach( product => {
          const prod = new Product(product);
          // set category
          this.setProductCategory(prod);
          // push it into the array
          this.products.push(prod);
      });
      console.log(this.products);
    } else {
      console.log('no products');
    }
  }

  setProductCategory(product: Product) {
    this.tlacu.categoryEnum.listCategoryEnum(product.fkCategoryEnum, null).subscribe( res => {
      const cat = new CategoryEnum(res.recordset[0]);
      product.categoryEnum = cat;
    });

  }

  addProductToCart(product: Product) {
    const added = this.tlacu.manager.addToCart(product);
    if (added) {
      this.tlacu.toastService.show(
        `${product.name} se agregó al carrito.`,
        {
          classname: 'bg-success text-light',
          delay: 5000
        }
      );
    }
  }

  removeProductFromCart(product: Product) {
    const removed = this.tlacu.manager.removeFromCart(product);
    if (removed) {
      this.tlacu.toastService.show(
        `${product.name} se quitó de tu carrito.`,
        {
          classname: 'bg-info text-light',
          delay: 5000
        }
      );
    }
  }

  openEditProductModal(product: Product) {
    const modalRef = this.modalService.open(EditProductComponent);

    modalRef.componentInstance.productValue = product;

    modalRef.result.then(reason => {
      if (reason.success) {
        this.tlacu.toastService.show(
          `${reason.productName} se actualizó.`,
          {
            classname: 'bg-success text-light',
            delay: 5000
          }
        );

        this.products = new Array();
        this.getProducts(this.store.idStore);
      }
    })
    .catch(error => {
      if (error !== 'Close click' && error !== 'Cross click') {
        this.tlacu.toastService.show(
          `Ocurrió un error intentando insertar tu producto.`,
          {
            classname: 'bg-danger text-light',
            delay: 5000
          }
        );
        console.log(error);
      }
    });
  }

  deleteProduct(product: Product) {
    this.tlacu.product.deleteProduct(product.idProduct).subscribe(response => {
      if (response.success) {
        this.tlacu.toastService.show(
          `${product.name} se eliminó de tu tienda.`,
          {
            classname: 'bg-info text-light',
            delay: 5000
          }
        );

        this.products = new Array();
        this.getProducts(this.store.idStore);
      } else {
        this.tlacu.toastService.show(
          `Hubo un error eliminando ${product.name} de tu tienda.`,
          {
            classname: 'bg-danger text-light',
            delay: 5000
          }
        );
      }
    });
  }

  openAddProductModal() {
    const modalRef =  this.modalService.open(AddProductComponent);

    modalRef.componentInstance.store = this.store;

    modalRef.result.then(reason => {
      if (reason.success) {
        this.tlacu.toastService.show(
          `${reason.productName} se agregó a tu tienda.`,
          {
            classname: 'bg-success text-light',
            delay: 5000
          }
        );

        this.products = new Array();
        this.getProducts(this.store.idStore);
      }
    })
    .catch(error => {
      if (error !== 'Close click' && error !== 'Cross click') {
        this.tlacu.toastService.show(
          `Ocurrió un error intentando insertar tu producto.`,
          {
            classname: 'bg-danger text-light',
            delay: 5000
          }
        );
        console.log(error);
      }
    });
  }
}
