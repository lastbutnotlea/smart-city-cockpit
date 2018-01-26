import {Injectable, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr';

@Injectable()
export class ToastService {

  toastr: ToastsManager;
  viewContainerReference = null;

  constructor(public newToastr: ToastsManager) {
    this.toastr = newToastr;
  }

  public setViewContrainerRef(viewContainerReference: ViewContainerRef) {
    this.viewContainerReference = viewContainerReference;
  }

  public showSuccessToast(successMessage: string) {
    this.toastr.setRootViewContainerRef(this.viewContainerReference);
    this.toastr.success(successMessage, 'Success!');
  }

  public showErrorToast(errorMessage: string) {
    this.toastr.setRootViewContainerRef(this.viewContainerReference);
    this.toastr.error(errorMessage, 'Error!');
  }

  public showInfoToast(info: string) {
    this.toastr.setRootViewContainerRef(this.viewContainerReference);
    this.toastr.info(info);
  }
}
