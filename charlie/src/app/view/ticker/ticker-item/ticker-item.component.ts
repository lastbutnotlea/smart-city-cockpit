import {Component, Input, OnInit} from '@angular/core';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {TickerData} from '../../../shared/data/ticker-data';
import {AppRoutingModule} from '../../../app-routing.module';

@Component({
  selector: 'app-ticker-item',
  templateUrl: './ticker-item.component.html',
  styleUrls: ['./ticker-item.component.css']
})
export class TickerItemComponent implements OnInit {
  @Input()
  data: TickerData;
  link: string;

  constructor(private http: HttpRoutingService) {
  }

  ngOnInit() {
    this.link = AppRoutingModule.getUrlForId(this.data.item.id);
  }

  deleteItem(): void {
    this.http.deleteTickerItem(this.data).subscribe(
      data => {
      },
      err => alert(JSON.stringify(err)));
  }
}