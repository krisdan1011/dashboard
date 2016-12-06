import * as moment from "moment";

import Conversation from "../../models/conversation";
import StringUtils from "../../utils/string";

export interface FilterType {
    type: string;
    filter: (item: Conversation) => boolean;
}

export class TypeFilter implements FilterType {
    logType?: string;

    constructor(type?: string) {
        this.logType = type;
    }

    get type(): string {
        return "Log Type";
    }

    get filter(): (item: Conversation) => boolean {
        let type = this.logType;
        return function(item: Conversation): boolean {
            if (type === undefined || type.trim() === "") {
                return true;
            }
            return item !== undefined && item.hasLogType(type);
        };
    }
}

export class IDFilter implements FilterType {
    id: string;

    constructor(id?: string) {
        this.id = id;
    }

    get type(): string {
        return "ID";
    }

    get filter(): (item: Conversation) => boolean {
        let id = (this.id) ? StringUtils.regexEscape(this.id) : "";
        let regex = new RegExp("^.*" + id + ".*$", "g");
        return function (item: Conversation): boolean {
            return item !== undefined && id !== undefined && regex.test(item.id);
        };
    }
}

export class DateFilter implements FilterType {
    startDate: moment.Moment;
    endDate: moment.Moment;

    constructor() {
        this.startDate = this.endDate = moment();
    }

    get type(): string {
        return "Date";
    }

    get filter(): (item: Conversation) => boolean {
        let startDate = this.startDate;
        let endDate = this.endDate;
        return function (item: Conversation): boolean {
            let created = moment(item.timestamp);
            let afterStart = startDate === undefined || created.isSameOrAfter(startDate);
            let beforeEnd = endDate === undefined || created.isSameOrBefore(endDate);
            return afterStart && beforeEnd;
        };
    }
}