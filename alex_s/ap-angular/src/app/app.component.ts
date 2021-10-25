import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('toggleSidebar', [
      state('open', style({
        paddingLeft: '300px',
      })),
      state('close', style({
        paddingLeft: '0',
      })),
      transition('* => *', [
        animate('0.5s')
      ]),
    ]),
  ]
})
export class AppComponent {
  sidebarIsOpen: boolean = false;
  direction: string = "";

  toggleSidebar(): void {
    this.sidebarIsOpen = !this.sidebarIsOpen;
  }

  onSwipe(event): void {
    const x = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? "Right" : "Left") : "";
    const y = Math.abs(event.deltaY) > 40 ? (event.deltaY > 0 ? "Down" : "Up") : "";

    this.direction = `You swiped in <b> ${x} ${y} </b> direction <hr>`;

    if (x === 'Right') {
      this.sidebarIsOpen = true;
    } else if (x === 'Left') { 
      this.sidebarIsOpen = false;
    }
  }
}
