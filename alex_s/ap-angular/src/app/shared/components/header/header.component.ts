import { Component, ElementRef, EventEmitter, OnInit, OnDestroy, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../services/auth/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  host: {
    '(document:click)': 'closeNav($event)',
  }
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isHidden: boolean = false;
  @Output() onToggleMobileSidebar = new EventEmitter<boolean>();
  noImage: string = 'assets/images/site/no-image-white.svg';
  userName: string;
  userEmail: string;
  userAvatar: string = this.noImage;
  userId: string;
  navIsHidden: boolean = true;
  userSubscribe: any;

  constructor(
    public authService: AuthService,
    private router: Router,
    private _eref: ElementRef
  ) {
    router.events.pipe().subscribe(() => {
      this.navIsHidden = true;
    })
  }

  ngOnInit(): void {
    const id = JSON.parse(localStorage.getItem('user')).uid;

    this.userSubscribe = this.authService.afs.collection('users').doc(id)
      .valueChanges()
      .subscribe((user: User) => {
        this.userAvatar = user.photoURL ? user.photoURL : this.noImage;
        this.userEmail = user.email;
        this.userId = user.uid;
      });
  }

  ngOnDestroy(): void {
    this.userSubscribe.unsubscribe();
  }

  closeNav(event: Event): void {

    if (
      !this._eref.nativeElement.querySelector('.header__user').contains(event.target)
    ) {
      this.navIsHidden = true;
    }
  }

  toggleNav(): void {
    this.navIsHidden = !this.navIsHidden;
  }

  toggleSidebar(): void {
    this.onToggleMobileSidebar.emit();
  }
}
