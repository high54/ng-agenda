import { Component } from '@angular/core';
// Angular Material Components
import { MatDialog } from '@angular/material/dialog';
// Services
import { DisplayService, CalendarService, EventsService } from '../../services';
// Models
import { IAgendaEvent } from '../../models/agenda-event.interface';
// Components
import { AgendaEventDetailsComponent, AgendaEventFormComponent, AgendaEventsDetailsComponent } from '../../components';
import { IAgendaDate } from '../../models/agenda-date.interface';
/**
 * TODO : Afficher les évents par tranche horaire
 */
@Component({
    selector: 'agenda-calendar-display-by-day',
    styleUrls: ['display-by-day.component.scss'],
    templateUrl: 'display-by-day.component.html',
})
export class AgendaCalendarDisplayByDayComponent {
    private newEvent: IAgendaEvent;

    constructor(
        public dialog: MatDialog,
        private displayService: DisplayService,
        private calendarService: CalendarService,
        private eventService: EventsService
    ) { }

    public showEvent(eventCal: IAgendaEvent): void {
        const dialogRef = this.dialog.open(AgendaEventDetailsComponent, {
            width: '25%',
            data: eventCal
        });
        dialogRef.afterClosed().subscribe();
    }

    public showAllEvent(): void {
        const dateAgenda: IAgendaDate = {
            events: this.events,
            day: this.calendarService.selectedDate.getDate(),
            month: this.calendarService.selectedDate.getMonth(),
            year: this.calendarService.selectedDate.getFullYear()
        };
        const dialogRef = this.dialog.open(AgendaEventsDetailsComponent, {
            width: '10%',
            data: dateAgenda
        });
        dialogRef.afterClosed().subscribe();
    }

    public addEvent(): void {
        this.newEvent = {
            startDate: new Date(
                this.calendarService.selectedDate.getFullYear(),
                this.calendarService.selectedDate.getMonth(),
                this.calendarService.selectedDate.getDate()
            )
        };
        this.newEvent = this.eventService.addEvent(this.newEvent);
        this.calendarService.generateCalendar();
        const dialogRef = this.dialog.open(AgendaEventFormComponent, {
            width: '35%',
            data: this.newEvent
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
    public noMoreTwo(indexEvent: number): boolean {
        if (indexEvent > 1) {
            return false;
        }
        return true;
    }
    get listOfHours(): string[] {
        return this.displayService.listOfHours();
    }
    get selectedDate(): { day: number, nameOfDay: string } {
        const index = this.calendarService.selectedDate.getDay();
        return {
            day: this.calendarService.selectedDate.getDate(),
            nameOfDay: this.displayService.nameOfDaysShortByIndex(index)
        };
    }
    get events(): IAgendaEvent[] {
        return this.calendarService.events;
    }
}
