import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {TickerData} from '../../../shared/data/ticker-data';
import {AppRoutingModule} from '../../../app-routing.module';
import {Router} from "@angular/router";

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

  itemClass: string = 'no-highlight';
  crossClass: string = 'bg-white';

  hoverOnCross: boolean = false;

  constructor(private http: HttpRoutingService, private router: Router) {
  }

  outerHover(flag: boolean): void {
    if (flag) {
      this.itemClass = 'highlight';
    } else {
      this.itemClass = 'no-highlight';
    }
  }

  innerHover(flag: boolean): void {
    this.hoverOnCross = flag;
    if (flag) {
      this.crossClass = '';
    } else {
      this.crossClass = 'bg-white';
    }
  }

  deleteItem(): void {
    this.http.deleteTickerItem(this.data).subscribe(
      data => this.onDelete.emit(this.data),
      err => console.log(JSON.stringify(err)));
  }

  goToLink(): void {
    if (!this.hoverOnCross) {
      let link : string = AppRoutingModule.getUrlForId(this.data.item.id);
      this.router.navigate([link]);
    }
  }
}
