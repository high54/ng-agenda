import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Routes
import { AgendaRoutingModule } from './agenda-routing.module';
// Pages
import * as fromPages from './pages';
// Services
import * as fromServices from './services';
// Components
import * as fromComponents from './components';
// Angular Material Modules
import { AgendaMaterialModule } from './agenda-material.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
// Directives
import { AgendaInputTimeDirective } from './directives/input-time.directive';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AgendaRoutingModule,
        AgendaMaterialModule
    ],
    declarations: [
        ...fromPages.pages,
        ...fromComponents.components,
        AgendaInputTimeDirective
    ],
    entryComponents: [
        fromComponents.AgendaEventDetailsComponent,
        fromComponents.AgendaEventsDetailsComponent,
        fromComponents.AgendaEventFormComponent
    ],
    providers: [
        ...fromServices.services,
        { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    ]
})
export class AgendaModule { }
