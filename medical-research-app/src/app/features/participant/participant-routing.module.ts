import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { ParticipantListComponent } from './components/participant-list/participant-list.component';
import { ParticipantCreateComponent } from './components/participant-create/participant-create.component';
import { ParticipantEditComponent } from './components/participant-edit/participant-edit.component';
import { ParticipantDetailsComponent } from './components/participant-details/participant-details.component';

const routes: Routes = [
  { path: '', component: ParticipantListComponent },
  { path: 'create', component: ParticipantCreateComponent },
  { path: ':id', component: ParticipantDetailsComponent },
  { path: 'edit/:id', component: ParticipantEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParticipantRoutingModule {}
