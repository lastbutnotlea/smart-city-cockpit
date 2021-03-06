import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {TickerData} from '../../../shared/data/ticker-data';
import {Router} from "@angular/router";
import {getUrlForId} from "../../../shared/util/routing-util";
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-ticker-item',
  templateUrl: './ticker-item.component.html',
  styleUrls: ['./ticker-item.component.css'],
})
export class TickerItemComponent {
  @Input()
  data: TickerData;
  @Output()
  onDelete: EventEmitter<TickerData> = new EventEmitter<TickerData>();

  hoverOnCross: boolean = false;

  constructor(private http: HttpRoutingService,
              private router: Router,
              private toastService: ToastService) {
  }

  innerHover(flag: boolean): void {
    this.hoverOnCross = flag;
  }

  deleteItem(): void {
    this.http.deleteTickerItem(this.data).subscribe(
      () => this.onDelete.emit(this.data),
      err => {
        this.toastService.showErrorToast('Failed to delete ticker item ' + this.data.id);
        console.log(JSON.stringify(err));
        });
  }

  goToLink(): void {
    // do NOT route if the user clicked on the X button
    if (!this.hoverOnCross) {
      let link : string = getUrlForId(this.data.item.id);
      if(this.data.item.id.startsWith('Feedback_')){
        this.router.navigate([link], { queryParams: { id: this.data.item.id} } );
      } else {
        this.router.navigate([link]);
      }

    }
  }
}
