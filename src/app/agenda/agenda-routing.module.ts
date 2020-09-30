import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Pages
import * as fromPages from './pages';

const routes: Routes = [
    {
        path: '',
        component: fromPages.AgendaCalendarComponent,
        data: {
            breadcrumb: 'Calendrier',
        },
        children: [
            {
                path: '',
                component: fromPages.AgendaCalendarDisplayByMonthComponent
            },
            {
                path: 'day',
                pathMatch: 'full',
                component: fromPages.AgendaCalendarDisplayByDayComponent
            },
            {
                path: 'week',
                pathMatch: 'full',
                component: fromPages.AgendaCalendarDisplayByWeekComponent
            },
            {
                path: 'month',
                pathMatch: 'full',
                component: fromPages.AgendaCalendarDisplayByMonthComponent
            },
            {
                path: 'year',
                pathMatch: 'full',
                component: fromPages.AgendaCalendarDisplayByYearComponent
            },
            {
                path: 'planning',
                pathMatch: 'full',
                component: fromPages.AgendaCalendarPlanningDisplayComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AgendaRoutingModule { }
