import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import {MatListModule } from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion'; 
import {MatTableModule} from '@angular/material/table';
import {MatRadioModule} from '@angular/material/radio'; 
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; 
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
//CDK
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { TextFieldModule } from '@angular/cdk/text-field';
import { PortalModule } from '@angular/cdk/portal';

const components = [
  MatExpansionModule,
  MatListModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  DragDropModule,
  OverlayModule,
  TextFieldModule,
  MatDialogModule,
  PortalModule,
  MatIconModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule 
];

@NgModule({
  declarations: [],
  imports: [CommonModule, components],
  exports: components,
})
export class MaterialCdkModule {}
