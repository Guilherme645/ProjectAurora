/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TextoEntidadesService } from './TextoEntidades.service';

describe('Service: TextoEntidades', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TextoEntidadesService]
    });
  });

  it('should ...', inject([TextoEntidadesService], (service: TextoEntidadesService) => {
    expect(service).toBeTruthy();
  }));
});
