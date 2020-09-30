import { Injectable } from '@angular/core';
// Models
import { IAgendaEvent } from '../models/agenda-event.interface';
import { IAgendaDate } from '../models/agenda-date.interface';
import { AgendaEventActionType } from '../models/agenda-event-action-type.enum';
import { AgendaNavType } from '../models/agenda-nav-type.enum';
// Services
import { EventsService } from './events.service';
import { DateHelpersService } from './date-helpers.service';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {
    public selectedDate: Date = new Date();
    public days: IAgendaDate[];
    public events: IAgendaEvent[];
    public weekNumbers = [];
    public weeksNumbers: number[][];
    private dayUnit = 1;
    private nbDaysByWeek = 7;
    constructor(
        private eventsService: EventsService,
        private helpers: DateHelpersService
    ) {
        this.generateCalendar();
    }
    public today(): void {
        this.selectedDate = new Date();
        this.generateCalendar();
    }
    public notThisMonth(calendarDay: IAgendaDate): boolean {
        if (calendarDay) {
            if (calendarDay.month === this.selectedDate.getMonth() && calendarDay.year === this.selectedDate.getFullYear()) {
                return false;
            }
        }
        return true;
    }
    public previousNext(type: AgendaEventActionType, nav: AgendaNavType): void {
        const addOrRemove = type === AgendaEventActionType.Previous ? - this.dayUnit : +this.dayUnit;
        switch (nav) {
            case AgendaNavType.DAY:
                this.selectedDate.setDate(this.selectedDate.getDate() + addOrRemove);
                this.events = this.eventsService.getEvent(this.selectedDate);
                break;
            case AgendaNavType.WEEK:
                this.selectedDate.setDate(this.selectedDate.getDate() + (addOrRemove * this.nbDaysByWeek));
                break;
            case AgendaNavType.MONTH:
                this.selectedDate.setMonth(this.selectedDate.getMonth() + addOrRemove);
                this.generateCalendar(AgendaNavType.MONTH);
                break;
            case AgendaNavType.YEAR:
                this.selectedDate.setFullYear(this.selectedDate.getFullYear() + addOrRemove);
                this.getCalendarFullYear();
                break;
        }
    }
    public getWeeksNumbers(): number[][] {
        return this.weeksNumbers;
    }
    public getCalendarFullYear(): IAgendaDate[][] {
        const fullYear: IAgendaDate[][] = [];
        this.weeksNumbers = [];
        for (let i = 0; i < 12; i++) {
            this.selectedDate.setMonth(i);
            this.generateCalendar(AgendaNavType.YEAR);
            this.weeksNumbers.push(this.weekNumbers);
            fullYear.push(this.days);
        }
        return fullYear;
    }
    private generateMonthBefore(nav: AgendaNavType): void {
        const nbDayToDisplay = this.helpers.getFirstDayOfMonth(this.selectedDate) - 1;
        const dateBefore = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() - 1, 1);
        const nbDay = 32 - new Date(dateBefore.getFullYear(), dateBefore.getMonth(), 32).getDate();
        for (let i = 0; i < nbDayToDisplay; i++) {
            let calendarDay = this.getCalendarDay(dateBefore, nbDay, -i);
            calendarDay = nav === AgendaNavType.YEAR ? calendarDay : this.bindEventToCalendar(calendarDay, dateBefore, nbDay, -i);
            this.days.push(calendarDay);
        }
        this.days.reverse();
        if (nbDayToDisplay === 7) {
            const date = new Date(this.days[this.days.length - 1].year,
                this.days[this.days.length - 1].month, this.days[this.days.length - 1].day);
            this.weekNumbers.push(this.helpers.getWeekNumber(date));
        }
    }
    private generateMonthAfter(nav: AgendaNavType): void {
        const nbDayToDisplay = this.helpers.getFirstDayOfMonth(this.selectedDate) - 1;
        const nbDayMonth = this.helpers.nbDayOfMonth(this.selectedDate);
        const total = 42 - (nbDayToDisplay + nbDayMonth);
        const dateAfter = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 1);
        if (total >= 5 && this.weekNumbers.length < 6) {
            let date;
            if (total === 14) {
                date = new Date(dateAfter.getFullYear(), dateAfter.getMonth(), (total / 2) - 1);
                this.weekNumbers.push(this.helpers.getWeekNumber(date));
            }
            date = new Date(dateAfter.getFullYear(), dateAfter.getMonth(), total - 1);
            this.weekNumbers.push(this.helpers.getWeekNumber(date));
        }
        for (let i = 0; i < total; i++) {
            let calendarDay = this.getCalendarDay(dateAfter, i, +1);
            calendarDay = nav === AgendaNavType.YEAR ? calendarDay : this.bindEventToCalendar(calendarDay, dateAfter, i, +1);
            this.days.push(calendarDay);
        }
    }
    /**
     * Bind an event on a date
     * @param calendarDay The day to be evaluated in IAgendaDate format
     * @param date The date
     * @param index The day
     * @param addOrRemove Add or remove days to the number of days to display
     */
    private bindEventToCalendar(calendarDay: IAgendaDate, date: Date, index: number, addOrRemove: number): IAgendaDate {
        for (const event of this.events) {
            const { eventStartDate, eventEndDate, dateTemp, eventCal } = this.getVariables(event, date, index + addOrRemove);
            if (this.helpers.isEventDate(eventStartDate, eventEndDate, dateTemp)) {
                if (this.helpers.isStartDate(eventStartDate, dateTemp)) {
                    eventCal.isStartDate = true;
                }
                if (this.helpers.isEndDate(eventEndDate, dateTemp)) {
                    eventCal.isEndDate = true;
                }
                if (calendarDay.events.length > 0 && !eventCal.displayRow) {
                    eventCal.displayRow = calendarDay.events.length;
                    event.displayRow = calendarDay.events.length;
                }
                calendarDay.events.push(eventCal);
            }
        }
        return calendarDay;
    }
    public generateCalendar(nav: AgendaNavType = AgendaNavType.DAY): void {
        this.days = [];
        this.weekNumbers = [];
        this.events = this.eventsService.eventsTemp;
        this.generateMonthBefore(nav);
        for (let i = 0; i < this.helpers.nbDayOfMonth(this.selectedDate); i++) {
            let calendarDay = this.getCalendarDay(this.selectedDate, i, +1);
            if (i % 7 === 0
                || this.selectedDate.getMonth() === 1
                && this.helpers.nbDayOfMonth(this.selectedDate) === 28 && i === 27
                && new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 28).getDay() !== 0) {
                const date = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), i + 1);
                this.weekNumbers.push(this.helpers.getWeekNumber(date));
            }
            calendarDay = nav === AgendaNavType.YEAR ? calendarDay : this.bindEventToCalendar(calendarDay, this.selectedDate, i, +1);
            this.days.push(calendarDay);
        }
        this.generateMonthAfter(nav);
    }
    /**
     * Génère l'affichage d'une semaine en fonction d'une date
     * @param date Date selected
     */
    public generateWeekCalendar(): { dayIndex: number, date: Date, agendaDate: IAgendaDate }[] {
        const date = this.selectedDate;
        const week = [];
        let agendaDate: IAgendaDate;
        /**
         * La semaine américaine commence le dimanche = 0;
         * Si la méthode retourne 0, Il faudra retourner la semaine précédente.
         * De plus la date fournit devra être la dernière du tableau ( forcément, il s'agit du dimanche.. )
         * Sinon, on retourne la semaine actuelle, plus le dimanche de la semaine suivante.
         * Il faut récupérer le jours précédent, le jour actuel et les jours suivant.
         */
        if (date.getDay() === 0) {
            // Il faut retourner les 6 jours précédent la date
            agendaDate = {
                day: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear(),
                events: this.eventsService.getEvent(date)
            };
            week.push({ dayIndex: date.getDay(), date, agendaDate });
            for (let i = 1; i <= 6; i++) {
                const dateTemp = new Date(date.getFullYear(), date.getMonth(), date.getDate() - i);
                agendaDate = {
                    day: dateTemp.getDate(),
                    month: dateTemp.getMonth(),
                    year: dateTemp.getFullYear(),
                    events: this.eventsService.getEvent(dateTemp)
                };
                week.push(
                    {
                        dayIndex: dateTemp.getDay(),
                        date: dateTemp,
                        agendaDate
                    }
                );
            }
            week.reverse();
        } else {
            // On part de 1 à 6 (6 jours) moin la date fournit
            const restOfDay = 7 - date.getDay();
            for (let i = restOfDay; i > 0; i--) {
                const dateTemp = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i);
                agendaDate = {
                    day: dateTemp.getDate(),
                    month: dateTemp.getMonth(),
                    year: dateTemp.getFullYear(),
                    events: this.eventsService.getEvent(dateTemp)
                };
                week.push({ dayIndex: dateTemp.getDay(), date: dateTemp, agendaDate });
            }
            agendaDate = {
                day: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear(),
                events: this.eventsService.getEvent(date)
            };
            week.push({ dayIndex: date.getDay(), date, agendaDate });
            let index = 1;
            for (let i = (restOfDay + 1); i < 7; i++) {
                const dateTemp = new Date(date.getFullYear(), date.getMonth(), date.getDate() - index);
                agendaDate = {
                    day: dateTemp.getDate(),
                    month: dateTemp.getMonth(),
                    year: dateTemp.getFullYear(),
                    events: this.eventsService.getEvent(dateTemp)
                };
                week.push({ dayIndex: dateTemp.getDay(), date: dateTemp, agendaDate });
                index++;
            }
            week.reverse();
        }
        return week;
    }
    private getVariables(agendaEvent: IAgendaEvent, dateToCheck: Date, index: number)
        : { eventStartDate: Date, eventEndDate: Date, dateTemp: Date, eventCal: IAgendaEvent } {
        const dateTemp = new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), index);
        dateTemp.setHours(0, 0, 0, 0);

        const eventStartDate = new Date(agendaEvent.startDate.getFullYear(),
            agendaEvent.startDate.getMonth(), agendaEvent.startDate.getDate());
        eventStartDate.setHours(0, 0, 0, 0);
        const eventEndDate = new Date(agendaEvent.endDate.getFullYear(),
            agendaEvent.endDate.getMonth(), agendaEvent.endDate.getDate());
        eventEndDate.setHours(0, 0, 0, 0);
        const eventTemp = JSON.stringify(agendaEvent);
        const eventCal: IAgendaEvent = JSON.parse(eventTemp);
        eventCal.isStartDate = false;
        eventCal.isEndDate = false;
        return { eventStartDate, eventEndDate, dateTemp, eventCal };
    }
    /**
     * Returns an IAgendaDate object with the specified date
     * @param date Date de compute
     * @param nbDay Nb of days to display
     * @param addOrRemove Add or remove days to the number of days to display
     */
    private getCalendarDay(date: Date, nbDay: number, addOrRemove): IAgendaDate {
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: nbDay + addOrRemove,
            events: []
        };
    }
}
