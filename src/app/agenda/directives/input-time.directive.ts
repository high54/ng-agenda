import { Directive, HostListener, Self, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
/**
 *
 * # Attribute Directive
 *
 * ## Input Time
 *
 * - Contrôle la saisie utilisateur
 * - Formate le champ : HH:MM
 * - Met le champ invalide en cas d'erreur
 * - Supporte les pays au format 12h (US, UK, CA, AUS)
 *  ``` html
 * // 24h
 * <input type="text" agendaInputTime>
 * // or
 * <input type="text" agendaInputTime [isEn]="false">
 * // 12h
 * <input type="text" agendaInputTime [isEn]="true">
 * ```
 *
 * Par défaut `isEn` est à false, la directive est donc sur 24h.
 *
 */
@Directive({
    selector: '[agendaInputTime]'
})
export class AgendaInputTimeDirective {

    constructor(@Self() public ngControl: NgControl) { }
    // Détermine si les heures sont sur 12 ou 24. Par défaut sur 24
    @Input() isEn = false;

    @HostListener('input', ['$event'])
    onInput(event: KeyboardEvent) {
        // Cast target en HTMLInputElement afin d'obtenir le typage
        const input = event.target as HTMLInputElement;
        // Supprime les deux points superposés si ils sont présent avant chaque vérification
        let trimmed = input.value.replace(':', '');
        // Si il y a de plus de 4 caractères, on bloque la saisie.
        if (trimmed.length > 4) {
            trimmed = trimmed.substr(0, 4);
        }
        // Split les nombres deux par deux dans un tableau
        const numbers = [];
        for (let i = 0; i < trimmed.length; i += 2) {
            numbers.push(trimmed.substr(i, 2));
        }
        // Réassemble les nombres en ajoutant deux points superposés entre
        input.value = numbers.join(':');
        /**
         * Effectue toutes les vérifications dans une ternaire.
         * 1 - Si la saisie ne correspond pas à des nombres (regex)
         * 2 - Si le champ est sale et que la saisie est null
         * 3 - Si le champ est sale et que la saisie est inférieur à 4
         * 4 - Si les heures sont supérieur à 12 pour les (US, UK, CA, etc..) ou 23
         * 5 - Si les minutes sont supérieur à 59
         * Alors on passe le champ à invalide
         * Sinon pas d'erreur, on passe les erreurs à null
         */
        this.ngControl.control.setErrors(
            /[^\d+$]/.test(trimmed) ||
                (trimmed.length === 0 ||
                    trimmed.length < 4) &&
                this.ngControl.dirty ||
                parseInt(trimmed.substr(0, 2), 10) > (this.isEn ? 12 : 23) ||
                parseInt(trimmed.substr(2, 4), 10) > 59 ?
                { 'invalid': true } : null
        );
    }
}
