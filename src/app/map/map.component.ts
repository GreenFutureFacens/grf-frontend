import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { CidadeInterface } from '../../interface/CidadeInterface';
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {

  public map: any;
  public lat: number = -22.599;
  public long: number = -47.845;
  public cidades: CidadeInterface[] = [];

  constructor() {}

  ngOnInit() {
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

    const saoPauloCenter = [-23.5505, -46.6333];
    const test: L.LatLngLiteral = {
      lat: -23.5505,
      lng: -46.6333
    }

    // Criando um ícone personalizado
    const customIcon = L.icon({
      iconUrl: 'https://decisionfarm.ca/assets/images/marker-icon-2x.png', // Substitua pela URL do seu ícone
      iconSize: [16, 16],   // Tamanho do ícone
      iconAnchor: [16, 16], // Posição de ancoragem
      popupAnchor: [0, -32] // Onde o popup será mostrado
    });

    this.mockData().forEach((e) => {
      // Adiciona um marcador no centro de São Paulo
      L.marker(e,{ icon: customIcon }).addTo(this.map).bindPopup(e.lat.toString() + " " + e.lng.toString()).getIcon();
    });
    
    this.popArrayCidade();

  }

  test() {
    this.map.setView([this.lat, this.long], 12);
  }

  popArrayCidade() {
    this.cidades = [];

    this.cidades.push({nomeCidade: 'Sorocaba',codigoCidade:'000000',lat:40, long:40});
    this.cidades.push({nomeCidade: 'Sorocaba',codigoCidade:'000000',lat:40, long:40});
    this.cidades.push({nomeCidade: 'Sorocaba',codigoCidade:'000000',lat:40, long:40});
    this.cidades.push({nomeCidade: 'Sorocaba',codigoCidade:'000000',lat:40, long:40});
    this.cidades.push({nomeCidade: 'Sorocaba',codigoCidade:'000000',lat:40, long:40});
    this.cidades.push({nomeCidade: 'Sorocaba',codigoCidade:'000000',lat:40, long:40});
  }

  mockData(): L.LatLngLiteral[] {
    const points: L.LatLngLiteral[] = [];
    
    // Limites geográficos do estado de São Paulo
    const latMin = -25.0;
    const latMax = -19.0;
    const lngMin = -54.0;
    const lngMax = -44.0;
    
    // Função para gerar um número aleatório dentro de um intervalo
    const getRandomInRange = (min: number, max: number): number => Math.random() * (max - min) + min;
    
    for (let i = 0; i < 40; i++) {
      const randomLat = getRandomInRange(latMin, latMax);
      const randomLng = getRandomInRange(lngMin, lngMax);
      
      const point: L.LatLngLiteral = {
        lat: randomLat,
        lng: randomLng
      };
      
      points.push(point);
    }
    
    return points;
  }
}
