import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantDetailsComponent } from './participant-details.component';

describe('ParticipantDetailsComponent', () => {
  let component: ParticipantDetailsComponent;
  let fixture: ComponentFixture<ParticipantDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParticipantDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
