import { Injectable } from '@angular/core';
import {
  DadosArmazenados,
  Evento,
  NovoEvento,
  NovoParticipante,
  Participante
} from './eventos.model';

const CHAVE_ARMAZENAMENTO = 'agenda-unijorge.eventos-participantes';

@Injectable({ providedIn: 'root' })
export class EventosService {
  private eventos: Evento[] = [];
  private participantes: Participante[] = [];

  constructor() {
    const dados = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    if (dados) {
      const armazenados = JSON.parse(dados) as DadosArmazenados;
      this.eventos = armazenados.eventos;
      this.participantes = armazenados.participantes;
    }
  }

  listarEventos(): Evento[] {
    return [...this.eventos];
  }

  listarParticipantes(eventoId: number): Participante[] {
    return this.participantes.filter(participante => participante.eventoId === eventoId);
  }

  buscarParticipante(id: number, eventoId: number): Participante | undefined {
    return this.participantes.find(
      participante => participante.id === id && participante.eventoId === eventoId
    );
  }

  salvarEvento(dados: NovoEvento): Evento {
    const evento = { id: this.proximoId(this.eventos), ...dados };
    this.persistir([...this.eventos, evento], this.participantes);
    return evento;
  }

  salvarParticipante(eventoId: number, dados: NovoParticipante, id?: number): void {
    if (!this.eventos.some(evento => evento.id === eventoId)) {
      throw new Error('O evento selecionado não foi encontrado.');
    }

    if (id !== undefined) {
      if (!this.buscarParticipante(id, eventoId)) {
        throw new Error('O participante selecionado não foi encontrado neste evento.');
      }

      const participante: Participante = { id, eventoId, ...dados };
      this.persistir(
        this.eventos,
        this.participantes.map(atual => atual.id === id ? participante : atual)
      );
      return;
    }

    const participante: Participante = {
      id: this.proximoId(this.participantes),
      eventoId,
      ...dados
    };
    this.persistir(this.eventos, [...this.participantes, participante]);
  }

  removerParticipante(id: number, eventoId: number): void {
    this.persistir(
      this.eventos,
      this.participantes.filter(
        participante => participante.id !== id || participante.eventoId !== eventoId
      )
    );
  }

  private persistir(eventos: Evento[], participantes: Participante[]): void {
    const dados = JSON.stringify({ eventos, participantes });
    localStorage.setItem(CHAVE_ARMAZENAMENTO, dados);
    this.eventos = eventos;
    this.participantes = participantes;
  }

  private proximoId(itens: Array<{ id: number }>): number {
    return itens.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
  }
}
