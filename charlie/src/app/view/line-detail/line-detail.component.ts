import { Component, OnInit, ViewChild } from '@angular/core';
import { LineData } from '../../shared/data/line-data';
import { HttpRoutingService } from '../../services/http-routing.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LineMapComponent } from '../line-map/line-map.component';

@Component({
  selector: 'app-line-detail-view',
  templateUrl: './line-detail.component.html',
  styleUrls: ['./line-detail.component.css']
})

export class LineDetailComponent implements OnInit {

  line: LineData;

  @ViewChild(LineMapComponent)
  lineMap: LineMapComponent;

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location) { }

  ngOnInit(): void {
    this.getLine();
  }

  getLine(): void {
    const lineId = this.route.snapshot.paramMap.get('id');
    this.http.getLineDetails(lineId).subscribe(
      line => {
        this.line = line;
        this.lineMap.getLineMap(line);
      },
          err => {
        console.log('Could not fetch line data!')
      });
  }

  goBack(): void {
    this.location.back();
  }

  isLoaded(): boolean {
    return (this.line != null);
  }
}
