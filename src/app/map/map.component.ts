import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
declare let L: { map: (arg0: string, arg1: { scrollWheelZoom: boolean; }) => { (): any; new(): any; setView: { (arg0: number[], arg1: number): any; new(): any; }; }; tileLayer: (arg0: string, arg1: { attribution: string; }) => { (): any; new(): any; addTo: { (arg0: any): void; new(): any; }; }; }; // Declaramos essa variável

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {

  public map: any;
  public lat: number = -23.4697804;
  public long: number = -47.6016021;

  constructor() {}

  ngOnInit() {
    this.map = L.map('map', {
      scrollWheelZoom: false,
      // first key = lat 
      // second key = long
    }).setView([this.lat, this.long], 10);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  test() {
    this.map.setView([this.lat, this.long], 12);
  }
}
