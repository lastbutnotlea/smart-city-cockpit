import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'networkview',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})

export class NetworkComponent implements OnInit {
  title: String;
  ngOnInit(): void {
    this.title = "network view";
  }

}
