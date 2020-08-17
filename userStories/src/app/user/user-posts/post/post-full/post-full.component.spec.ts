import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostFullComponent } from './post-full.component';

describe('PostFullComponent', () => {
  let component: PostFullComponent;
  let fixture: ComponentFixture<PostFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
