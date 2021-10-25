import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalService } from '../../shared/services/global/global.service';
import { UserService } from '../../shared/services/user/user.service';
import { User } from '../../shared/services/user/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  noImage: string = 'assets/images/site/no-image-white.svg';
  currentPage: number = 1;
  usersPerPage: number = 5;
  searchText: string = '';

  usersSubscription: any;
  users: User[];
  sortedBy: object = {
    name: null,
    surname: null,
    email: null,
    occupation: null,
    createdAt: null,
  };

  constructor(
    private globalService: GlobalService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.usersSubscription = this.userService.GetAllUsers().subscribe(data => {
      this.users = data;
    });
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }

  sortUsers(fieldName: string): void {
    let result = this.globalService.SortItems(this.users, fieldName, this.sortedBy);
    this.users = result['items'];
    this.sortedBy = result['sortedBy'];
  }

  onSearchTextChange(): void {
      console.log('change')
      this.currentPage = 1;
  }
}
