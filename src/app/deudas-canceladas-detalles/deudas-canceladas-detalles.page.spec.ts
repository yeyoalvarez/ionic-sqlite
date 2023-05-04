import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeudasCanceladasDetallesPage } from './deudas-canceladas-detalles.page';

describe('DeudasCanceladasDetallesPage', () => {
  let component: DeudasCanceladasDetallesPage;
  let fixture: ComponentFixture<DeudasCanceladasDetallesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeudasCanceladasDetallesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeudasCanceladasDetallesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
