export interface IAgendaEvent {
    id?: string;
    startDate?: Date;
    endDate?: Date;
    title?: string;
    description?: string;
    isStartDate?: boolean;
    isEndDate?: boolean;
    displayRow?: number;
    color?: string;
    nbDays?: number // Determine le nombre de jour de l'évent
}
