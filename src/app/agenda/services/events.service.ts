import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Rxjs
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
// Models
import { IAgendaEvent } from '../models/agenda-event.interface';
// Services
import { DateHelpersService } from './date-helpers.service';

@Injectable({
    providedIn: 'root'
})
export class EventsService {
    public eventsTemp = [];
    private apiUrl = 'http://localhost:3000/';
    private eventEp = 'events/';
    constructor(
        private httpClient: HttpClient,
        private helpers: DateHelpersService
    ) {
        this.generateFakeEvents();
    }

    public generateFakeEvents(): IAgendaEvent[] {
        const events: IAgendaEvent[] = [];
        const ev1: IAgendaEvent = {
            title: 'Event 1',
            startDate: new Date(),
            endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2),
            color: '#f8c291',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        };
        events.push(ev1);


        this.eventsTemp = events;
        return events;
    }


    public createEvent(): void {
        this.httpClient.post<IAgendaEvent>(`${this.apiUrl}${this.eventEp}`, this.eventsTemp[3]).pipe(
            map((resp) => {
                return resp;
            })).pipe(catchError((error: any) => throwError(JSON.stringify(error)))).subscribe();
    }

    public addEvent(newEvent: IAgendaEvent): IAgendaEvent {
        const event: IAgendaEvent = {
            id: this.eventsTemp.length + 1 + '',
            color: '#f8c291',
            description: '',
            title: '',
            startDate: new Date(newEvent.startDate),
            endDate: newEvent.endDate ? new Date(newEvent.endDate) : new Date(newEvent.startDate)
        };
        this.eventsTemp.push(event);
        return event;
    }
    public updateEvent(event: IAgendaEvent): void {
        for (let evt of this.eventsTemp) {
            if (evt.id && evt.id === event.id) {
                evt = event;
                break;
            }
        }
        this.sortEvents();
    }
    public removeEvent(event: IAgendaEvent): void {
        for (let i = 0; i < this.eventsTemp.length; i++) {
            const evt = this.eventsTemp[i];
            if (evt.id && evt.id === event.id) {
                this.eventsTemp.splice(i, 1);
                break;
            }
        }
        this.sortEvents();
    }

    public getEvent(date: Date): IAgendaEvent[] {
        const selectedDate = new Date(date);
        const events = [];
        this.eventsTemp.forEach((agendaEvent: IAgendaEvent) => {
            const eventStartDate = new Date(agendaEvent.startDate);
            const eventEndDate = new Date(agendaEvent.endDate);
            let isAdd = false;
            if (this.helpers.isSameYear(selectedDate, eventStartDate)
                || this.helpers.isSameYear(selectedDate, eventEndDate)
                || selectedDate.getFullYear() >= eventStartDate.getFullYear()
                && selectedDate.getFullYear() <= eventEndDate.getFullYear()) {
                // Si la date selectionné est la même que le début de l'évent'
                if (!isAdd && this.helpers.isSameDate(selectedDate, eventStartDate)) {
                    events.push(agendaEvent);
                    isAdd = true;
                }
                // Si la date selectionné est la même que la fin de l'évent'
                if (!isAdd && this.helpers.isSameDate(selectedDate, eventEndDate)) {
                    events.push(agendaEvent);
                    isAdd = true;
                }
                /**
                 * Si on est la même année et le même mois que la date de début
                 * mais que le jour est supérieur à la date de début, mais inférieur ou égale à la date de fin
                 */
                if (!isAdd && this.helpers.isSameYear(selectedDate, eventStartDate)
                    && this.helpers.isSameMonth(selectedDate, eventStartDate)
                    && selectedDate.getDate() > eventStartDate.getDate()
                    && selectedDate.getDate() <= eventEndDate.getDate()) {
                    events.push(agendaEvent);
                    isAdd = true;
                }
            }
        });
        return events;
    }
    /**
     * TODO
     * À Optimiser !!
     */
    private sortEvents(): void {
        if (this.eventsTemp.length === 1) {
            this.eventsTemp[0].displayRow = 0;
        } else {
            this.eventsTemp.sort((a: IAgendaEvent, b: IAgendaEvent) => {
                const aStartDate = new Date(a.startDate);
                const aEndDate = new Date(a.endDate);
                const aNbDays = this.helpers.nbDaysBetweenDates(aStartDate.getTime(), aEndDate.getTime());

                const bStartDate = new Date(b.startDate);
                const bEndDate = new Date(b.endDate);
                const bNbDays = this.helpers.nbDaysBetweenDates(bStartDate.getTime(), bEndDate.getTime());
                if (this.helpers.isSuperpositioning(aStartDate, aEndDate, bStartDate, bEndDate)) {
                    if (aStartDate.getTime() < bStartDate.getTime()) {
                        // A Commence avant B
                        if (aEndDate.getTime() > bEndDate.getTime()) {
                            // A Termine Après B
                            // Donc A est au dessus

                            if (b.displayRow > a.displayRow) {
                                const rowB = b.displayRow;
                                b.displayRow = a.displayRow;
                                a.displayRow = rowB;
                            } else if (a.displayRow === b.displayRow) {
                                a.displayRow += 1;
                            }
                        } else if (aEndDate.getTime() > bStartDate.getTime()) {
                            // A Termine pendant ou après B
                            // Donc A est au dessus
                            if (b.displayRow > a.displayRow) {
                                const rowB = b.displayRow;
                                b.displayRow = a.displayRow;
                                a.displayRow = rowB;
                            } else if (a.displayRow === b.displayRow) {
                                a.displayRow += 1;
                            }

                        } else {
                            // A Termine avant B, donc osef.
                            if (a.displayRow > b.displayRow) {
                                const rowA = a.displayRow;
                                a.displayRow = b.displayRow;
                                b.displayRow = rowA;
                            } else if (a.displayRow === b.displayRow) {
                                b.displayRow += 1;
                            }
                        }
                    } else if (aStartDate.getTime() < bEndDate.getTime()) {
                        // A Débute avant la fin de B
                        // Donc B est au dessus.
                        if (a.displayRow > b.displayRow) {
                            const rowA = a.displayRow;
                            a.displayRow = b.displayRow;
                            b.displayRow = rowA;
                        } else if (a.displayRow === b.displayRow) {
                            b.displayRow += 1;
                        }
                    } else {
                        // B au dessus.
                        if (a.displayRow > b.displayRow) {
                            const rowA = a.displayRow;
                            a.displayRow = b.displayRow;
                            b.displayRow = rowA;
                        } else if (a.displayRow === b.displayRow) {
                            b.displayRow += 1;
                        }
                    }
                }
                return bNbDays - aNbDays;
            });
        }

    }

}
