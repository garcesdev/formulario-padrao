import { Component } from '@angular/core';

@Component({
  selector: 'app-pessoa',
  templateUrl: './pessoa.html',
  styleUrl: './pessoa.css'
})
export class Pessoa {
  nome = 'Ana Souza';
  curso = 'Engenharia de Computação';
  email = 'ana@exemplo.com';
}
