import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() ToggleSidebar = new EventEmitter<boolean>();
  @Output() ToggleMobileSidebar = new EventEmitter<boolean>();
  @Input() sidebarIsHidden = false;
  @Input() sidebarMobileIsHidden = false;

  constructor() { }

  onToggleSidebar(): void {
    this.ToggleSidebar.emit();
  }
  onToggleMobileSidebar(): void {
    this.ToggleMobileSidebar.emit();
  }

  toggleSubMenu(event: any): void {
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
