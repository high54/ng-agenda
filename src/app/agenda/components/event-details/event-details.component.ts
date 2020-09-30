import { Component, Inject } from '@angular/core';
// Models
import { IAgendaEvent } from '../../models/agenda-event.interface';
// Angular Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Services
import { DisplayService } from '../../services';

@Component({
    selector: 'app-agenda-event-details',
    styleUrls: ['event-details.component.scss'],
    templateUrl: 'event-details.component.html',
})
export class AgendaEventDetailsComponent {
    constructor(
        public dialogRef: MatDialogRef<AgendaEventDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IAgendaEvent,
        private displayService: DisplayService
    ) { }

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public getEventDate(): string {
        const startDate = new Date(this.data.startDate);
        const endDate = new Date(this.data.endDate);
        return `${startDate.getDate()}
         ${this.displayService.nameOfMonth(startDate.getMonth())}
          - ${endDate.getDate()}
           ${this.displayService.nameOfMonth(endDate.getMonth())}
         ${endDate.getFullYear()}`;
    }
}
