import { AgendaCalendarComponent } from './calendar/calendar.component';
import { AgendaCalendarDisplayByMonthComponent } from './display-by-month/display-by-month.component';
import { AgendaCalendarDisplayByDayComponent } from './display-by-day/display-by-day.component';
import { AgendaCalendarDisplayByYearComponent } from './display-by-year/display-by-year.component';
import { AgendaCalendarDisplayByWeekComponent } from './display-by-week/display-by-week.component';
import { AgendaCalendarPlanningDisplayComponent } from './planning-display/planning-display.component';

export const pages: any[] = [
    AgendaCalendarComponent,
    AgendaCalendarDisplayByMonthComponent,
    AgendaCalendarDisplayByDayComponent,
    AgendaCalendarDisplayByYearComponent,
    AgendaCalendarDisplayByWeekComponent,
    AgendaCalendarPlanningDisplayComponent
];

export * from './calendar/calendar.component';
export * from './display-by-month/display-by-month.component';
export * from './display-by-day/display-by-day.component';
export * from './display-by-year/display-by-year.component';
export * from './display-by-week/display-by-week.component';
export * from './planning-display/planning-display.component';
