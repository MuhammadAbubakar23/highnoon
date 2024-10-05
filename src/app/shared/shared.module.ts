import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { RouterModule } from '@angular/router';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToasterComponent } from './components/toaster/toaster.component';

import { DisableControlDirective } from './directives/disable-control.directive';

@NgModule({
  declarations: [
    SidenavComponent,
    HeaderComponent,
    FooterComponent,
    ToasterComponent,
    DisableControlDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  exports: [
    SidenavComponent,
    HeaderComponent,
    ToasterComponent,
    DisableControlDirective
  ]
})
export class SharedModule { }
