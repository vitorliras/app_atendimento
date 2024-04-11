export interface Senha {
  id?: number;
  tipoSenha: string;
  dataHoraEmissao: Date | null;
  dataHoraAtendimento: Date | null;
  statusAtendimento: string;
  guicheId?: number;
  numeroSenha: string;
}
