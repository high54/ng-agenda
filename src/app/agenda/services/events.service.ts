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
    const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    const endDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2);
    const ev1: IAgendaEvent = {
      title: 'Event 1',
      startDate: startDate,
      endDate: endDate,
      color: '#f8c291',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      displayRow: 1,
      nbDays: this.helpers.nbDaysEvent(startDate, endDate)
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
      color: this.getRandomColor(),
      description: '',
      title: '',
      startDate: new Date(newEvent.startDate),
      endDate: newEvent.endDate ? new Date(newEvent.endDate) : new Date(newEvent.startDate),
      displayRow: 0
    };
    this.eventsTemp.push(event);
    return event;
  }
  public updateEvent(event: IAgendaEvent): void {
    for (let evt of this.eventsTemp) {
      if (evt.id && evt.id === event.id) {
        evt = event;
        evt.nbDays = this.helpers.nbDaysEvent(evt.startDate, evt.endDate);
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
  public sortEvents(): void {
    if (this.eventsTemp.length === 1) {
      this.eventsTemp[0].displayRow = 0;
    } else {
      for (let i = 0; i < this.eventsTemp.length; i++) {
        for (let j = i + 1; j < this.eventsTemp.length; j++) {
          const a = this.eventsTemp[i];
          const b = this.eventsTemp[j];
          const isSuperpositioning = this.helpers.isSuperpositioning(new Date(a.startDate), new Date(a.endDate), new Date(b.startDate), new Date(b.endDate));

          if (isSuperpositioning) {
            if (a.nbDays > b.nbDays) {
              if (a.displayRow > b.displayRow) {
                const rowA = a.displayRow;
                const rowB = b.displayRow;
                a.displayRow = rowB;
                b.displayRow = rowA;
              } else if (a.displayRow === b.displayRow) {
                b.displayRow += 1;
              }
            } else if (a.nbDays === b.nbDays) {
              if (a.displayRow === b.displayRow) {
                if (!b.displayRow || b.displayRow < 7) {
                  b.displayRow += 1;
                }
              }
            }
          }
        }
      }
    }
  }

  getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

}
