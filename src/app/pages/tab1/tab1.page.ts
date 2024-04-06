import { Component } from '@angular/core';
import { SenhasService } from '../../shared/services/senhas.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(public senhaService: SenhasService) {}
  inputNovaSenha: string = 'YYMMDD-0000';

  gerarSenha(tipo: string): void {
    const data = new Date();
    const ano = data.getFullYear().toString().slice(2);
    const mes = ('0' + (data.getMonth() + 1)).slice(-2);
    const dia = ('0' + data.getDate()).slice(-2);
    const tipoSenha = tipo === 'geral' ? 'SG' : tipo === 'exame' ? 'SE' : 'SP';

    let sequencia = localStorage.getItem(`${tipo}_sequencia`);
    if (!sequencia) {
      sequencia = '0';
    } else {
      sequencia = String(parseInt(sequencia) + 1);
    }
    localStorage.setItem(`${tipo}_sequencia`, sequencia);

    this.inputNovaSenha = `${ano}${mes}${dia}-${tipoSenha}${sequencia}`;

    const novaSenha = {
      tipoSenha: tipoSenha,
      dataHoraEmissao: data,
      dataHoraAtendimento: null,
      statusAtendimento: 'Pendente',
      guicheId: 0,
      numeroSenha: this.inputNovaSenha
    };


    this.senhaService.addSenha(novaSenha).subscribe(() => {
      console.log('Nova senha adicionada com sucesso.');
    }, error => {
      console.error('Erro ao adicionar nova senha:', error);
    });
  }
}
