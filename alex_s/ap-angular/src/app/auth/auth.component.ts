import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../shared/components/alert/alert.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  authType = '';
  authSubscribe: any;

  constructor(
    private route: ActivatedRoute,
    public alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.authSubscribe = this.route.url.subscribe(data => {
      this.authType = data[data.length - 1].path;
    });
  }

  ngOnDestroy(): void {
    this.authSubscribe.unsubscribe();
  }

}
