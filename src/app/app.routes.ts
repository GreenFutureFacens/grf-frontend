import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { SaibaMaisComponent } from './saiba-mais/saiba-mais.component';  // Importando o novo componente

export const routes: Routes = [
  { path: '', component: MapComponent }, // Rota da página inicial
  { path: 'saiba-mais', component: SaibaMaisComponent }, // Rota para a página Saiba Mais
];