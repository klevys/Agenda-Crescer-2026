import { Season, MonthData, Event } from '../types';
import { AGENDA_STRUCTURE } from '../constants';

interface ParsedEvent {
  date: Date;
  endDate?: Date;
  title: string;
  description?: string;
}

// Helper to clean up ICS date strings (e.g., 20260201T120000Z)
const parseICSDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  // Handle YYYYMMDD format (All day) or YYYYMMDDThhmmss
  const cleanStr = dateStr.replace('VALUE=DATE:', '').replace('TZID=:', ''); // Basic cleanup
  const year = parseInt(cleanStr.substring(0, 4));
  const month = parseInt(cleanStr.substring(4, 6)) - 1;
  const day = parseInt(cleanStr.substring(6, 8));
  
  if (isNaN(year)) return null;
  return new Date(year, month, day);
};

export const parseICSFile = async (file: File): Promise<Season[]> => {
  const text = await file.text();
  const lines = text.split(/\r\n|\n|\r/);
  const events: ParsedEvent[] = [];
  
  let currentEvent: Partial<ParsedEvent> | null = null;

  for (const line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) {
      currentEvent = {};
    } else if (line.startsWith('END:VEVENT')) {
      if (currentEvent && currentEvent.date && currentEvent.title) {
        events.push(currentEvent as ParsedEvent);
      }
      currentEvent = null;
    } else if (currentEvent) {
      if (line.startsWith('SUMMARY:')) {
        currentEvent.title = line.substring(8);
      } else if (line.startsWith('DTSTART')) {
        const datePart = line.split(':')[1];
        currentEvent.date = parseICSDate(datePart) || new Date();
      } else if (line.startsWith('DTEND')) {
         const datePart = line.split(':')[1];
         currentEvent.endDate = parseICSDate(datePart) || undefined;
      }
    }
  }

  return mapEventsToSeasons(events);
};

const mapEventsToSeasons = (importedEvents: ParsedEvent[]): Season[] => {
  // Deep copy the initial structure to preserve seasons/colors/descriptions
  const newSeasons: Season[] = JSON.parse(JSON.stringify(AGENDA_STRUCTURE));

  // Clear existing events to avoid duplication or keep them? 
  // Let's clear the default ones and populate only with imported + existing logic if needed.
  // For this implementation, we will CLEAR the hardcoded events and fill with imported ones
  // to give the user full control via their calendar.
  newSeasons.forEach(s => s.months.forEach(m => m.events = []));

  importedEvents.forEach(evt => {
    const monthIndex = evt.date.getMonth(); // 0-11
    const year = evt.date.getFullYear();
    const day = evt.date.getDate();

    // Determine day string (ranges if multi-day)
    let dayStr = day.toString().padStart(2, '0');
    if (evt.endDate) {
        // Simple logic: if end date is different day
        const endDay = evt.endDate.getDate();
        if (endDay !== day && evt.endDate > evt.date) {
             // ICS end date is usually exclusive, so subtract 1 day if it's midnight
             // Simplified for this visualizer:
             if (endDay !== day + 1) { // If it's more than 1 day difference
                dayStr = `${day.toString().padStart(2, '0')}-${(endDay - 1).toString().padStart(2, '0')}`;
             }
        }
    }

    // Determine Type based on keywords
    let type: 'church' | 'holiday' | 'special' = 'church';
    const lowerTitle = evt.title.toLowerCase();
    if (lowerTitle.includes('feriado') || lowerTitle.includes('natal') || lowerTitle.includes('ano novo')) {
        type = 'holiday';
    } else if (lowerTitle.includes('festa') || lowerTitle.includes('face a face') || lowerTitle.includes('acamp')) {
        type = 'special';
    }

    const newEventObj: Event = {
        day: dayStr,
        title: evt.title,
        type: type
    };

    // Find where to put this event
    // Map Month Index to Season Index and Month Name
    // 0(Jan)-11(Dec)
    // Cultivo: Feb(1), Mar(2), Apr(3)
    // Cuidado: May(4), Jun(5), Jul(6)
    // Crescimento: Aug(7), Sep(8), Oct(9)
    // Celebração: Nov(10), Dec(11), Jan(0 - NEXT YEAR)

    let targetSeasonIdx = -1;
    let targetMonthName = '';

    if ([1, 2, 3].includes(monthIndex)) { // Feb-Apr
        targetSeasonIdx = 0; 
    } else if ([4, 5, 6].includes(monthIndex)) { // May-Jul
        targetSeasonIdx = 1;
    } else if ([7, 8, 9].includes(monthIndex)) { // Aug-Oct
        targetSeasonIdx = 2;
    } else if ([10, 11, 0].includes(monthIndex)) { // Nov-Jan
        targetSeasonIdx = 3;
    }

    if (targetSeasonIdx !== -1) {
        // Find the month object in that season
        // Note: Our constants use names like "Fevereiro", "Março".
        // We need to match loosely.
        const monthNamesPT = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        const currentMonthName = monthNamesPT[monthIndex];
        
        // Special case for Jan 2027 in Celebration season
        if (monthIndex === 0 && year !== 2027 && targetSeasonIdx === 3) {
            // Skip Jan 2026 if it belongs to Celebration (which is usually end of year)
            // But wait, our structure has Jan/2027.
             return; 
        }

        const season = newSeasons[targetSeasonIdx];
        const monthData = season.months.find(m => m.name.includes(currentMonthName));
        
        if (monthData) {
            monthData.events.push(newEventObj);
            // Sort by day
            monthData.events.sort((a, b) => parseInt(a.day) - parseInt(b.day));
        }
    }
  });

  return newSeasons;
};