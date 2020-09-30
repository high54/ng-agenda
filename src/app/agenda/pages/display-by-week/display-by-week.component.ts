import { Component, OnInit } from '@angular/core';
// Angular Material Components
import { MatDialog } from '@angular/material/dialog';
// Services
import { DisplayService, CalendarService, DateHelpersService, EventsService } from '../../services';
// Models
import { IAgendaEvent } from '../../models/agenda-event.interface';
import { IAgendaDate } from '../../models/agenda-date.interface';
// Components
import { AgendaEventDetailsComponent, AgendaEventFormComponent } from '../../components';
@Component({
    selector: 'agenda-calendar-display-by-week',
    styleUrls: ['display-by-week.component.scss'],
    templateUrl: 'display-by-week.component.html',
})
export class AgendaCalendarDisplayByWeekComponent implements OnInit {
    public hours = [];
    public weeks = [];
    constructor(
        public dialog: MatDialog,
        private displayService: DisplayService,
        private calendarService: CalendarService,
        private dateHelper: DateHelpersService,
        private eventService: EventsService
    ) {
        for (let i = 0; i < 7; i++) {
            this.weeks.push(i);
        }
    }
    public ngOnInit(): void {
        this.hours = this.displayService.listOfHours();
    }
    public showEvent(eventCal: IAgendaEvent): void {
        const dialogRef = this.dialog.open(AgendaEventDetailsComponent, {
            width: '25%',
            data: eventCal
        });
        dialogRef.afterClosed().subscribe();
    }
    public nameOfDaysShortByIndex(index: number): string {
        return this.displayService.nameOfDaysShortByIndex(index);
    }
    public isToday(dateCompare: Date): boolean {
        const date = new Date(dateCompare);
        const agendaDate: IAgendaDate = {
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear()
        };
        return this.dateHelper.isToday(agendaDate);
    }
    public addEvent(week, hour): void {
        console.log(this.currentWeek[week].date)
        let newEvent: IAgendaEvent = {
            startDate: new Date(this.currentWeek[week].date)
        };
        newEvent = this.eventService.addEvent(newEvent);
        this.calendarService.generateCalendar();
        const dialogRef = this.dialog.open(AgendaEventFormComponent, {
            width: '35%',
            data: newEvent
        });
        dialogRef.afterClosed().subscribe((result: IAgendaEvent) => {
            if (result) {
                this.eventService.updateEvent(result);
                this.calendarService.generateCalendar();
            } else {
                this.eventService.removeEvent(newEvent);
                this.calendarService.generateCalendar();
            }
        });
    }
    get currentWeek() {
        return this.calendarService.generateWeekCalendar();
    }

}
