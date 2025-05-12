import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { HeaderComponent } from './main-layout/components/header/header.component';
import { SidebarComponent } from './main-layout/components/sidebar/sidebar.component';
import { FooterComponent } from './main-layout/components/footer/footer.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    AuthLayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [MainLayoutComponent, AuthLayoutComponent],
})
export class LayoutModule {}
