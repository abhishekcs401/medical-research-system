import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuditModule } from '../audit/audit.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [SharedModule, DashboardRoutingModule, AuditModule],
})
export class DashboardModule {}
