import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalService } from '../../shared/services/global/global.service';
import { UserService } from '../../shared/services/user/user.service';
import { User } from '../../shared/services/user/user';
import { PostService } from '../../shared/services/post/post.service';
import { Post } from '../../shared/services/post/post';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnDestroy {
  users: User[];
  posts: Post[];
  postDeleteLoading = false;
  usersSubscription: any;
  postsSubscription: any;
  routeParamsSubscription: any;

  currentPage = 1;
  postsPerPage = 5;
  searchText = '';
  sortedBy: object = {
    title: null,
    owner: null,
    createdAt: null,
  };

  constructor(
    private globalService: GlobalService,
    private userService: UserService,
    private postService: PostService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.usersSubscription = this.userService.GetAllUsers().subscribe(users => {
      this.users = users;

      this.routeParamsSubscription = this.route.params.subscribe(params => {
        this.postsSubscription = this.postService.GetAllPosts().subscribe(posts => {
          if (params.uid) {
            this.posts = posts.filter(post => {
              return post.owner === params.uid;
            });
          } else {
            this.posts = posts;
          }
        });
      });
    });
  }

  ngOnDestroy(): void {
    console.log(this.routeParamsSubscription);
    this.usersSubscription.unsubscribe();
    this.postsSubscription.unsubscribe();

    this.routeParamsSubscription.unsubscribe();
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

  deletePost(id: string): void {
    this.postDeleteLoading = true;

    this.postService.DeletePost(id).then(() => {
      this.postDeleteLoading = false;
    });
  }

  sortPosts(fieldName: string): void {
    const result = this.globalService.SortItems(this.posts, fieldName, this.sortedBy);
    this.posts = result.items;
    this.sortedBy = result.sortedBy;
  }
}
