import {Injectable} from "@angular/core";
import {Headers, Http, RequestMethod} from "@angular/http";


@Injectable()
export class SubmitService {

  private submitUrl = "http://10.5.0.224:8080/submit/";
  constructor(private http:Http) {
  }

  submit(workflowJSON: string) {
    console.log(`submit: ${workflowJSON}`);
    let headers = new Headers({
      'Content-Type': 'application/json'});
    console.log(JSON.stringify(workflowJSON));
    return this.http
        .post(this.submitUrl, JSON.stringify(workflowJSON), {headers: headers,method: RequestMethod.Post})
        .toPromise()
        .then(res => {console.log(res)})
        .catch(this.handleError);
  }
  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
