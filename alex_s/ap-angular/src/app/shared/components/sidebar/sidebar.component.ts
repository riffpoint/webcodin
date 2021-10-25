import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() onToggleSidebar = new EventEmitter<boolean>();
  @Output() onToggleMobileSidebar = new EventEmitter<boolean>();
  @Input() sidebarIsHidden: boolean = false;
  @Input() sidebarMobileIsHidden: boolean = false;

  constructor() { }

  toggleSidebar(): void {
    this.onToggleSidebar.emit();
  }
  toggleMobileSidebar(): void {
    this.onToggleMobileSidebar.emit();
  }

  toggleSubMenu(event: any) {
    event.stopPropagation();
    event.preventDefault();

    const obj = event.currentTarget.parentNode.classList;
    const openClass = 'sidebar__nav__item--active';

    if (obj.contains(openClass)) {
      obj.remove(openClass);
    } else {
      obj.add(openClass);
    }
  }
}
