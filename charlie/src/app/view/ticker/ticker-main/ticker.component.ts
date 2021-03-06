import {Component, OnInit} from '@angular/core';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {TickerData} from '../../../shared/data/ticker-data';
import {LiveDataComponent} from '../../../shared/components/live-data/live-data.component';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css']
})
export class TickerComponent extends LiveDataComponent implements OnInit {
  items: TickerData[] = [];

  constructor(private http: HttpRoutingService,
              private toastService: ToastService) {
    super();
  }

  ngOnInit() {
    super.subscribeToData();
  }

  refreshData(): void {
    this.http.getTickerItems().subscribe(data => {
        this.items = data;
      },
      err => {
        this.toastService.showLastingErrorToast('Failed to load ticker items');
        console.log(JSON.stringify(err));
    });
  }

  removeItem(item: TickerData): void {
    // from https://stackoverflow.com/a/15295806/2448440
    let idx = this.items.indexOf(item);
    if (idx > -1) {
      this.items.splice(idx, 1);
    }
  }
}
