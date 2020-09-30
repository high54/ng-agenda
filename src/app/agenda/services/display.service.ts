import { Injectable } from '@angular/core';

@Injectable()
export class DisplayService {
    // Klingon US week, start by sunday.
    private nameOfDays = [
        'Dimanche', 'Lundi',
        'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
    ];
    constructor() { }

    public nameOfMonth(month: number): string {
        const monthsName = [
            'Janvier',
            'Février',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juillet',
            'Aout',
            'Septembre',
            'Octobre',
            'Novembre',
            'Décembre'
        ];
        return monthsName[month];
    }

    public nameOfDaysShort(): string[] {
        const nameOfDaysShort = this.shortTheNameOfDays();
        const sunday = nameOfDaysShort[0];
        nameOfDaysShort.splice(0, 1);
        nameOfDaysShort.push(sunday);
        return nameOfDaysShort;
    }
    public nameOfDayByIndex(index: number): string {
        return this.nameOfDays[index];
    }
    public nameOfDaysShortByIndex(index: number): string {
        const nameOfDaysShort = this.shortTheNameOfDays();
        return nameOfDaysShort[index];
    }

    public listOfHours(): string[] {
        const hours = [];
        for (let i = 1; i <= 23; i++) {
            if (i < 10) {
                hours.push(`0${i}:00`);
            } else {
                hours.push(`${i}:00`);
            }
        }
        hours.push('');
        return hours;
    }

    public firstLetterInNameOfDaysShort(): string[] {
        const nameOfDaysShort = this.nameOfDays.slice().map((name) => {
            return name.substr(0, 1).toUpperCase();
        });
        const sunday = nameOfDaysShort[0];
        nameOfDaysShort.splice(0, 1);
        nameOfDaysShort.push(sunday);
        return nameOfDaysShort;
    }

    public getCurrentDate(): string {
        const currentDate = new Date();
        return `${this.nameOfDayByIndex(currentDate.getDay())}, ${currentDate.getDate()} ${this.nameOfMonth(currentDate.getMonth())} ${currentDate.getFullYear()}`;
    }

    private shortTheNameOfDays(): string[] {
        return this.nameOfDays.slice().map((name) => {
            return name.substr(0, 3).toUpperCase() + '.';
        });
    }
}
