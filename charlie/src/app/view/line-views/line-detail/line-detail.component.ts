import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {LiveDataComponent} from '../../../shared/components/live-data/live-data.component';
import {LinePositionData} from '../../../shared/data/line-position-data';
import {LineData} from '../../../shared/data/line-data';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-line-detail-view',
  templateUrl: './line-detail.component.html',
  styleUrls: ['./line-detail.component.css']
})

export class LineDetailComponent extends LiveDataComponent implements OnInit {

  loaded: boolean = false;
  line: LineData;
  inboundPositionData: LinePositionData = new LinePositionData();
  outboundPositionData: LinePositionData = new LinePositionData();

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location,
              private toastService: ToastService) {
    super();
  }

  ngOnInit(): void {
    super.subscribeToData()
  }

  getLine(): void {
    const lineId = this.route.snapshot.paramMap.get('id');
    this.http.getLineDetails(lineId).subscribe(
      line => {
        this.line = line;
        this.loaded = true;
      },
          err => {
        this.toastService.showLastingErrorToast('Failed to load details of line ' + lineId);
        console.log(JSON.stringify(err));
      });
    this.getPositionData(lineId);
  }

  goBack(): void {
    this.location.back();
  }

  getPositionData(id: string): void {
    this.http.getVehiclePositionInboundData(id).subscribe(
      data => {
        this.inboundPositionData = data;
      }, err => {
        this.toastService.showLastingErrorToast('Failed to load inbound vehicle positions');
        console.log(JSON.stringify(err));
      }
    );
    this.http.getVehiclePositionOutboundData(id).subscribe(
      data => {
        this.outboundPositionData = data;
      }, err => {
        this.toastService.showLastingErrorToast('Failed to load outbound vehicle positions');
        console.log(JSON.stringify(err));
      }
    )
  }

  // Update line-data
  refreshData(): void {
    this.getLine();
  }
}
