import { Component, TemplateRef } from '@angular/core';
import { TlacuServices } from '../../services/index';

@Component({
  selector: 'app-toasts-container',
  templateUrl: './toasts-container.component.html',
  styleUrls: ['./toasts-container.component.css'],
  host: {'[class.ngb-toasts]': 'true'}
})
export class ToastsContainerComponent {

  constructor(public tlacu: TlacuServices) { }

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }

}
