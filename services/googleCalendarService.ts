import { GOOGLE_API_KEY, GOOGLE_CALENDAR_ID } from '../config';
import { Season } from '../types';
import { AGENDA_STRUCTURE } from '../constants';

interface GoogleCalendarEvent {
  summary: string;
  start: { date?: string; dateTime?: string };
  end: { date?: string; dateTime?: string };
}

interface GoogleCalendarResponse {
  items: GoogleCalendarEvent[];
}

// Helper para determinar o tipo de evento baseado no título
const getEventType = (title: string): 'church' | 'holiday' | 'special' => {
  const lowerTitle = (title || '').toLowerCase();
  if (lowerTitle.includes('feriado') || lowerTitle.includes('natal') || lowerTitle.includes('ano novo') || lowerTitle.includes('paixão') || lowerTitle.includes('independência') || lowerTitle.includes('padroeira')) {
    return 'holiday';
  } else if (lowerTitle.includes('festa') || lowerTitle.includes('face a face') || lowerTitle.includes('conferência') || lowerTitle.includes('encontro') || lowerTitle.includes('acamp')) {
    return 'special';
  }
  return 'church';
};

// Helper crítico para extrair data sem influência do Fuso Horário (Timezone) do navegador
// Converte "2026-02-01" diretamente para { year: 2026, month: 1, day: 1 }
const extractDateComponents = (dateStr: string) => {
    if (!dateStr) return null;
    
    // Se for formato ISO com hora (2026-02-01T10:00:00-03:00)
    if (dateStr.includes('T')) {
        const dateObj = new Date(dateStr);
        return {
            year: dateObj.getFullYear(),
            month: dateObj.getMonth(), // 0-11
            day: dateObj.getDate()
        };
    }

    // Se for formato apenas data (2026-02-01) - Evento de Dia Inteiro
    const parts = dateStr.split('-');
    return {
        year: parseInt(parts[0]),
        month: parseInt(parts[1]) - 1, // Ajusta para 0-11
        day: parseInt(parts[2])
    };
};

export const fetchGoogleEvents = async (): Promise<Season[]> => {
  if (!GOOGLE_API_KEY || !GOOGLE_CALENDAR_ID || GOOGLE_API_KEY.includes('COLE_SUA')) {
    console.warn("Configuração da API do Google pendente ou incompleta.");
    return JSON.parse(JSON.stringify(AGENDA_STRUCTURE));
  }

  // Pegamos uma margem de segurança nas datas para garantir que eventos nas bordas venham
  const timeMin = new Date('2026-01-01').toISOString();
  const timeMax = new Date('2027-02-28').toISOString();

  const cleanCalendarId = GOOGLE_CALENDAR_ID.trim();
  const cleanApiKey = GOOGLE_API_KEY.trim();

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cleanCalendarId)}/events?key=${cleanApiKey}&singleEvents=true&orderBy=startTime&timeMin=${timeMin}&timeMax=${timeMax}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Google Calendar API Error: ${response.status}`);
      return JSON.parse(JSON.stringify(AGENDA_STRUCTURE));
    }

    const data: GoogleCalendarResponse = await response.json();
    return mapGoogleEventsToSeasons(data.items || []);
  } catch (error) {
    console.error("Erro ao processar agenda:", error);
    return JSON.parse(JSON.stringify(AGENDA_STRUCTURE));
  }
};

const mapGoogleEventsToSeasons = (items: GoogleCalendarEvent[]): Season[] => {
  const newSeasons: Season[] = JSON.parse(JSON.stringify(AGENDA_STRUCTURE));

  // Limpa eventos anteriores para garantir que não duplique se recarregar
  newSeasons.forEach(s => s.months.forEach(m => m.events = []));

  items.forEach(item => {
    const startStr = item.start.date || item.start.dateTime;
    if (!startStr) return;

    const start = extractDateComponents(startStr);
    if (!start) return;

    // Lógica de Mapeamento de Estações (Rígida por Ano/Mês)
    let seasonIndex = -1;

    // Ano 2026
    if (start.year === 2026) {
        if (start.month >= 1 && start.month <= 3) seasonIndex = 0; // Fev, Mar, Abr -> Cultivo
        else if (start.month >= 4 && start.month <= 6) seasonIndex = 1; // Mai, Jun, Jul -> Cuidado
        else if (start.month >= 7 && start.month <= 9) seasonIndex = 2; // Ago, Set, Out -> Crescimento
        else if (start.month >= 10) seasonIndex = 3; // Nov, Dez -> Celebração
    } 
    // Ano 2027 (Apenas Janeiro)
    else if (start.year === 2027) {
        if (start.month === 0) seasonIndex = 3; // Jan 2027 -> Celebração
    }

    // Se não caiu em nenhuma estação (ex: Jan 2026 ou depois de Jan 2027), ignora
    if (seasonIndex === -1) return;

    const season = newSeasons[seasonIndex];
    const monthNamesPT = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const eventMonthName = monthNamesPT[start.month];
    
    // Encontra o mês correto dentro da estação
    const targetMonth = season.months.find(m => m.name.includes(eventMonthName));

    if (targetMonth) {
        // Formatação do Dia (Intervalo)
        let dayStr = start.day.toString().padStart(2, '0');

        // Verifica se tem data final
        const endStr = item.end?.date || item.end?.dateTime;
        if (endStr) {
            const end = extractDateComponents(endStr);
            if (end) {
                // Ajuste para eventos "Dia Inteiro": o Google retorna a data final como o dia seguinte (exclusivo).
                // Ex: Festa dia 01 a 03. Google manda Start: 01, End: 04.
                // Precisamos subtrair 1 dia do End se for "date" (sem hora).
                
                let visibleEndDay = end.day;
                let visibleEndMonth = end.month;

                if (item.end.date) {
                    // Recria data JS apenas para subtrair dia com segurança (mudança de mês etc)
                    const d = new Date(end.year, end.month, end.day);
                    d.setDate(d.getDate() - 1);
                    visibleEndDay = d.getDate();
                    visibleEndMonth = d.getMonth();
                }

                // Se o fim (ajustado) for diferente do início, exibe intervalo
                // Exibimos intervalo se mudar o dia E se não for o mesmo dia (para eventos de 1 dia)
                const isSameDay = (start.day === visibleEndDay && start.month === visibleEndMonth);
                
                if (!isSameDay) {
                     dayStr = `${dayStr}-${visibleEndDay.toString().padStart(2, '0')}`;
                }
            }
        }

        targetMonth.events.push({
            day: dayStr,
            title: item.summary || 'Evento',
            type: getEventType(item.summary)
        });
    }
  });

  // Reordena eventos por dia dentro de cada mês
  newSeasons.forEach(s => {
    s.months.forEach(m => {
        m.events.sort((a, b) => {
            const dayA = parseInt(a.day.split('-')[0]);
            const dayB = parseInt(b.day.split('-')[0]);
            return dayA - dayB;
        });
    });
  });

  return newSeasons;
};
