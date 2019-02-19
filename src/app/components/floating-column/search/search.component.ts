import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { MastodonService } from '../../../services/mastodon.service';
import { AccountInfo } from '../../../states/accounts.state';
import { Results, Account } from '../../../services/models/mastodon.interfaces';
import { ToolsService, OpenThreadEvent } from '../../../services/tools.service';
import { StatusWrapper } from '../../stream/stream.component';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    @Input() searchHandle: string;

    accounts: Account[] = [];
    statuses: StatusWrapper[] = [];
    hashtags: string[] = [];

    isLoading: boolean;

    @Output() browseAccountEvent = new EventEmitter<string>();
    @Output() browseHashtagEvent = new EventEmitter<string>();
    @Output() browseThreadEvent = new EventEmitter<OpenThreadEvent>();

    constructor(
        private readonly notificationService: NotificationService,
        private readonly toolsService: ToolsService,
        private readonly mastodonService: MastodonService) { }

    ngOnInit() {
    }

    onSubmit(): boolean {
        this.searchHandle
        this.search(this.searchHandle);
        return false;
    }

    browseHashtag(hashtag: string): boolean {
        if (hashtag) {
            this.browseHashtagEvent.next(hashtag);
        }
        return false;
    }

    // addHashtag(hashtag: string): boolean {
    //     if (hashtag) {
    //         const newStream = new StreamElement(StreamTypeEnum.tag, `#${hashtag}`, this.lastAccountUsed.id, hashtag, null);
    //         this.store.dispatch([new AddStream(newStream)]);
    //     }

    //     return false;
    // }

    browseAccount(accountName: string): boolean {
        if (accountName) {
            this.browseAccountEvent.next(accountName);
        }
        return false;
    }

    private lastAccountUsed: AccountInfo;
    private search(data: string) {
        this.accounts.length = 0;
        this.statuses.length = 0;
        this.hashtags.length = 0;
        this.isLoading = true;

        const enabledAccounts = this.toolsService.getSelectedAccounts();
        //First candid implementation
        if (enabledAccounts.length > 0) {
            this.lastAccountUsed = enabledAccounts[0];
            this.mastodonService.search(this.lastAccountUsed, data, true)
                .then((results: Results) => {
                    if (results) {
                        this.accounts = results.accounts.slice(0, 5);
                        this.hashtags = results.hashtags;

                        for (let status of results.statuses) {
                            const statusWrapper = new StatusWrapper(status, this.lastAccountUsed);
                            this.statuses.push(statusWrapper);
                        }
                    }
                })
                .catch((err: HttpErrorResponse) => {
                    this.notificationService.notifyHttpError(err);
                })
                .then(() => { this.isLoading = false; });
        }
    }
}
