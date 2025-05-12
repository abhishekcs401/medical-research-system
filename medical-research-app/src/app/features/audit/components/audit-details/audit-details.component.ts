import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuditService } from '../../../../core/services/audit.service';
import { Audit } from '../../types/audit.model';

@Component({
  selector: 'app-audit-details',
  templateUrl: './audit-details.component.html',
})
export class AuditDetailsComponent implements OnInit {
  audit?: Audit;

  constructor(private route: ActivatedRoute, private service: AuditService) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.service.getById(id).subscribe((p) => (this.audit = p));
  }
}
