import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { AuthService } from '../shared/services/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  host: {
    '(document:click)': 'onCloseMobileSidebar($event)',
    '(window:scroll)': 'onScroll($event)'
  }
})
export class AdminComponent implements OnInit, OnDestroy {
  sidebarIsHidden: boolean = false;
  sidebarMobileIsHidden: boolean = true;
  headerMobileIsHidden: boolean = false;
  yOffsetPrevState: number;
  loading: boolean = true;
  loadingSubscribe: any;

  constructor(
    private _eref: ElementRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadingSubscribe = this.authService.loading.subscribe((data) => {
      this.loading = data;
    })
  }

  ngOnDestroy(): void {
    this.loadingSubscribe.unsubscribe();
  }

  onToggleSidebar() {
    this.sidebarIsHidden = !this.sidebarIsHidden;
  }

  onToggleMobileSidebar() {
    this.sidebarMobileIsHidden = !this.sidebarMobileIsHidden;
  }

  onCloseMobileSidebar() {
    if (!this._eref.nativeElement.querySelector('.header').contains(event.target)) {
      this.sidebarMobileIsHidden = true;
    }
  }

  onScroll(): void {
    const yOffset = window.pageYOffset;
    let dir = this.yOffsetPrevState < yOffset ? true : false;

    if (yOffset > 40 && !this.headerMobileIsHidden && dir) {
      this.headerMobileIsHidden = true
    } else if (this.headerMobileIsHidden && !dir) {
      this.headerMobileIsHidden = false
    }

    this.yOffsetPrevState = yOffset;
  }
}
