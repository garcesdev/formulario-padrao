import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Evento, FormaDePagamento, NovoEvento, NovoParticipante, Participante } from './eventos.model';
import { EventosService } from './eventos.service';

@Component({
  selector: 'app-eventos',
  imports: [FormsModule],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css'
})
export class Eventos {
  readonly formasDePagamento: Array<{ valor: FormaDePagamento; rotulo: string }> = [
    { valor: 'pix', rotulo: 'Pix' },
    { valor: 'cartao', rotulo: 'Cartão' },
    { valor: 'dinheiro', rotulo: 'Dinheiro' },
    { valor: 'transferencia', rotulo: 'Transferência' },
    { valor: 'outro', rotulo: 'Outro' }
  ];

  eventos: Evento[];
  eventoSelecionadoId: number | null = null;
  rascunhoEvento: NovoEvento = this.eventoEmBranco();
  rascunhoParticipante: NovoParticipante = this.participanteEmBranco();
  participanteEmEdicaoId: number | null = null;
  mensagemErro = '';

  constructor(private readonly eventosService: EventosService) {
    this.eventos = this.eventosService.listarEventos();
  }

  get eventoSelecionado(): Evento | undefined {
    return this.eventos.find(evento => evento.id === this.eventoSelecionadoId);
  }

  get participantes(): Participante[] {
    return this.eventoSelecionadoId === null
      ? []
      : this.eventosService.listarParticipantes(this.eventoSelecionadoId);
  }

  cadastrarEvento(): void {
    this.mensagemErro = '';
    try {
      const evento = this.eventosService.salvarEvento({ ...this.rascunhoEvento });
      this.eventos = this.eventosService.listarEventos();
      this.eventoSelecionadoId = evento.id;
      this.rascunhoEvento = this.eventoEmBranco();
    } catch (erro) {
      this.mensagemErro = this.mensagemDoErro(erro);
    }
  }

  selecionarEvento(id: number): void {
    this.eventoSelecionadoId = id;
    this.cancelarEdicao();
  }

  salvarParticipante(): void {
    if (this.eventoSelecionadoId === null) {
      return;
    }

    this.mensagemErro = '';
    try {
      this.eventosService.salvarParticipante(
        this.eventoSelecionadoId,
        { ...this.rascunhoParticipante },
        this.participanteEmEdicaoId ?? undefined
      );
      this.cancelarEdicao();
    } catch (erro) {
      this.mensagemErro = this.mensagemDoErro(erro);
    }
  }

  editarParticipante(participante: Participante): void {
    this.rascunhoParticipante = {
      descricao: participante.descricao,
      email: participante.email,
      telefone: participante.telefone,
      formaPagamento: participante.formaPagamento
    };
    this.participanteEmEdicaoId = participante.id;
  }

  excluirParticipante(id: number): void {
    if (this.eventoSelecionadoId === null) {
      return;
    }

    this.mensagemErro = '';
    try {
      this.eventosService.removerParticipante(id, this.eventoSelecionadoId);
      if (this.participanteEmEdicaoId === id) {
        this.cancelarEdicao();
      }
    } catch (erro) {
      this.mensagemErro = this.mensagemDoErro(erro);
    }
  }

  cancelarEdicao(): void {
    this.participanteEmEdicaoId = null;
    this.rascunhoParticipante = this.participanteEmBranco();
  }

  private eventoEmBranco(): NovoEvento {
    return { nome: '', data: '', local: '' };
  }

  private participanteEmBranco(): NovoParticipante {
    return { descricao: '', email: '', telefone: '', formaPagamento: 'pix' };
  }

  private mensagemDoErro(erro: unknown): string {
    return erro instanceof Error ? erro.message : 'Não foi possível salvar os dados.';
  }
}
