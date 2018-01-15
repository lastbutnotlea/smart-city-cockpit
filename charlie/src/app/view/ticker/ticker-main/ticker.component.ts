import {Component, OnInit} from '@angular/core';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {TickerData} from '../../../shared/data/ticker-data';
import {LiveDataComponent} from '../../../shared/components/live-data/live-data.component';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css',
    '../../../shared/styling/global-styling.css',]
})
export class TickerComponent extends LiveDataComponent implements OnInit {
  items: TickerData[] = [];

  constructor(private http: HttpRoutingService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  refreshData(): void {
    this.setDataSubscription(
      this.http.getTickerItems().subscribe(data => {
          this.items = data;
          this.subscribeToData();
        },
        err => alert(JSON.stringify(err))
      ));
  }
}
