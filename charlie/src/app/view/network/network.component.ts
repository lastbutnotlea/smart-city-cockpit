import {Component, OnInit} from "@angular/core";
import {HttpRoutingService} from "../../services/http-routing.service";
import {UrlBuilderService} from "../../services/url-builder.service";
import { HttpClient } from '@angular/common/http';
import { LineData } from '../../shared/line-data';

@Component({
  selector: 'networkview',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})

export class NetworkComponent implements OnInit {
  title: String;
  lines: LineData[];

  constructor(private http: HttpRoutingService, private urlBuilder: UrlBuilderService,
              private h: HttpClient) { }

  ngOnInit(): void {
    this.title = 'network view';
    this.http.sendGetRequest(this.urlBuilder.getNetworkUrl());
    this.h.get<LineData[]>(this.urlBuilder.getNetworkUrl()).subscribe(data => {
      this.lines = data;
    });
  }

}
