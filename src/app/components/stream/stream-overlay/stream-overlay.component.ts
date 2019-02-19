import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Account, Results } from "../../../services/models/mastodon.interfaces";
import { MastodonService } from '../../../services/mastodon.service';
import { ToolsService, OpenThreadEvent } from '../../../services/tools.service';
import { StreamElement, StreamTypeEnum } from '../../../states/streams.state';

@Component({
    selector: 'app-stream-overlay',
    templateUrl: './stream-overlay.component.html',
    styleUrls: ['./stream-overlay.component.scss']
})
export class StreamOverlayComponent implements OnInit {
   
    private previousElements: OverlayBrowsing[] = [];
    private nextElements: OverlayBrowsing[] = [];
    private currentElement: OverlayBrowsing;

    canRefresh: boolean;
    canGoForward: boolean;

    accountName: string;
    thread: OpenThreadEvent;
    // hashtag: string;
    hashtagElement: StreamElement;

    @Output() closeOverlay = new EventEmitter();

    @Input('browseAccountData')
    set browseAccountData(accountName: string) {
        this.browseAccount(accountName);
        // this.accountName = accountName;
    }

    @Input('browseThreadData')
    set browseThreadData(openThread: OpenThreadEvent) {
        this.browseThread(openThread);
    }

    @Input('browseHashtagData')
    set browseHashtagData(hashtag: string) {
        this.browseHashtag(hashtag);
    }

    constructor(private toolsService: ToolsService) { }

    ngOnInit() {
    }

    close(): boolean {
        this.closeOverlay.next();
        return false;
    }

    next(): boolean {
        if (this.nextElements.length === 0) {
            return false;
        }

        if (this.currentElement) {
            this.previousElements.push(this.currentElement);
        }

        const nextElement = this.nextElements.pop();
        this.loadElement(nextElement);

        if(this.nextElements.length === 0) this.canGoForward = false;
        return false;
    }

    previous(): boolean {
        if (this.previousElements.length === 0) {
            this.closeOverlay.next();
            return false;
        }

        if (this.currentElement) {
            this.nextElements.push(this.currentElement);
        }

        const previousElement = this.previousElements.pop();
        this.loadElement(previousElement);

        this.canGoForward = true;
        return false;
    }

    refresh(): boolean {
        console.log('refresh');
        return false;
    }

    browseAccount(accountName: string): void {
        if(!accountName) return;

        this.nextElements.length = 0;
        if (this.currentElement) {
            this.previousElements.push(this.currentElement);
        }
        const newElement = new OverlayBrowsing(null, accountName, null);
        this.loadElement(newElement);
        this.canGoForward = false;
    }

    browseHashtag(hashtag: string): void {
        if(!hashtag) return;

        this.nextElements.length = 0;
        if (this.currentElement) {
            this.previousElements.push(this.currentElement);
        }

        const selectedAccount = this.toolsService.getSelectedAccounts()[0];
        const hashTagElement = new StreamElement(StreamTypeEnum.tag, hashtag, selectedAccount.id, hashtag, null, `#${hashtag}@${selectedAccount.instance}`);
        const newElement = new OverlayBrowsing(hashTagElement, null, null);
        this.loadElement(newElement);
        this.canGoForward = false;
    }

    browseThread(openThread: OpenThreadEvent): any {
        if(!openThread) return;

        this.nextElements.length = 0;
        if (this.currentElement) {
            this.previousElements.push(this.currentElement);
        }

        const newElement = new OverlayBrowsing(null, null, openThread);
        this.loadElement(newElement);
        this.canGoForward = false;
    }

    private loadElement(element: OverlayBrowsing) {
        this.currentElement = element;

        this.accountName = this.currentElement.account;
        this.thread = this.currentElement.thread;
        this.hashtagElement = this.currentElement.hashtag;
    }
}

class OverlayBrowsing {
    constructor(
        public readonly hashtag: StreamElement,
        public readonly account: string,
        public readonly thread: OpenThreadEvent) {

        if (hashtag) {
            this.type = OverlayEnum.hashtag;
        } else if (account) {
            this.type = OverlayEnum.account;
        } else if (thread) {
            this.type = OverlayEnum.thread;
        } else {
            throw Error('NotImplemented');
        }
    }

    type: OverlayEnum;
}

enum OverlayEnum {
    unknown = 0,
    hashtag = 1,
    account = 2,
    thread = 3
}
