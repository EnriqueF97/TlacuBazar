import { Component, OnInit } from '@angular/core';
import { TlacuServices } from '../../services/index';
import { FormControl } from '@angular/forms';
import {Router} from '@angular/router';
import {
  Store,
  Address,
  UserAddress,
  AddressEnum,
  StateEnum,
  CityEnum,
  SuburbEnum
} from 'src/app/models/index';
import { faEdit, faTrashAlt, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateAddressComponent } from '../create-address/create-address.component';
import { CreateStoreComponent } from '../create-store/create-store.component';

/* angularx-social-login Componentes */
import {
  AuthService,
  SocialUser,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angularx-social-login';
import { User } from 'src/app/models/User';

/* formulario-reactivo */
import {
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class ProfileComponent implements OnInit {
  // icons
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPaperPlane = faPaperPlane;

  // form
  form: FormGroup;
  // data
  user: User;
  socialUser: SocialUser;
  stores: Store[];
  userAddresses: UserAddress[];

  // address
  selectedState;
  selectedCity;
  selectedSuburb;
  stateArray: StateEnum[];
  cityArray: CityEnum[];
  suburbArray: SuburbEnum[];
  cp: number;

  // collapsable phone input
  isCollapsed = true;

  modalIsOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private tlacu: TlacuServices,
    private modalService: NgbModal,
    private router: Router
  ) {
    // init vars
    this.user = this.tlacu.manager.user;
    console.log(this.user.phone);
    console.log(typeof this.user.phone);
    this.socialUser = this.tlacu.manager.socialUser;
    this.stores = new Array();
    this.userAddresses = new Array();
    this.selectedState = null;
    this.selectedCity = null;
    this.selectedSuburb = null;
    this.stateArray = new Array();
    this.cityArray = new Array();
    this.suburbArray = new Array();
    this.cp = null;
    this.getStates();
    this.getCities();

    // get data
    this.getStoresByUser();
    this.getUserAddresses();
  }

  ngOnInit(): void {}

  async getStoresByUser() {
    const storesRes = await this.tlacu.store.listStore(null, null, null, this.tlacu.manager.user.idUser, null).toPromise();
    if (storesRes.length <= 0) { return; }
    const storesTemp: Store[] = Array();
    storesRes.recordset.forEach(store => {
      storesTemp.push(store);
    });
    this.stores = storesTemp;
  }

  // -------------- ADDRESS ------------------
  async getUserAddresses() {
    console.log('get direcciones prof');
    const addressesTemp: UserAddress[] = new Array();
    const userAddressesRes = await this.tlacu.userAddress.listUserAddress(this.user.idUser).toPromise();
    if (userAddressesRes.length > 0 ) {
      userAddressesRes.recordset.forEach( userAddress => {
        const userAdd = new UserAddress(userAddress);
        // set the address
        this.setAddress(userAdd);
        // push the address to temporary array
        addressesTemp.push(userAdd);
      });
      this.userAddresses = addressesTemp; // set addresses array console.log(this.userAddresses);
    }
  }

  setAddress(userAddress: UserAddress) {
    this.tlacu.address.getAddress(userAddress.fkAddress).subscribe( res => {
      // set the address
      userAddress.address = new Address(res.recordset[0]);

      // set the address enum
      this.setAddressEnum(userAddress.address);

      // set the state enum //userAddress.address.stateEnum = res
      this.setStateEnum(userAddress.address);

      // set the city enum  //userAddress.address.cityEnum = res
      this.setCityEnum(userAddress.address);

      // set the suburb enum //userAddress.address.suburbEnum = res
      this.setSuburbEnum(userAddress.address);
    }, err => {console.log(err); });
  }

  setAddressEnum(address: Address) {
    this.tlacu.addressEnum.getAddressEnum(address.fkAddressEnum).subscribe( res => {
      address.addressEnum = new AddressEnum(res.recordset[0]);
    });
  }

  setStateEnum(address: Address) {
    this.tlacu.stateEnum.getStateEnum(address.fkStateEnum).subscribe( res => {
      address.stateEnum = new StateEnum(res.recordset[0]);
    });
  }

  setCityEnum(address: Address) {
    this.tlacu.cityEnum.getCityEnum(address.fkCityEnum).subscribe( res => {
      address.cityEnum = new CityEnum(res.recordset[0]);
    });
  }

  setSuburbEnum(address: Address) {
    this.tlacu.suburbEnum.getSuburbEnum(address.fkSuburbEnum).subscribe( res => {
      address.suburbEnum = new SuburbEnum(res.recordset[0]);
    });
  }

  getStates() {
    this.tlacu.stateEnum.listStateEnum().subscribe( res => {
      this.stateArray.push(new StateEnum(res.recordset[0]));
      this.selectedState = this.stateArray[0].idStateEnum;
    });
  }

  getCities() {
    this.cp = null;
    this.tlacu.cityEnum.listCityEnum().subscribe( res => {
      if (res.length > 0) {
        res.recordset.forEach(city => {
          const c = new CityEnum(city);
          this.cityArray.push(c);
        });
      }
    });
  }

  getSuburbs(idCityEnum: number ) {
    console.log('get suburbs');
    console.log(idCityEnum);
    let suburbArrayTemp: SuburbEnum[] = new Array();
    this.tlacu.suburbEnum.listSuburbEnum(null, null, null, idCityEnum).subscribe( res => {
      console.log(res);
      if (res.length > 0) {
        res.recordset.forEach(suburb => {
          const s = new SuburbEnum(suburb);
          suburbArrayTemp.push(s);
        });
      }
    });

    this.suburbArray = suburbArrayTemp;
  }

  getCp() {
    this.tlacu.suburbEnum.getSuburbEnum(this.selectedSuburb).subscribe(res => {
      const sub = new SuburbEnum(res.recordset[0]);
      this.cp = sub.postalCode;
    });
  }

  /**
   * Deletes an user address and tries to update the view list
   * containing them.
   * @param userAddress the UserAddress object to be deteled.
   */
  public deleteUserAddress(userAddress: UserAddress) {
    if (
      this.tlacu.manager.user.fkAddress != null &&
      this.tlacu.manager.user.fkAddress === userAddress.fkAddress
    ) {
      this.tlacu.manager.user.fkAddress = null;
    }

    this.tlacu.userAddress
    .deleteUserAddress(userAddress.fkAddress, userAddress.fkUser)
    .subscribe(
      response => {
        this.userAddresses = new Array();
        this.getUserAddresses();
        this.tlacu.manager.updateUserAddress.next(1);

        this.tlacu.toastService.show(
          'Se borró una dirección.',
          {
            classname: 'bg-info text-light',
            delay: 5000
          }
        );
      },
      error => {
        console.error(error);
      }
    );
  }

  /* -------------- BUTTONS ------------------ */
  deleteStore(idStore: number) {
    this.tlacu.store.deleteStore(idStore).subscribe(
      response => {
        if (response.success) {
          this.tlacu.toastService.show('Exito al borrar la tienda', {className: 'bg-success text-light', delay: 5000});
        } else {
          this.tlacu.toastService.show('Error al cambiar el numero', {className: 'bg-danger text-light', delay: 5000});
        }
      }
    );
  }

  editStore(idStore: number) {
    this.router.navigate([`/store/${idStore}`]);
  }

  addPhone(newPhone: string) {

    console.log('newPhone: ' + newPhone);
    let tempUser = this.tlacu.manager.user;
    const user: User = new User({
      firstName: tempUser.firstName,
      lastName: tempUser.lastName,
      idUser: tempUser.idUser,
      email: tempUser.email,
      isVendor: tempUser.isVendor,
      phone: newPhone,
      cacaoBalance: tempUser.cacaoBalance,
      readUserCourse: false,
      readVendorCourse: false,
      fkAddress: tempUser.fkAddress
    });
    this.tlacu.user.updateUser(user.idUser, user)
    .subscribe(
      response => {
        if (response.success) {
          this.tlacu.manager.user = user;
          this.tlacu.manager.setItems(this.socialUser, user);
          this.tlacu.toastService.show('Exito al cambiar el numero', {className: 'bg-success text-light', delay: 5000});
        } else {
          this.tlacu.toastService.show('Error al cambiar el numero', {className: 'bg-danger text-light', delay: 5000});
        }
      }
    )
  }

  /* create store modal */
  openCreateStore() {
    this.modalService.open(CreateStoreComponent, {size: 'sm'});
  }

  /**
   * Returns an NgbModalRef, which contains a promise in its
   * .result attribute, which is solver when the NgbModalRef closes.
   *
   * Get all the new user addresses after closing.
   */
  openCreateAddressModal() {
    this.modalService.open(CreateAddressComponent)
    .result
    .then(() => {
      console.log('ProfileComponent: Address creation was completed, updating addresses.');
      this.userAddresses = new Array();
      this.getUserAddresses();
      this.tlacu.manager.updateUserAddress.next(1);

      this.tlacu.toastService.show(
        'Se creó tu nueva dirección.',
        {
          classname: 'bg-success text-light',
          delay: 5000
        }
      );
    });
  }
}
