import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BdaysComponent } from './bdays.component';

describe('BdaysComponent', () => {
  let component: BdaysComponent;
  let fixture: ComponentFixture<BdaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BdaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BdaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
