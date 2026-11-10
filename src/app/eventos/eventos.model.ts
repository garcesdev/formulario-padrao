export interface Evento {
  id: number;
  nome: string;
  data: string;
  local: string;
}

export type NovoEvento = Omit<Evento, 'id'>;

export type FormaDePagamento = 'pix' | 'cartao' | 'dinheiro' | 'transferencia' | 'outro';

export interface Participante {
  id: number;
  eventoId: number;
  descricao: string;
  email: string;
  telefone: string;
  formaPagamento: FormaDePagamento;
}

export type NovoParticipante = Omit<Participante, 'id' | 'eventoId'>;

export interface DadosArmazenados {
  eventos: Evento[];
  participantes: Participante[];
}
