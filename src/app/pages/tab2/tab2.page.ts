import { Component, OnDestroy, OnInit } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';
import { Guiche } from 'src/app/shared/model/guiche';
import { Senha } from 'src/app/shared/model/senha';
import { GuicheService } from 'src/app/shared/services/guiche.service';
import { SenhasService } from 'src/app/shared/services/senhas.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements ViewDidEnter, OnInit, OnDestroy{
  senhas: Senha[] = [];
  guiches: Guiche[] = [];
  intervalos: any[] = [];

  senha!: Senha;
  temporizador: any;

  constructor(
    private senhaService: SenhasService,
    private guicheService: GuicheService
  ) {}

  ngOnInit(): void {
    this.listarGuiche();
  }

  ngOnDestroy(): void {
    this.intervalos.forEach(intervalo => clearInterval(intervalo));
  }

  ionViewDidEnter(): void {
    this.listarProximas5Senhas();
  }

  listarProximas5Senhas() {
    this.senhaService.getAllNextFiveSenhas().subscribe((senhas) => {
      this.senha = senhas[0];
      senhas.shift();
      this.senhas = senhas;
    });
  }

  listarGuiche() {
    this.guicheService.getAllGuiches().subscribe((guiches) => {
      this.guiches = guiches;
    });
  }

  gerarTemporizador(tipo: string): number {
    let tempo: number;
    switch (tipo) {
      case "SG":
        tempo = Math.floor(Math.random() * 13) + 2;
        break;
      case "SP":
        tempo = Math.floor(Math.random() * 3) + 2;
        break;
      case "SE":
        tempo = Math.floor(Math.random() * 2) + 2;
        break;
      default:
        tempo = 0;
    }
    return tempo;
  }



  atender(senha: Senha) {
    const guicheDisponivel = this.guiches.find(guiche => guiche.statusDisponibilidade === 'D');
    if (guicheDisponivel) {
      guicheDisponivel.statusDisponibilidade = 'I';
      this.guicheService.updateGuiche(guicheDisponivel)
      guicheDisponivel.tempo = this.gerarTemporizador(senha.tipoSenha);
      const intervalo = setInterval(() => {
        if(guicheDisponivel.tempo){
        guicheDisponivel.tempo--;
        if (guicheDisponivel.tempo <= 0) {
          clearInterval(intervalo);
          guicheDisponivel.statusDisponibilidade = 'D';
        }
      }
      }, 1000);
      this.intervalos.push(intervalo);
    }
  }

  guichesDisponiveis(): boolean {
    return !this.guiches.some(guiche => guiche.statusDisponibilidade === 'D');
  }

}

