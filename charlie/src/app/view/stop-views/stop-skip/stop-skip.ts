import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {StopData} from '../../../shared/data/stop-data';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {SkipData} from '../../../shared/data/skip-data';
import {ToastService} from '../../../services/toast.service';
import {DateUtil} from "../../../shared/util/date-util";

@Component({
  selector: 'app-service-request-edit',
  templateUrl: './stop-skip.html',
  styleUrls: ['./stop-skip.css']
})

export class SkipStopComponent implements OnDestroy{
  data: StopData;

  saveDisabled: boolean = false;

  text: string = "";

  from: Date = new Date();
  to: Date = new Date();

  @Output() closeEvent = new EventEmitter<boolean>();

  constructor(public activeModal: NgbActiveModal,
              public http: HttpRoutingService,
              private toastService: ToastService) {
  }

  ngOnDestroy(): void {
    this.closeEvent.emit(true);
  }

  confirm(): void {
    this.saveDisabled = true;
    let skipData: SkipData = new SkipData();
    skipData.reason = this.text;
    skipData.from = DateUtil.cutTimezoneInformation(this.from);
    skipData.to = DateUtil.cutTimezoneInformation(this.to);
    this.http.skipStop(this.data.id, skipData).subscribe(
      data => {
        this.data.skipData.push(data);
        this.toastService.showSuccessToast('Skipped stop ' + this.data.commonName);
        this.activeModal.close('Close click');
        this.callback(this.data);
      },
      err => {
        this.toastService.showErrorToast('Failed to skip stop ' + this.data.commonName);
        console.log(JSON.stringify(err));
        this.saveDisabled = false;
      }
    );
  }

  isSaveEnabled() {
    return this.text !== '' && !this.saveDisabled;
  }

  /**
   * allows to do something on "confirm"
   * @param {(param: StopData) => void} callback whatever you want to do
   */
  public onAdd(callback: (param: StopData) => void) {
    this.callback = callback;
  }
}
