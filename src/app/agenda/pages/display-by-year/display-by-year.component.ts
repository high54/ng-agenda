import { Component } from '@angular/core';
// Services
import { DisplayService, CalendarService, DateHelpersService, EventsService } from '../../services';
// Models
import { IAgendaDate } from '../../models/agenda-date.interface';
// Angular Material
import { MatDialog } from '@angular/material/dialog';
// Dialog Component for the Modal
import { AgendaEventsDetailsComponent } from '../../components';

@Component({
    selector: 'app-agenda-calendar-display-by-year',
    styleUrls: ['display-by-year.component.scss'],
    templateUrl: 'display-by-year.component.html',
})
export class AgendaCalendarDisplayByYearComponent {
    constructor(
        public dialog: MatDialog,
        private displayService: DisplayService,
        private calendarService: CalendarService,
        private helpers: DateHelpersService,
        private eventService: EventsService,
    ) { }
    public getNameOfMonth(index: number): string {
        return this.displayService.nameOfMonth(index);
    }
    public getWeeksNumbers(startIndex: number): string[] {
        return this.weeksNumbers[startIndex];
    }
    public isToday(calendarDay: IAgendaDate): boolean {
        return this.helpers.isToday(calendarDay);
    }
    public thisMonth(index: number): boolean {
        const date = new Date();
        return date.getMonth() === index;
    }
    public showEvents(date: IAgendaDate): void {
        date.events = this.eventService.getEvent(new Date(date.year, date.month, date.day));
        const dialogRef = this.dialog.open(AgendaEventsDetailsComponent, {
            width: '10%',
            data: date
        });
        dialogRef.afterClosed().subscribe();
    }
    get firstLetterInNameOfDaysShort(): string[] {
        return this.displayService.firstLetterInNameOfDaysShort();
    }
    get fullYear(): any[] {
        return this.calendarService.getCalendarFullYear();
    }
    get weeksNumbers(): any[] {
        return this.calendarService.weeksNumbers;
    }
}
