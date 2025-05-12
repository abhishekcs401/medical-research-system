import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule here
import { SharedModule } from '../../shared/shared.module';
import { AuditRoutingModule } from './audit-routing.module';

// Components
import { AuditListComponent } from './components/audit-list/audit-list.component';
import { AuditDetailsComponent } from './components/audit-details/audit-details.component';

@NgModule({
  declarations: [AuditListComponent, AuditDetailsComponent],
  imports: [
    CommonModule, // Include CommonModule here
    SharedModule,
    AuditRoutingModule,
  ],
  exports: [AuditListComponent],
})
export class AuditModule {}
