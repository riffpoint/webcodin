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
  noImage = 'assets/images/site/no-image-white.svg';
  currentPage = 1;
  usersPerPage = 5;
  searchText = '';

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
    const result = this.globalService.SortItems(this.users, fieldName, this.sortedBy);
    this.users = result.items;
    this.sortedBy = result.sortedBy;
  }

  onSearchTextChange(): void {
      this.currentPage = 1;
  }
}
