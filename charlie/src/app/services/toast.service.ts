import {Injectable, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr';

@Injectable()
export class ToastService {

  toastr: ToastsManager;
  vcr = null;

  constructor(public newToastr: ToastsManager) {
    this.toastr = newToastr;
  }

  public setViewContrainerRef(vcr: ViewContainerRef) {
    this.vcr = vcr;
  }

  public success() {
    this.toastr.setRootViewContainerRef(this.vcr);
    this.toastr.success('successmessage', 'Success!');
  }

  public error() {
    this.toastr.setRootViewContainerRef(this.vcr);
    this.toastr.error('successmessage', 'Error!');
  }
}
