import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { CidadeInterface } from '../../interface/CidadeInterface';
import { ModalComponent } from '../modal/modal.component';
import { CidadeService } from '../../services/cidade.service';
import { FocosQueimadaService } from '../../services/focos-queimada.service';
import { FocosQueimadaInterface } from '../../interface/FocosQueimadaInterface';
import { ToastModule } from 'primeng/toast';
import { timer } from 'rxjs';
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    FormsModule,
    ModalComponent,
    ReactiveFormsModule,
    ToastModule
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {

  @ViewChild('modal') modal!: ModalComponent;
  
  public map: any;
  public lat: number = -22.599;
  public long: number = -47.845;

  public cidades: CidadeInterface[] = [];
  public focos: FocosQueimadaInterface[] = [];

  public dateFilter: Date = new Date();
  public iconCustom = L.icon({
    iconUrl: 'https://decisionfarm.ca/assets/images/marker-icon-2x.png', // Substitua pela URL do seu ícone
    iconSize: [16, 16],   // Tamanho do ícone
    iconAnchor: [16, 16], // Posição de ancoragem
    popupAnchor: [0, -32] // Onde o popup será mostrado
  });

  public formFilter: FormGroup;
  public showToast: boolean = false;

  constructor(private city: CidadeService, private focus: FocosQueimadaService) {
    this.formFilter = new FormGroup({
      date: new FormControl(null,[Validators.required]),
      codeCity: new FormControl(null,[Validators.required]),
    });
  }

  ngOnInit() {
    // get city
    this.getAllCity();

    this.map = L.map('map', {
      scrollWheelZoom: true,
      zoomControl: false
      // first key = lat 
      // second key = long
    }).setView([this.lat, this.long], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    L.control.zoom({
      position: 'topright'
    }).addTo(this.map);

    this.getAllFocus();
  }

  openModal() {
    console.log('Abrindo o modal');
    this.modal.open();
    
  }

  getAllCity() {
    this.city.getAll().subscribe(
      (data) => {
        this.cidades = data.body || [];
      },
      (err) => {
        console.log(err);
      }
    )
  }

  getAllFocus() {
    this.focus.getAll().subscribe(
      (data) => {
        this.focos = data.body || [];
        this.focos.forEach((p) => {
          L.marker([p.nrLatitude,p.nrLongitude],{ icon: this.iconCustom }).addTo(this.map).bindPopup('').getIcon();
        })
      }
    )
  }
  /*
          "cdFoco": 2,
        "dtFoco": "2024-09-08",
        "nrLongitude": -47.31,
        "nrLatitude": -23.275,
        "cdMunicipio": "3523909"
  */
  getFocusByPeriodCity(start: string, end: string, code: string) {
    this.focus.getByPeriodCity(start, end,code).subscribe(
      (data) => {
        this.focos = [];
        this.focos = data.body || [];

        // this.focos.forEach((p) => {
        //   L.marker([p.nrLatitude,p.nrLongitude],{ icon: this.iconCustom }).addTo(this.map).bindPopup('').getIcon();
        // })

      }
    )
  }
  
  clear() {
    this.getAllFocus();
  }

  filterCityAndDate() {
    this.showToast = false;

    if (this.formFilter.valid) {
      this.getFocusByPeriodCity(
        this.formFilter.get('date')?.value,
        this.formFilter.get('date')?.value,
        this.formFilter.get('codeCity')?.value,
      );
    }

    else {
      this.showToast = true;
    }

    // this.showToast = false;

  }
}
