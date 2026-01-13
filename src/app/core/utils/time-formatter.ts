export class TimeFormatter {

    static getStartTimeOf(date:string){
        return new Date(new Date(date).toLocaleDateString()).getTime();
    }

    static getStartTimeOfToday() {
        return new Date(new Date().toLocaleDateString()).getTime();
    }

    static getEndTimeOfToday() {
        return this.getStartTimeOfToday() + 24 * 60 * 60 * 1000 - 1;
    }

    static getStartTimeOfCurWeek() {
        let today = new Date();
        return this.getStartTimeOfToday() - (today.getDay() - 1) * 24 * 3600 * 1000;
    }

    static getEndTimeOfCurWeek() {
        let today = new Date();
        return this.getEndTimeOfToday() + (7 - today.getDay()) * 24 * 3600 * 1000;
    }

    static checkZero(number: number) {
        if (number < 10)
            return '0' + number;
        else
            return number;
    }

    static formatTime(timeNum: number | undefined) {
        if (!timeNum) return '----/--/-- --:--:--';
        let date = new Date(timeNum);
        return `
            ${date.getFullYear()}/
            ${this.checkZero(date.getMonth() + 1)}/
            ${this.checkZero(date.getDate())}
            ${' '}
            ${this.checkZero(date.getHours())}:
            ${this.checkZero(date.getMinutes())}:
            ${this.checkZero(date.getSeconds())}
        `
    }

    static getDate(timeNum:number|undefined){
        if (!timeNum) return '----/--/--';
        let date = new Date(timeNum);
        return `
            ${date.getFullYear()}/
            ${this.checkZero(date.getMonth() + 1)}/
            ${this.checkZero(date.getDate())}
        `
    }

    static checkIsToday(date:string){
        return this.getStartTimeOfToday()==this.getStartTimeOf(date);
    }

    static toISOString(date:number){
        return new Date(date).toISOString();
    }

    static getTodaISOString(){
        return this.toISOString(this.getStartTimeOfToday());
    }

}