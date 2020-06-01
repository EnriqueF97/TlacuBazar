import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {TlacuServices} from '../../services/index';
import { faEdit, faTrashAlt, faPlusSquare, faMinusSquare } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-order-details-modal',
  templateUrl: './order-details-modal.component.html',
  styleUrls: ['./order-details-modal.component.css']
})
export class OrderDetailsModalComponent implements OnInit {

  faPlusSquare = faPlusSquare;
  faMinusSquare = faMinusSquare;

  constructor(public  activeModal: NgbActiveModal, public tlacuServices: TlacuServices) { }

  ngOnInit(): void {
  }

}
