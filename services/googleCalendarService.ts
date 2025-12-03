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

export const fetchGoogleEvents = async (): Promise<Season[]> => {
  if (!GOOGLE_API_KEY || !GOOGLE_CALENDAR_ID) {
    console.error("Configuração da API do Google incompleta.");
    throw new Error("Chave de API ou ID do Calendário ausentes.");
  }

  const timeMin = new Date('2026-01-01').toISOString();
  const timeMax = new Date('2027-02-01').toISOString();

  const cleanCalendarId = GOOGLE_CALENDAR_ID.trim();
  const cleanApiKey = GOOGLE_API_KEY.trim();

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cleanCalendarId)}/events?key=${cleanApiKey}&singleEvents=true&orderBy=startTime&timeMin=${timeMin}&timeMax=${timeMax}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Erro na API do Google:", errorBody);
      throw new Error(`Erro ao buscar agenda: ${response.status}`);
    }

    const data: GoogleCalendarResponse = await response.json();
    return mapGoogleEventsToSeasons(data.items || []);
  } catch (error) {
    console.error("Falha fatal na integração:", error);
    // Retorna a estrutura vazia em vez de null para não quebrar a UI, mas loga o erro
    return JSON.parse(JSON.stringify(AGENDA_STRUCTURE));
  }
};

const mapGoogleEventsToSeasons = (items: GoogleCalendarEvent[]): Season[] => {
  // Clona a estrutura vazia
  const newSeasons: Season[] = JSON.parse(JSON.stringify(AGENDA_STRUCTURE));

  items.forEach(item => {
    const dateStr = item.start.date || item.start.dateTime;
    if (!dateStr) return;

    const date = new Date(dateStr);
    const monthIndex = date.getMonth(); // 0 = Jan, 1 = Fev...
    const day = date.getDate();
    const title = item.summary || 'Evento sem título';

    // Regras de Estações:
    // Fev(1) - Abr(3): CULTIVO (Index 0)
    // Mai(4) - Jul(6): CUIDADO (Index 1)
    // Ago(7) - Out(9): CRESCIMENTO (Index 2)
    // Nov(10) - Jan(0): CELEBRAÇÃO (Index 3)

    let seasonIndex = -1;

    if (monthIndex >= 1 && monthIndex <= 3) {
      seasonIndex = 0; // CULTIVO
    } else if (monthIndex >= 4 && monthIndex <= 6) {
      seasonIndex = 1; // CUIDADO
    } else if (monthIndex >= 7 && monthIndex <= 9) {
      seasonIndex = 2; // CRESCIMENTO
    } else if (monthIndex >= 10 || monthIndex === 0) {
      seasonIndex = 3; // CELEBRAÇÃO
    }

    if (seasonIndex !== -1) {
      const monthNamesPT = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      
      const eventMonthName = monthNamesPT[monthIndex];
      const season = newSeasons[seasonIndex];
      
      // Encontra o mês correto dentro da estação (ex: Fevereiro dentro de Cultivo)
      // Usamos 'includes' para casar "Fevereiro" com "Fevereiro"
      const targetMonth = season.months.find(m => m.name.includes(eventMonthName));

      if (targetMonth) {
        // Tipagem simples baseada em palavras-chave
        let type: 'church' | 'holiday' | 'special' = 'church';
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('feriado') || lowerTitle.includes('natal') || lowerTitle.includes('ano novo') || lowerTitle.includes('paixão')) {
          type = 'holiday';
        } else if (lowerTitle.includes('festa') || lowerTitle.includes('face a face') || lowerTitle.includes('conferência') || lowerTitle.includes('encontro')) {
          type = 'special';
        }

        // Formatação do dia (Lidar com eventos de múltiplos dias)
        let dayStr = day.toString().padStart(2, '0');
        if (item.end && (item.end.date || item.end.dateTime)) {
            const endDateStr = item.end.date || item.end.dateTime;
            if (endDateStr) {
                const endDate = new Date(endDateStr);
                const diffTime = endDate.getTime() - date.getTime();
                const diffDays = diffTime / (1000 * 3600 * 24);
                
                // Eventos de dia inteiro tem data fim exclusiva (dia seguinte)
                if (item.end.date && diffDays > 1) {
                    const visibleEndDate = new Date(endDate);
                    visibleEndDate.setDate(endDate.getDate() - 1);
                    dayStr = `${dayStr}-${visibleEndDate.getDate().toString().padStart(2, '0')}`;
                } else if (item.end.dateTime && diffDays >= 1) {
                     const visibleEndDate = new Date(endDate);
                     if (visibleEndDate.getDate() !== date.getDate()) {
                         dayStr = `${dayStr}-${visibleEndDate.getDate().toString().padStart(2, '0')}`;
                     }
                }
            }
        }

        targetMonth.events.push({
          day: dayStr,
          title: title,
          type: type
        });
      }
    }
  });

  // Ordenar eventos por dia
  newSeasons.forEach(s => {
    s.months.forEach(m => {
        m.events.sort((a, b) => parseInt(a.day) - parseInt(b.day));
    });
  });

  return newSeasons;
};