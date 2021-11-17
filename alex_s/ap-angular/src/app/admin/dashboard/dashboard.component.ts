import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { User } from '../../shared/services/user/user';
import { PostService } from '../../shared/services/post/post.service';
import { Post } from '../../shared/services/post/post';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  noImage = 'assets/images/site/no-image-white.svg';
  users: User[] = [];
  posts: Post[] = [];
  usersSubscription: any;
  postsSubscription: any;

  constructor(
    private userService: UserService,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.usersSubscription = this.userService.GetAllUsers().subscribe(users => {
      this.users = users;
    });

    this.postsSubscription = this.postService.GetAllPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
    this.postsSubscription.unsubscribe();
  }

  getNameOfPostOwner(ownerId: string): string {
    let name: string;

    this.users.map(user => {
      if (user.uid === ownerId) {
        name = `${user.name} ${user.surname}`;
      }
    });

    return name;
  }
}
