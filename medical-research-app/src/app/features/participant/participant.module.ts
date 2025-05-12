import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ParticipantRoutingModule } from './participant-routing.module';

// Components
import { ParticipantListComponent } from './components/participant-list/participant-list.component';
import { ParticipantCreateComponent } from './components/participant-create/participant-create.component';
import { ParticipantEditComponent } from './components/participant-edit/participant-edit.component';
import { ParticipantDetailsComponent } from './components/participant-details/participant-details.component';

@NgModule({
  declarations: [
    ParticipantListComponent,
    ParticipantCreateComponent,
    ParticipantEditComponent,
    ParticipantDetailsComponent,
  ],
  imports: [SharedModule, ParticipantRoutingModule],
})
export class ParticipantModule {}
