import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpslsComponent } from './rpsls.component';

describe('RpslsComponent', () => {
  let component: RpslsComponent;
  let fixture: ComponentFixture<RpslsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RpslsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RpslsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
