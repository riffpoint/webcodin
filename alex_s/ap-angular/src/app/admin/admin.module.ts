import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { CardComponent } from '../shared/components/card/card.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './users/users.component';
import { SortingBtnComponent } from '../shared/components/sorting-btn/sorting-btn.component';

import { ItemsFilterPipe } from '../shared/pipes/items-filter.pipe';
import { PostsComponent } from './posts/posts.component';
import { PostManageComponent } from './post-manage/post-manage.component';
import { UserManageComponent } from './user-manage/user-manage.component';
import { AlertModule } from '../shared/components/alert/alert.module';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    SidebarComponent,
    HeaderComponent,
    CardComponent,
    ProfileComponent,
    FooterComponent,
    UsersComponent,
    ItemsFilterPipe,
    SortingBtnComponent,
    PostsComponent,
    PostManageComponent,
    UserManageComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    AlertModule
  ],
  providers: []
})
export class AdminModule { }
