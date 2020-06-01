import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {TlacuServices} from '../../services/index';

@Component({
  selector: 'app-order-details-modal',
  templateUrl: './order-details-modal.component.html',
  styleUrls: ['./order-details-modal.component.css']
})
export class OrderDetailsModalComponent implements OnInit {

  constructor(public  activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
