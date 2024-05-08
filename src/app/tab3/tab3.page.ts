import { NgFor } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import {
  PoDividerModule,
  PoPageModule,
  PoWidgetModule,
} from '@po-ui/ng-components';
import { StorageService } from '../auth/services/storage.service';
import { Router } from '@angular/router';
import { ThemeService } from '../shared/services/theme.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    PoPageModule,
    PoDividerModule,
    PoWidgetModule,
    NgFor,
  ],
})
export class Tab3Page implements OnInit {
  constructor() {}

  private info: any;
  private isLoggedIn = false;
  private router = inject(Router);
  private storageService = inject(StorageService);
  private themeService = inject(ThemeService);
  public widgets: any[] = [];

  ionViewWillEnter() {
    if (this.storageService.getTheme() === 'dark') {
      this.themeService.applyDark();
    } else {
      this.themeService.removeDark();
    }
  }

  /**
   * Navigates to the specified path.
   *
   * @param {string} path - The path to navigate to.
   * @return {void} This function does not return anything.
   */
  navigate(path: string): void {
    this.router.navigate([path]);
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.info = this.storageService.getUser();
    if (
      this.info.permissions.find(
        (permission: any) => permission.app === 'Admin'
      )
    ) {
      this.widgets.push({
        value: 1,
        label: 'Painel de Administrador',
        shortLabel: 'Admin',
        subItems: [],
      });
    }
    if (
      this.info.permissions.find((permission: any) => permission.app === 'Kpi')
    ) {
      this.widgets.push({
        value: 3,
        label: 'KPI - Indicadores de desempenho',
        shortLabel: 'Kpi',
        subItems: [],
      });
    }
    if (
      this.info.permissions.find(
        (permission: any) => permission.app === 'Portaria'
      )
    ) {
      this.widgets.push({
        value: 2,
        label: 'Controle de Entrada e Saída de Veículos',
        shortLabel: 'Portaria',
        subItems: [],
      });
    }
    if (
      this.info.permissions.find((permission: any) => permission.app === 'Rv')
    ) {
      this.widgets.push({
        value: 4,
        label: 'RV - Remuneração Variável',
        shortLabel: 'Rv',
        subItems: [],
      });
    }
    if (
      this.info.permissions.find(
        (permission: any) => permission.app === 'Orc_Custo'
      )
    ) {
      this.widgets.push({
        value: 5,
        label: 'Orçamento E Custo',
        shortLabel: 'Orc_Custo',
        subItems: [],
      });
    }
    if (
      this.info.permissions.find(
        (permission: any) => permission.app === 'Bonus'
      )
    ) {
      this.widgets.push({
        value: 6,
        label: 'Bônus',
        shortLabel: 'Bonus',
        subItems: [],
      });
    }
    this.info.permissions.forEach((permission: any) => {
      let value = 1;
      let index = this.widgets.findIndex(
        (menu: any) => menu.shortLabel === permission.app
      );
      let nome = this.setNome(permission.name);
      this.widgets[index].subItems?.push({
        value: value,
        label: nome,
        link: permission.path,
        dateAdd: permission.dateAdd,
      });
      value++;
    });
  }

  setNome(name: string) {
    switch (name) {
      case 'Apurações':
        return 'Apuração - Fechamento';
      case 'Colaboradores':
        return 'Colaborador x Função x Volante/Equipe Erradicação';
      case 'Faixas De Preço':
        return 'Erradicação - Faixa De Preço';
      case 'Percentuais':
        return 'Erradicação - % Por Função';
      case 'Relacionar Centro De Custo':
        return 'Relacionar - Centro De Custo x Departamento';
      case 'Relacionar Operação Agrícola':
        return 'Relacionar - Operação Agrícola x Departamento';
      case 'Relacionar Recurso':
        return 'Relacionar - Recurso x Departamento';
      case 'View Centro De Custo':
        return 'Centro Custo x Depto x Op. Agr. x Recurso';
      case 'Fator Correção':
        return 'Fator Correção - Colaborador';
      case 'Os Erradicacao':
        return 'Erradicação - OS x Equipe de Erradicação';
      case 'Bonus Grind':
        return 'Bônus - Grupo Indicador';
      case 'Bonus Area':
        return 'Bônus - Áreas';
      case 'Bonus Painel':
        return 'Bônus - Painéis';
      case 'Bonus Revisão':
        return 'Bônus - Revisão';
      case 'Bonus Componente':
        return 'Bônus - Componentes';
      case 'Bonus Indicador Componente':
        return 'Bônus - Indicador / Componente';
      case 'Bonus Revisao Mes':
        return 'Bônus - Revisão Mensal';
      case 'Bonus Fechamento':
        return 'Bônus - Fechamento';
      case 'Bi Fechamento':
        return 'Carga de Versão (ETL)';
      case 'Funcionarios Excluidos':
        return 'RV - Funcionários Excluídos do Cálculo';
      default:
        return name;
    }
  }
}
