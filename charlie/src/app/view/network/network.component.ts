import {Component, OnInit} from '@angular/core';
import {HttpRoutingService} from '../../services/http-routing.service';
import { LineData } from '../../shared/line-data';

@Component({
  selector: 'app-network-view',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})

export class NetworkComponent implements OnInit {
  title: String;
  lines: LineData[] = [];

  constructor(private http: HttpRoutingService) { }

  ngOnInit(): void {
    this.title = 'network view';
    // get line data
    this.http.getLines().subscribe( data => {
        this.lines = data;
      },
      err => {
        console.log('Could not fetch lines.');
      }
    );
  }

  /**
   * Returns true if lines contains at least one line, false otherwise
   * @returns {boolean}
   */
  isLoaded(): boolean {
    if (this.lines.length > 0) {
      return true;
    }
    return false;
  }

}
