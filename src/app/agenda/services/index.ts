import { CalendarService } from './calendar.service';
import { EventsService } from './events.service';
import { DisplayService } from './display.service';
import { DateHelpersService } from './date-helpers.service';

export const services: any[] = [
    CalendarService,
    EventsService,
    DisplayService,
    DateHelpersService
];

export * from './calendar.service';
export * from './events.service';
export * from './display.service';
export * from './date-helpers.service';
