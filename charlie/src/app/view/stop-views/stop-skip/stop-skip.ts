import {Component, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {StopData} from '../../../shared/data/stop-data';
import {DateUtil} from '../../../shared/util/date-util';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {SkipData} from '../../../shared/data/skip-data';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-service-request-edit',
  templateUrl: './stop-skip.html',
  styleUrls: ['./stop-skip.css']
})

export class SkipStopComponent {
  data: StopData;

  saveDisabled: boolean = false;

  text: string = "";

  from: Date = new Date();
  to: Date = new Date();

  private callback: (param: StopData) => void;

  constructor(public activeModal: NgbActiveModal,
              public dateParser: DateUtil,
              public http: HttpRoutingService,
              private toastService: ToastService) {
  }

  confirm(): void {
    this.saveDisabled = true;
    let skipData: SkipData = new SkipData();
    skipData.reason = this.text;
    skipData.from = this.from;
    skipData.to = this.to;
    this.http.skipStop(this.data.id, skipData).subscribe(
      data => {
        this.data.skipData.push(data);
        this.toastService.showSuccessToast('Skipped stop ' + this.data.commonName);
        this.activeModal.close('Close click');
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
}
