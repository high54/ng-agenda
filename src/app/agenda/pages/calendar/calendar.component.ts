import { Component, OnInit, OnDestroy } from '@angular/core';
// Services
import { CalendarService, DisplayService } from '../../services';
// Models
import { ISelectOption } from '../../models/select-option.interface';
import { AgendaNavType } from '../../models/agenda-nav-type.enum';
import { AgendaEventActionType } from '../../models/agenda-event-action-type.enum';
// Angular Material
import { MatDialog } from '@angular/material/dialog';
// Dialog Component for Modal
import { Router, Event, NavigationEnd } from '@angular/router';
// Rxjs
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-agenda-calendar',
    styleUrls: ['calendar.component.scss'],
    templateUrl: 'calendar.component.html',
})
export class AgendaCalendarComponent implements OnInit, OnDestroy {
    public events: any[];
    public selectOptions: ISelectOption[] = [
        { value: 'day', title: 'Jour' },
        { value: 'week', title: 'Semaine' },
        { value: 'month', title: 'Mois' },
        { value: 'year', title: 'Année' },
        { value: 'planning', title: 'Planning' }
    ];
    public selectedOption = 'month';
    private routerSub: Subscription;
    constructor(
        public dialog: MatDialog,
        private calendarService: CalendarService,
        private displayService: DisplayService,
        private router: Router
    ) {
    }
    public ngOnInit(): void {
        this.selectedOption = this.getPath(this.router.url);
        this.routerSub = this.router.events.subscribe((val: Event) => {
            if (val instanceof NavigationEnd) {
                this.selectedOption = this.getPath(val.url);
            }
        });
    }
    public ngOnDestroy(): void {
        if (this.routerSub) {
            this.routerSub.unsubscribe();
        }
    }
    public selectOption(event): void {
        this.selectedOption = event.target.value;
        if (this.selectedOption === 'month') {
            this.calendarService.today();
        }
        this.router.navigateByUrl('agenda/' + this.selectedOption);
    }

    public today(): void {
        this.calendarService.today();
    }
    public previous(): void {
        switch (this.selectedOption) {
            case 'day':
                this.calendarService.previousNext(AgendaEventActionType.Previous, AgendaNavType.DAY);
                break;
            case 'week':
                this.calendarService.previousNext(AgendaEventActionType.Previous, AgendaNavType.WEEK);
                break;
            case 'month':
                this.calendarService.previousNext(AgendaEventActionType.Previous, AgendaNavType.MONTH);
                break;
            case 'year':
                this.calendarService.previousNext(AgendaEventActionType.Previous, AgendaNavType.YEAR);
                break;
        }
    }
    public next(): void {
        switch (this.selectedOption) {
            case 'day':
                this.calendarService.previousNext(AgendaEventActionType.Next, AgendaNavType.DAY);
                break;
            case 'week':
                this.calendarService.previousNext(AgendaEventActionType.Next, AgendaNavType.WEEK);
                break;
            case 'month':
                this.calendarService.previousNext(AgendaEventActionType.Next, AgendaNavType.MONTH);
                break;
            case 'year':
                this.calendarService.previousNext(AgendaEventActionType.Next, AgendaNavType.YEAR);
                break;
        }
    }
    public displayDate(): string {
        switch (this.selectedOption) {
            case 'day':
                return `${this.nameOfMonth()} ${this.getFullYear()}`;
                break;
            case 'week':
                this.calendarService.generateWeekCalendar();
                return `${this.nameOfMonth()} ${this.getFullYear()}`;
                break;
            case 'month':
                return `${this.nameOfMonth()} ${this.getFullYear()}`;
                break;
            case 'year':
                return `${this.getFullYear()}`;
                break;
        }
    }
    public nameOfMonth(): string {
        return this.displayService.nameOfMonth(this.calendarService.selectedDate.getMonth());
    }
    public nameOfDaysShort(): string[] {
        return this.displayService.nameOfDaysShort();
    }
    public getFullYear(): number {
        return this.calendarService.selectedDate.getFullYear();
    }
    get currentDateToString(): string {
        return this.displayService.getCurrentDate();
    }
    private getPath(path: string): string {
        if (path.endsWith('agenda')) {
            return 'month';
        } else {
            return path.split('/')[2];
        }
    }
}
