import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Post } from '../../shared/services/post/post';
import { PostService } from '../../shared/services/post/post.service';
import { GlobalService } from '../../shared/services/global/global.service';

@Component({
  selector: 'app-post-manage',
  templateUrl: './post-manage.component.html',
  styleUrls: ['./post-manage.component.scss']
})
export class PostManageComponent implements OnInit, OnDestroy {
  title: string;
  submitBtnTitle: string;
  postType: string;

  noImage = 'assets/images/site/no-image.svg';
  postImagePreview: string | ArrayBuffer;
  postImage: string | ArrayBuffer = this.noImage;
  postImageFile: File | null;
  postImageDelete = false;
  postImageOverSize = false;
  isSubmitted = false;
  loading = false;
  post: Post;

  postsSubscription: any;
  routeUrlSubscription: any;
  routeParamsSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private postService: PostService,
    private globalService: GlobalService
  ) { }

  postForm = this.fb.group({
    image: [''],
    title: ['', Validators.required],
    excerpt: [''],
    description: ['', Validators.required]
  });

  ngOnInit(): void {
    this.routeUrlSubscription = this.route.url.subscribe(data => {
      this.postType = data[1].path;

      if (this.postType === 'add') {
        this.title = 'Add New Post';
        this.submitBtnTitle = 'Create';

        this.fillPost(null);
      } else if (this.postType === 'edit') {
        this.title = 'Edit Post';
        this.submitBtnTitle = 'Update';

        this.routeParamsSubscription = this.route.params.subscribe(params => {
          if (params.id) {
            this.postsSubscription = this.postService.GetPost(params.id)
              .subscribe((post: Post) => {
                this.fillPost(post);
              });
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.routeUrlSubscription.unsubscribe();

    if (this.postType === 'edit') {
      this.routeParamsSubscription.unsubscribe();
      this.postsSubscription.unsubscribe();
    }
  }

  uploadPreview(event): void {
    this.postImageFile = event.target.files[0];
    this.postImageOverSize = false;
    const size = this.globalService.FormatBytes(this.postImageFile.size);

    if ( (size.type === 'Bytes' || size.type === 'KB') && size.number < 1024) {
      const reader: FileReader = new FileReader();

      reader.onloadend = () => {
        this.postImagePreview = reader.result;
      };

      reader.readAsDataURL(this.postImageFile);
    } else {
      this.postImageOverSize = true;
      this.postImageFile = null;
      this.postImagePreview = this.noImage;
    }
  }

  clearImage(): void {
    if (this.post.photoURL) {
      this.postImageDelete = true;
    }

    this.postImageFile = null;
    this.postImagePreview = this.noImage;
  }

  fillPost(post: Post): void {
    if (post) {
      this.post = {
        uid: post.uid,
        photoURL: post.photoURL,
        title: post.title,
        excerpt: post.excerpt,
        description: post.description
      };

      this.postImage = post.photoURL ? post.photoURL : this.noImage;
      this.postForm.controls.title.setValue(post.title);
      this.postForm.controls.excerpt.setValue(post.excerpt);
      this.postForm.controls.description.setValue(post.description);
    } else {
      this.post = {
        photoURL: '',
        title: '',
        excerpt: '',
        description: ''
      };

      this.postImage = this.noImage;
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.postForm.status !== 'INVALID') {
      this.loading = true;

      this.post.title = this.postForm.controls.title.value;
      this.post.excerpt = this.postForm.controls.excerpt.value;
      this.post.description = this.postForm.controls.description.value;

      this.postService.SetPostData(this.post)
        .then((id: string) => {
          if (this.postImageFile) {
            this.globalService.UploadImage(this.postImageFile, id, 'posts-images', 'posts').then(() => {
              this.loading = false;
              this.router.navigate(['admin/posts']);
            });
          } else if (this.postImageDelete) {
            this.globalService.DeleteImage(id, 'posts-images', 'posts').then(() => {
              this.loading = false;
              this.postImageDelete = false;
              this.router.navigate(['admin/posts']);
            });
          } else {
            this.loading = false;
            this.router.navigate(['admin/posts']);
          }
        });
    }
  }
}
