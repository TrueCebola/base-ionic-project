import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-senha-expirada',
  templateUrl: './senha-expirada.page.html',
  styleUrls: ['./senha-expirada.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SenhaExpiradaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
