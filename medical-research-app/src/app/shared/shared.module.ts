import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldsComponent } from './components/form-fields/form-fields.component';
import { ProgramSelectComponent } from './components/program-select/program-select.component'; // ✅ <-- this line is mandatory
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ErrorHandlerService } from './services/error-handler.service';

@NgModule({
  declarations: [FormFieldsComponent, ProgramSelectComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FormFieldsComponent,
    ProgramSelectComponent,
  ],
  providers: [ErrorHandlerService],
})
export class SharedModule {}
