/* tslint:disable:no-unused-variable */

import {DrawboardComponent} from "./drawboard.component";
import {DrawboardStatusService} from "../drawboard-status.service";
import {ParametersStatusService} from "../parameters-status.service";

describe('Component: Drawboard', () => {
  let service = new DrawboardStatusService();
  let parameterService = new ParametersStatusService();
  it('should create an instance', () => {
    let component = new DrawboardComponent(service, parameterService);
    expect(component).toBeTruthy();
  });
});