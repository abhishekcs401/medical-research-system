import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
// import { ProgramFormComponent } from './program-form/program-form.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  // { path: 'create', component: ProgramFormComponent },
  // { path: 'edit/:id', component: ProgramFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
