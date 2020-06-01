import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User, UserAddress, Product } from '../models';
import {
  AuthService,
  SocialUser,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angularx-social-login';


@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  user: User;
  socialUser: SocialUser;
  userAddress: UserAddress[];
  updateUserAddress = new Subject<number>();
  cart: any[];

  get cartLength() {
    let length = 0;

    this.cart.forEach(p => {
      length += p.count;
    });

    return length;
  }

  get cartTotalBuyPrice(){
    let totalBuyPrice = 0;
    this.cart.forEach(p => {
      totalBuyPrice += p.totalBuyPrice;
    });
    return totalBuyPrice;
  }

  constructor() {
    this.cart = Array();
    this.getTokenItems();
  }

  setItems(socialUser: SocialUser, user: User) {
    this.user = new User(user);
    this.socialUser = socialUser;
    localStorage.setItem('tlacu-user', JSON.stringify(user));
    localStorage.setItem('tlacu-social-user', JSON.stringify(socialUser));
  }

  setuserAddresses(userAddresses: UserAddress[]) {
    this.userAddress = userAddresses;
  }

  unsetItems() {
      this.user = null;
      this.socialUser = null;
      localStorage.setItem('tlacu-user', null);
      localStorage.setItem('tlacu-social-user', null);
  }

  getTokenItems() {
    try {
        this.user = JSON.parse(localStorage.getItem('tlacu-user'));
        this.socialUser = JSON.parse(localStorage.getItem('tlacu-social-user'));
        if (this.socialUser as any === 'null' || this.user as any === 'null') {
            this.unsetItems();
        }
    } catch {
        this.unsetItems();
    }
  }

  addToCart(product: Product): boolean {
    let productTemp = null;

    for (const cartProduct of this.cart) {
      if (cartProduct.cartProductId === product.idProduct) {
        productTemp = cartProduct;
        break;
      }
    }

    if (!productTemp) {
      productTemp = {
        cartProductId: product.idProduct,
        product,
        count: 0,
        totalBuyPrice: 0,
        totalMaxCacaoBuyPrice: 0
      };

      this.cart.push(productTemp);
    }

    productTemp.count++;
    productTemp.totalBuyPrice += product.buyPrice;
    productTemp.totalMaxCacaoBuyPrice += product.maxCacaoBuyPrice;

    return true;
  }

  removeFromCart(product: Product): boolean {
    let productTemp = null;

    for (const cartProduct of this.cart) {
      if (cartProduct.cartProductId === product.idProduct) {
        productTemp = cartProduct;
        break;
      }
    }

    if (!productTemp) {
      return false;
    } else if (productTemp.count === 1) {
      this.cart = this.cart.filter(p => p.cartProductId !== productTemp.cartProductId);
    }

    productTemp.count--;
    productTemp.totalBuyPrice -= product.buyPrice;
    productTemp.totalMaxCacaoBuyPrice -= product.maxCacaoBuyPrice;

    return true;
  }
}
