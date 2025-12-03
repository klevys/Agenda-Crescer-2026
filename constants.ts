import { Season } from './types';

export const AGENDA_STRUCTURE: Season[] = [
  {
    name: 'CULTIVO',
    color: 'bg-green-100 text-green-800 border-green-200',
    description: 'Tempo de semear e preparar o terreno.',
    months: [
      { name: 'Fevereiro', events: [] },
      { name: 'Março', events: [] },
      { name: 'Abril', events: [] }
    ]
  },
  {
    name: 'CUIDADO',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Tempo de zelar e fortalecer as raízes.',
    months: [
      { name: 'Maio', events: [] },
      { name: 'Junho', events: [] },
      { name: 'Julho', events: [] }
    ]
  },
  {
    name: 'CRESCIMENTO',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    description: 'Tempo de expansão e colheita.',
    months: [
      { name: 'Agosto', events: [] },
      { name: 'Setembro', events: [] },
      { name: 'Outubro', events: [] }
    ]
  },
  {
    name: 'CELEBRAÇÃO',
    color: 'bg-red-100 text-red-800 border-red-200',
    description: 'Tempo de gratidão e festa.',
    months: [
      { name: 'Novembro', events: [] },
      { name: 'Dezembro', events: [] },
      { name: 'Janeiro 2027', events: [] }
    ]
  }
];