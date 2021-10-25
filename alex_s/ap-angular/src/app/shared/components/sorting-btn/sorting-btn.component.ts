import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sorting-btn',
  templateUrl: './sorting-btn.component.html',
  styleUrls: ['./sorting-btn.component.scss']
})
export class SortingBtnComponent implements OnInit {
  @Input() sortedBy: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
