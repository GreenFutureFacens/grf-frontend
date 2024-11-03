import { TestBed } from '@angular/core/testing';

import { FocosQueimadaService } from './focos-queimada.service';

describe('FocosQueimadaService', () => {
  let service: FocosQueimadaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FocosQueimadaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
