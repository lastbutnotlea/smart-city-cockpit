import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'tripview',
  templateUrl: './trip.component.html',
  styleUrls: ['.ç/trip.component.css']
})

export class TripComponent implements OnInit {
  title: String;
  ngOnInit(): void {
    this.title = "trip view";
  }

}
