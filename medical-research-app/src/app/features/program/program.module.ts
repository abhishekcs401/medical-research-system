import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { ProgramRoutingModule } from './program-routing.module';

// Components
import { ProgramListComponent } from './components/program-list/program-list.component';
import { ProgramCreateComponent } from './components/program-create/program-create.component';
import { ProgramEditComponent } from './components/program-edit/program-edit.component';
import { ProgramDetailsComponent } from './components/program-details/program-details.component';

@NgModule({
  declarations: [
    ProgramListComponent,
    ProgramCreateComponent,
    ProgramEditComponent,
    ProgramDetailsComponent,
  ],
  imports: [CommonModule, SharedModule, ProgramRoutingModule],
})
export class ProgramModule {}
