import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class HttpRoutingService {

  constructor(private http: HttpClient) {}

  public sendGetRequest(url:string): void{
    this.http.get(url).subscribe(data => {
      // Read the result field from the JSON response.
        console.log(data['results']);
    },
    err => {
      console.log('Something went wrong!');
    });
  }

  public sendPostRequest(url: string, body: any): void{
    this.http.post(url, body).subscribe(data => {
        // Read the result field from the JSON response.
        console.log(data['results']);
      },
      err => {
        console.log('Something went wrong!');
      });
  }

  public sendPutRequest(url: string, body: any): void{
    this.http.put(url, body).subscribe(data => {
        // Read the result field from the JSON response.
        console.log(data['results']);
      },
      err => {
        console.log('Something went wrong!');
      });
  }

  public sendDeleteRequest(url: string): void{
    this.http.delete(url).subscribe(data => {
        // Read the result field from the JSON response.
        console.log(data['results']);
      },
      err => {
        console.log('Something went wrong!');
      });
  }
}
