import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IbartiService } from './services';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    IbartiService
  ]
})
export class CoreModule { }
