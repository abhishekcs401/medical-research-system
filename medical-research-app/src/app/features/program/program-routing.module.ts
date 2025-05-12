import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { ProgramListComponent } from './components/program-list/program-list.component';
import { ProgramCreateComponent } from './components/program-create/program-create.component';
import { ProgramEditComponent } from './components/program-edit/program-edit.component';
import { ProgramDetailsComponent } from './components/program-details/program-details.component';

const routes: Routes = [
  { path: '', component: ProgramListComponent },
  { path: 'create', component: ProgramCreateComponent },
  { path: 'edit/:id', component: ProgramEditComponent },
  { path: ':id', component: ProgramDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramRoutingModule {}
