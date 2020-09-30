import { Component } from '@angular/core';
// Services
import { CalendarService, DisplayService, DateHelpersService, EventsService } from '../../services';
// Models
import { IAgendaDate } from '../../models/agenda-date.interface';
import { IAgendaEvent } from '../../models/agenda-event.interface';
// Angular Material
import { MatDialog } from '@angular/material/dialog';
// Dialog Component for Modal
import { AgendaEventDetailsComponent, AgendaEventsDetailsComponent, AgendaEventFormComponent } from '../../components';

@Component({
    selector: 'agenda-calendar-display-by-month',
    styleUrls: ['display-by-month.component.scss'],
    templateUrl: 'display-by-month.component.html',
})
export class AgendaCalendarDisplayByMonthComponent {
    private drag = false;
    private newEvent: IAgendaEvent;
    constructor(
        public dialog: MatDialog,
        private calendarService: CalendarService,
        private displayService: DisplayService,
        private helpers: DateHelpersService,
        private eventService: EventsService
    ) {
    }
    public mouseDown(e: Event, day: IAgendaDate): void {
        e.preventDefault();
        const element = (e.target as HTMLElement).tagName;
        if (element !== 'SPAN') {
            this.drag = true;
            this.newEvent = {
                startDate: new Date(day.year, day.month, day.day)
            };
            this.newEvent = this.eventService.addEvent(this.newEvent);
            this.calendarService.generateCalendar();
        }
    }
    public mouseMove(e: Event, day: IAgendaDate): void {
        e.preventDefault();
        if (this.drag) {
            document.body.style.cursor = 'move';
            this.newEvent.endDate = new Date(day.year, day.month, day.day);
            this.eventService.updateEvent(this.newEvent);
            this.calendarService.generateCalendar();
        }
    }
    public mouseUp(e: Event, day: IAgendaDate): void {
        e.preventDefault();
        document.body.style.cursor = 'auto';
        if (this.drag) {
            this.drag = false;
            this.newEvent.endDate = new Date(day.year, day.month, day.day);
            this.eventService.updateEvent(this.newEvent);
            this.calendarService.generateCalendar();
            const dialogRef = this.dialog.open(AgendaEventFormComponent, {
                width: '35%',
                data: this.newEvent,
                panelClass: 'backdropBackground'
            });
            dialogRef.afterClosed().subscribe((result: IAgendaEvent) => {
                if (result) {
                    this.eventService.updateEvent(result);
                    this.calendarService.generateCalendar();

                } else {
                    this.eventService.removeEvent(this.newEvent);
                    this.calendarService.generateCalendar();
                    this.newEvent = {};
                }
            });
        }
    }
    public showEvent(eventCal: IAgendaEvent): void {
        const dialogRef = this.dialog.open(AgendaEventDetailsComponent, {
            width: '25%',
            data: eventCal
        });
        dialogRef.afterClosed().subscribe();
    }
    public showAllEvent(day: IAgendaDate): void {
        const dialogRef = this.dialog.open(AgendaEventsDetailsComponent, {
            width: '10%',
            data: day
        });
        dialogRef.afterClosed().subscribe();
    }
    public getTime(eventCal: IAgendaEvent): string {
        if (new Date(eventCal.startDate).getHours() === 0 && new Date(eventCal.startDate).getMinutes() === 0) {
            return ``;
        }
        return `${('0'
            + new Date(eventCal.startDate).getHours()).slice(-2)}:${('0'
                + new Date(eventCal.startDate).getMinutes()).slice(-2)}`;
    }
    public isToday(calendarDay: IAgendaDate): boolean {
        return this.helpers.isToday(calendarDay);
    }
    public noMoreTwo(nbEvents: number): boolean {
        if (nbEvents > 1) {
            return false;
        }
        return true;
    }
    public notThisMonth(calendarDay: IAgendaDate): boolean {
        return this.calendarService.notThisMonth(calendarDay);
    }
    public isWeekend(index: number): boolean {
        return this.helpers.isWeekend(index);
    }
    public getFullYear(): number {
        return this.calendarService.selectedDate.getFullYear();
    }
    public nameOfDaysShort(): string[] {
        return this.displayService.nameOfDaysShort();
    }
    get weekNumbers(): number[] {
        return this.calendarService.weekNumbers;
    }
    get days(): IAgendaDate[] {
        return this.calendarService.days;
    }
}
