import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importando o CommonModule

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule], // Adicione o CommonModule aqui
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  isOpen: boolean = false;

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}