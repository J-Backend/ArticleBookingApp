import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLayawayComponent } from './new-layaway.component';

describe('NewLayawayComponent', () => {
  let component: NewLayawayComponent;
  let fixture: ComponentFixture<NewLayawayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLayawayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLayawayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
