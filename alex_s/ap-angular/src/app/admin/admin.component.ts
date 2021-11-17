import { Component, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { AuthService } from '../shared/services/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  sidebarIsHidden = false;
  sidebarMobileIsHidden = true;
  headerMobileIsHidden = false;
  yOffsetPrevState: number;
  loading = true;
  loadingSubscribe: any;

  constructor(
    private eref: ElementRef,
    private authService: AuthService
  ) { }

  @HostListener('document:click', ['$event']) onCloseMobileSidebar(event: Event): void {
    if (!this.eref.nativeElement.querySelector('.header').contains(event.target)) {
      this.sidebarMobileIsHidden = true;
    }
  }

  @HostListener('window:scroll', ['$event']) onScroll(): void {
    const yOffset = window.pageYOffset;
    const dir = this.yOffsetPrevState < yOffset ? true : false;

    if (yOffset > 40 && !this.headerMobileIsHidden && dir) {
      this.headerMobileIsHidden = true;
    } else if (this.headerMobileIsHidden && !dir) {
      this.headerMobileIsHidden = false;
    }

    this.yOffsetPrevState = yOffset;
  }

  ngOnInit(): void {
    this.loadingSubscribe = this.authService.loading.subscribe((data) => {
      this.loading = data;
    });
  }

  ngOnDestroy(): void {
    this.loadingSubscribe.unsubscribe();
  }

  onToggleSidebar(): void {
    this.sidebarIsHidden = !this.sidebarIsHidden;
  }

  onToggleMobileSidebar(): void {
    this.sidebarMobileIsHidden = !this.sidebarMobileIsHidden;
  }
}
