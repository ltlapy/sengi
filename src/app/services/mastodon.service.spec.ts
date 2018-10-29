import { TestBed, inject } from '@angular/core/testing';

import { MastodonService } from './mastodon.service';

xdescribe('MastodonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MastodonService]
    });
  });

  it('should be created', inject([MastodonService], (service: MastodonService) => {
    expect(service).toBeTruthy();
  }));
});
