import { Component, ChangeDetectionStrategy, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
// Models
import { IAgendaEvent } from '../../models/agenda-event.interface';
// Angular Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'app-agenda-event-form',
    styleUrls: ['event-form.component.scss'],
    templateUrl: 'event-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaEventFormComponent implements OnInit {
    public eventForm = this.fb.group({
        title: '',
        description: [''],
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required]
    });
    public isAddTime = false;
    public options;
    constructor(
        public dialogRef: MatDialogRef<AgendaEventFormComponent>,
        @Inject(MAT_DIALOG_DATA) public agendaEvent: IAgendaEvent,
        private fb: FormBuilder
    ) {
        this.options = [];
        this.options.push('00:00');
        this.options.push('00:15');
        this.options.push('00:30');
        this.options.push('00:45');
        this.options.push('01:00');
        this.options.push('01:15');
        this.options.push('01:30');
        this.options.push('01:45');
    }
    public ngOnInit(): void {
        this.eventForm.patchValue(this.agendaEvent);
    }
    public save(): void {
        const { value, valid } = this.eventForm;
        if (valid) {
            this.agendaEvent.title = value.title ? value.title : 'Sans titre';
            this.agendaEvent.description = value.description;
            this.agendaEvent.startDate = value.startDate;
            this.agendaEvent.endDate = value.endDate;
            this.dialogRef.close(this.agendaEvent);
        }
    }
    public cancel(): void {
        this.dialogRef.close(false);
    }

    public addTime(): void {
        this.eventForm.addControl('timeStart', new FormControl('', [Validators.required]));
        this.eventForm.addControl('timeEnd', new FormControl('', [Validators.required]));
        this.isAddTime = true;
    }
    get title(): AbstractControl {
        return this.eventForm.get('title');
    }
    get description(): AbstractControl {
        return this.eventForm.get('description');
    }
}
