import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramEditComponent } from './program-edit.component';

describe('ProgramEditComponent', () => {
  let component: ProgramEditComponent;
  let fixture: ComponentFixture<ProgramEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgramEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgramEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
