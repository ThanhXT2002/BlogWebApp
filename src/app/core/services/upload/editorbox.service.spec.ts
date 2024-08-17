import { TestBed } from '@angular/core/testing';

import { EditorboxService } from './editorbox.service';

describe('EditorboxService', () => {
  let service: EditorboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
