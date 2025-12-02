import { Season } from './types';

export const AGENDA_DATA: Season[] = [
  {
    name: 'CULTIVO',
    color: 'bg-green-100 text-green-800 border-green-200',
    description: 'Tempo de semear e preparar o terreno.',
    months: [
      {
        name: 'Fevereiro',
        events: [
          { day: '01', title: 'Retorno Trilhar', type: 'church' },
          { day: '06', title: 'Vigília - Rede Viva', type: 'church' },
          { day: '08', title: 'Encontro de Líderes - Administrativo', type: 'church' },
          { day: '14-17', title: 'Acamp Connect - Chácara Maanaim', type: 'special' },
          { day: '16-17', title: 'Feriado de Carnaval', type: 'holiday' },
          { day: '19-21', title: 'Seminário de Liberdade Espiritual', type: 'church' },
          { day: '28', title: 'Festa da Passagem', type: 'special' },
        ]
      },
      {
        name: 'Março',
        events: [
          { day: '06', title: 'Vigília - Rede Atos', type: 'church' },
          { day: '08', title: 'Encontro de Líderes - Inspirativo Mulheres', type: 'church' },
          { day: '19', title: 'Feriado (Padroeira de Palmas)', type: 'holiday' },
          { day: '20-22', title: 'Face a Face', type: 'special' },
        ]
      },
      {
        name: 'Abril',
        events: [
          { day: '04', title: 'Feriado Paixão de Cristo', type: 'holiday' },
          { day: '10', title: 'Vigília - Rede Moving', type: 'church' },
          { day: '12', title: 'Encontro de Líderes - Administrativo', type: 'church' },
          { day: '16-18', title: 'Casa do Julgamento', type: 'special' },
          { day: '21', title: 'Tiradentes', type: 'holiday' },
          { day: '23-25', title: 'Casa do Julgamento', type: 'special' },
        ]
      }
    ]
  },
  {
    name: 'CUIDADO',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Tempo de zelar e fortalecer as raízes.',
    months: [
      {
        name: 'Maio',
        events: [
          { day: '01', title: 'Aniversário Crescer / Dia do Trabalho', type: 'special' },
          { day: '08', title: 'Vigília - Rede Connect', type: 'church' },
          { day: '10', title: 'Encontro de Líderes - Inspirativo Homens', type: 'church' },
          { day: '20', title: 'Feriado Aniversário de Palmas', type: 'holiday' },
          { day: '22-24', title: 'Face a Face', type: 'special' },
          { day: '30', title: 'Aniversário do Lar Batista FF Soren', type: 'special' },
        ]
      },
      {
        name: 'Junho',
        events: [
          { day: '04', title: 'Feriado Corpus Christi', type: 'holiday' },
          { day: '14', title: 'Encontro de Líderes - Administrativo (Dia do Pastor)', type: 'church' },
          { day: '19-21', title: 'Face a Face', type: 'special' },
        ]
      },
      {
        name: 'Julho',
        events: [
          { day: '03', title: 'Vigília - Rede Viver', type: 'church' },
          { day: '31-02', title: 'Face a Face', type: 'special' },
        ]
      }
    ]
  },
  {
    name: 'CRESCIMENTO',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    description: 'Tempo de expansão e colheita.',
    months: [
      {
        name: 'Agosto',
        events: [
          { day: '01-02', title: 'Face a Face (Cont.)', type: 'special' },
          { day: '02', title: 'Retorno do Trilhar', type: 'church' },
          { day: '07', title: 'Vigília - Rede Viva', type: 'church' },
          { day: '09', title: 'Encontro de Líderes - Administrativo', type: 'church' },
          { day: '13-15', title: 'Conferência Crescer (Semana da Visão)', type: 'special' },
          { day: '29', title: 'Festa da Passagem', type: 'special' },
        ]
      },
      {
        name: 'Setembro',
        events: [
          { day: '04', title: 'Vigília Rede Viva', type: 'church' },
          { day: '07', title: 'Independência do Brasil', type: 'holiday' },
          { day: '08', title: 'Padroeira do Tocantins', type: 'holiday' },
        ]
      },
      {
        name: 'Outubro',
        events: [
          { day: '04', title: 'Início Divulgação Aqui Tem Luz', type: 'church' },
          { day: '05', title: 'Criação do Tocantins', type: 'holiday' },
          { day: '10', title: 'Pic Nic do Trilhar', type: 'special' },
          { day: '12', title: 'Padroeira do Brasil', type: 'holiday' },
          { day: '18', title: 'Encontro de Líderes - Inspirativo Homens', type: 'church' },
          { day: '23-25', title: 'Face a Face', type: 'special' },
          { day: '31', title: 'Aqui Tem Luz', type: 'special' },
        ]
      }
    ]
  },
  {
    name: 'CELEBRAÇÃO',
    color: 'bg-red-100 text-red-800 border-red-200',
    description: 'Tempo de gratidão e festa.',
    months: [
      {
        name: 'Novembro',
        events: [
          { day: '02', title: 'Finados', type: 'holiday' },
          { day: '06', title: 'Vigília', type: 'church' },
          { day: '08', title: 'Encontro de Líderes - Administrativo', type: 'church' },
          { day: '08', title: 'Aqui Tem Luz (Testemunhos)', type: 'special' },
          { day: '15', title: 'Proclamação da República', type: 'holiday' },
          { day: '20', title: 'Consciência Negra', type: 'holiday' },
          { day: '27-29', title: 'Face a Face', type: 'special' },
        ]
      },
      {
        name: 'Dezembro',
        events: [
          { day: '06', title: 'Festa da Colheita', type: 'special' },
          { day: '12-13', title: 'Musical de Natal', type: 'special' },
          { day: '20', title: 'Culto Natalino', type: 'church' },
          { day: '25', title: 'Natal', type: 'holiday' },
          { day: '31', title: 'Culto da Virada', type: 'special' },
        ]
      },
      {
        name: 'Janeiro 2027',
        events: [
            { day: '01', title: 'Ano Novo', type: 'holiday' }
        ]
      }
    ]
  }
];