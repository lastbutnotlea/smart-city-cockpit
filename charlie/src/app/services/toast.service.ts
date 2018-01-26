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

  public showSuccessToast(successMessage: string) {
    this.toastr.setRootViewContainerRef(this.vcr);
    this.toastr.success(successMessage, 'Success!');
  }

  public showErrorToast(errorMessage: string) {
    this.toastr.setRootViewContainerRef(this.vcr);
    this.toastr.error(errorMessage, 'Error!');
  }

  public showInfoToast(info: string) {
    this.toastr.setRootViewContainerRef(this.vcr);
    this.toastr.info(info);
  }
}
