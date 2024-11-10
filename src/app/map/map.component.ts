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
    iconUrl: 'https://decisionfarm.ca/assets/images/marker-icon-2x.png', // Ícone do Leaflet
    iconSize: [16, 16],   // Tamanho do ícone
    iconAnchor: [16, 16], // Posição de ancoragem
    popupAnchor: [0, -32] // Onde o popup será mostrado
  });

  public formFilter: FormGroup;
  public showToast: boolean = false;

  public quantidadeFocos: number = 0;  // Variável para armazenar a quantidade de focos visíveis
  public quantidadeFocosFilter: number = 0;  // Variável para armazenar a quantidade de focos filtrados visíveis

  constructor(private city: CidadeService, private focus: FocosQueimadaService) {
    this.formFilter = new FormGroup({
      date: new FormControl(null, [Validators.required]),
      codeCity: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    // Carrega as cidades
    this.getAllCity();

    this.map = L.map('map', {
      scrollWheelZoom: true,
      zoomControl: false
    }).setView([-15, -60], 4);

    // Carrega o tile layer do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Controle de zoom no mapa
    L.control.zoom({
      position: 'topright'
    }).addTo(this.map);

    this.getAllFocus();
  }

  openModal() {
    console.log('Abrindo o modal');
    this.modal.open();
  }

  // Método para carregar todas as cidades do Back End
  getAllCity() {
    this.city.getAll().subscribe(
      (data) => {
        this.cidades = data.body || [];
      },
      (err) => {
        console.log('Erro ao carregar cidades:', err);
      }
    );
  }

  // Método para carregar todos os focos de queimada de uma vez
  getAllFocus() {
    this.focus.getAll().subscribe(
      (data) => {
        this.focos = data.body || [];
        this.quantidadeFocos = this.focos.length; // Atualiza a quantidade de focos
        this.focos.forEach((p) => {
          L.marker([p.nrLatitude, p.nrLongitude], { icon: this.iconCustom })
            .addTo(this.map)
            .bindPopup('');
        });
      },
      (error) => {
        console.log('Erro ao carregar focos de queimada:', error);
      }
    );
  }

  // Método para carregar os focos de queimada filtrados por período e cidade
  getFocusByPeriodCity(start: string, end: string, code: string) {
    console.log('Filtrando focos:', { start, end, code }); // Log de depuração
    this.focus.getByPeriodCity(start, end, code).subscribe(
      (data) => {
        console.log('Focos filtrados:', data.body); // Log para verificar a resposta da API
        this.focos = data.body || [];
        this.quantidadeFocosFilter = this.focos.length; // Atualiza a quantidade de focos filtrados
        this.map.eachLayer((layer: any) => {
          if (layer instanceof L.Marker) {
            this.map.removeLayer(layer);
          }
        });

        // Adiciona os novos focos ao mapa
        this.focos.forEach((p) => {
          L.marker([p.nrLatitude, p.nrLongitude], { icon: this.iconCustom })
            .addTo(this.map)
            .bindPopup('');
        });
      },
      (error) => {
        console.log('Erro ao filtrar focos de queimada:', error);
      }
    );
  }

  // Limpa os focos de queimada e carregar todos novamente
  clear() {
    this.getAllFocus();
  }

  // Método para filtrar os focos de queimada pela data e cidade selecionadas
  filterCityAndDate() {
    this.showToast = false;
  
    // Verifica se o formulário é válido e pega os valores
    if (this.formFilter.valid) {
      const selectedDate = this.formFilter.get('date')?.value;
      const selectedCityCode = this.formFilter.get('codeCity')?.value;
  
      // Verifica se selectedDate é uma string e converte para Date se necessário
      let dateToSend = selectedDate;
      if (typeof selectedDate === 'string') {
        dateToSend = new Date(selectedDate);
      }
  
      const formattedDate = dateToSend.toISOString().split('T')[0];  // Formato YYYY-MM-DD
      console.log('Data selecionada:', formattedDate); // Log para verificar a data
  
      // Chama o método para obter os focos de queimada filtrados
      this.getFocusByPeriodCity(formattedDate, formattedDate, selectedCityCode);
    } else {
      // Se o formulário for inválido, mostra um toast de erro
      this.showToast = true;
      console.log('Formulário inválido'); // Log para verificar se o formulário é inválido
    }
  }
  
    // Método para limpar o filtro e recarregar todos os focos
  clearFilterAndLoadAll() {
    // Reseta os valores do formulário
    this.formFilter.reset();   
    this.quantidadeFocosFilter = 0; // Atualiza a quantidade de focos para 0
    // Chama o método para recarregar todos os focos de queimada
    this.getAllFocus();
  }

}