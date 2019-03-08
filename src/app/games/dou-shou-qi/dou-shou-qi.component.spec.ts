import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DouShouQiComponent } from './dou-shou-qi.component';

describe('DouShouQiComponent', () => {
  let component: DouShouQiComponent;
  let fixture: ComponentFixture<DouShouQiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DouShouQiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DouShouQiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
