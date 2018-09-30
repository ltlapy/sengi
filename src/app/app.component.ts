import { Component, OnInit, OnDestroy } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { NavigationService, LeftPanelType } from './services/navigation.service';
import { Subscription } from 'rxjs';
import { AccountWrapper } from './models/account.models';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
 
  title = 'app';

  floatingColumnActive: boolean;
  private columnEditorSub: Subscription;

  constructor(private readonly navigationService: NavigationService) {
   
  }
  
  ngOnInit(): void {
    this.columnEditorSub = this.navigationService.activatedPanelSubject.subscribe((type: LeftPanelType) => {
      if(type === LeftPanelType.Closed) {
        this.floatingColumnActive = false;
      } else {
        this.floatingColumnActive = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.columnEditorSub.unsubscribe();
  }
  
}
