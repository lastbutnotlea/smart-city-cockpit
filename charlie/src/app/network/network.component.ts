import {Component, OnInit} from "@angular/core";
import {HttpRoutingService} from "../services/http-routing.service";
import {UrlBuilderService} from "../services/url-builder.service";

@Component({
  selector: 'networkview',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})

export class NetworkComponent implements OnInit {
  title: String;

  constructor(private http: HttpRoutingService, private urlBuilder: UrlBuilderService) { }

  ngOnInit(): void {
    this.title = "network view";
    // this.http.sendGetRequest(this.urlBuilder.getNetworkUrl());
  }

}
