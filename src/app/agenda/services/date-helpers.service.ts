import { Injectable } from '@angular/core';
// Models
import { IAgendaDate } from '../models/agenda-date.interface';

@Injectable()
export class DateHelpersService {
    constructor() { }
    public nbDayOfMonth(date: Date): number {
        return 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
    }
    public isEndDate(eventEndDate: Date, dateTemp: Date): boolean {
        if (eventEndDate.getTime() === dateTemp.getTime()) {
            return true;
        }
        return false;
    }
    public isStartDate(eventStartDate: Date, dateTemp: Date): boolean {
        if (eventStartDate.getTime() === dateTemp.getTime()) {
            return true;
        }
        return false;
    }
    public isEventDate(eventStartDate: Date, eventEndDate: Date, dateTemp: Date): boolean {
        if (eventStartDate.getTime() === dateTemp.getTime()
            || eventStartDate.getTime() < dateTemp.getTime()
            && eventEndDate.getTime() >= dateTemp.getTime()) {
            return true;
        }
        return false;
    }
    public getFirstDayOfMonth(date: Date): number {
        let index = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        if (index === 0) {
            index = 7;
        }
        return index;
    }
    public isSameYear(selectedDate: Date, eventDate: Date): boolean {
        selectedDate = new Date(selectedDate);
        eventDate = new Date(eventDate);
        if (selectedDate.getFullYear() === eventDate.getFullYear()) {
            return true;
        }
        return false;
    }
    public isSameMonth(selectedDate: Date, eventDate: Date): boolean {
        selectedDate = new Date(selectedDate);
        eventDate = new Date(eventDate);
        if (selectedDate.getMonth() === eventDate.getMonth()) {
            return true;
        }
        return false;
    }
    public isSameDay(selectedDate: Date, eventDate: Date): boolean {
        selectedDate = new Date(selectedDate);
        eventDate = new Date(eventDate);
        if (selectedDate.getDate() === eventDate.getDate()) {
            return true;
        }
        return false;
    }
    public isSameDate(selectedDate: Date, eventDate: Date): boolean {
        selectedDate = new Date(selectedDate);
        eventDate = new Date(eventDate);
        // Si la date selectionné est dans la même année que le début de l'évent'
        if (this.isSameYear(selectedDate, eventDate)) {
            // Si la date selectionné est dans le même mois que le début de l'évent'
            if (this.isSameMonth(selectedDate, eventDate)) {
                // Si la date selectionné est le même jour que le début de l'évent'
                if (this.isSameDay(selectedDate, eventDate)) {
                    return true;
                }
            }
        }
        return false;
    }
    public nbDaysBetweenDates(startDate: number, endDate: number): number {
        const delta = Math.abs(startDate - endDate) / 1000;
        return Math.floor(delta / 86400) + 2;
    }
    public getWeekNumber(dateTemp: Date): number {
        const dateInstanceTemp = new Date(dateTemp.valueOf());
        const dayn = (dateTemp.getDay() + 6) % 7;
        dateInstanceTemp.setDate(dateInstanceTemp.getDate() - dayn + 3);
        const firstThursday = dateInstanceTemp.valueOf();
        dateInstanceTemp.setMonth(0, 1);
        if (dateInstanceTemp.getDay() !== 4) {
            dateInstanceTemp.setMonth(0, 1 + ((4 - dateInstanceTemp.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - dateInstanceTemp.getTime()) / 604800000);
    }
    public isToday(calendarDay: IAgendaDate): boolean {
        if (calendarDay) {
            const today = new Date();
            if (calendarDay.year === today.getFullYear()
                && calendarDay.month === today.getMonth()
                && calendarDay.day === today.getDate()) {
                return true;
            }
        }
        return false;
    }

    public isWeekend(index: number): boolean {
        if (index === 5
            || index === 6
            || index === 12
            || index === 13
            || index === 19
            || index === 20
            || index === 26
            || index === 27
            || index === 33
            || index === 34
            || index === 40
            || index === 41
        ) {
            return true;
        }
        return false;
    }

    /**
     * Est-ce que deux dates ce superpose ?
     * Permet de savoir si deux dates ce superpose.
     * aStart = date de début du premier de l'évent
     * bStart = date de début du deuxième évent
     */
    public isSuperpositioning(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
        const aStartDate = new Date(aStart);
        const aEndDate = new Date(aEnd);
        const aNbDays = this.nbDaysBetweenDates(aStartDate.getTime(), aEndDate.getTime());

        const bStartDate = new Date(bStart);
        const bEndDate = new Date(bEnd);
        const bNbDays = this.nbDaysBetweenDates(bStartDate.getTime(), bEndDate.getTime());

        if (
            aStartDate.getFullYear() === bStartDate.getFullYear() ||
            aStartDate.getFullYear() === bEndDate.getFullYear() ||
            aEndDate.getFullYear() === bStartDate.getFullYear() ||
            aEndDate.getFullYear() === bEndDate.getFullYear()
        ) {
            if (
                aStartDate.getMonth() === bStartDate.getMonth() ||
                aStartDate.getMonth() === bEndDate.getMonth() ||
                aEndDate.getMonth() === bStartDate.getMonth() ||
                aEndDate.getMonth() === bEndDate.getMonth()
            ) {
                return true;
            }
        }
        return false;
    }
}
