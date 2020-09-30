import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
// Models
import { IAgendaDate } from '../../models/agenda-date.interface';
// Angular Material
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
// Services
import { DisplayService } from '../../services';
import { IAgendaEvent } from '../../models/agenda-event.interface';
// Dialog component
import { AgendaEventDetailsComponent } from '../event-details/event-details.component';

@Component({
    selector: 'app-agenda-events-details',
    styleUrls: ['events-details.component.scss'],
    templateUrl: 'events-details.component.html'
})
export class AgendaEventsDetailsComponent {

    constructor(
        public dialogRef: MatDialogRef<AgendaEventsDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IAgendaDate,
        public dialog: MatDialog,
        private displayService: DisplayService,
        private router: Router
    ) { }

    public onNoClick(): void {
        this.dialogRef.close();
    }
    public displaySelectedDay(): void {
        this.router.navigateByUrl('');
    }

    public getDayName(): string {
        const date = new Date(this.data.year, this.data.month, this.data.day);
        return this.displayService.nameOfDaysShortByIndex(date.getDay());
    }
    public showEvent(eventCal: IAgendaEvent): void {
        const dialogRef = this.dialog.open(AgendaEventDetailsComponent, {
            width: '25%',
            data: eventCal
        });

        dialogRef.afterClosed().subscribe((result) => { });
    }
}
