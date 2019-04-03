import { Injectable } from '@angular/core';
import { ArrayList } from '@miracledevs/paradigm-ui-web-shared';
import { LoggingService, LogType } from './logging.service';
import { ServiceBase } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class AlertService extends ServiceBase
{
    private alerts: ArrayList<Alert>;

    constructor(private logger: LoggingService)
    {
        super();
        this.alerts = new ArrayList<Alert>();
    }

    static getLogType(alertType: AlertType): LogType
    {
        switch (alertType)
        {
            case AlertType.Message:
                return LogType.Information;

            case AlertType.Warning:
                return LogType.Warning;

            case AlertType.Error:
                return LogType.Error;
        }

        return LogType.Information;
    }

    add(alertType: AlertType, message: string): void
    {
        this.alerts.add(new Alert(alertType, message));
        this.logger.log(message, AlertService.getLogType(alertType));
    }

    addError(message: string): void
    {
        this.add(AlertType.Error, message);
    }

    addWarning(message: string): void
    {
        this.add(AlertType.Warning, message);
    }

    addMessage(message: string): void
    {
        this.add(AlertType.Message, message);
    }

    remove(index: number | Alert): void
    {
        if (index instanceof Alert)
        {
            this.alerts.remove(index);
        }
        else
        {
            this.alerts.removeAt(index as number);
        }
    }

    get(index: number): Alert
    {
        return this.alerts.get(index);
    }

    getAlerts(): ArrayList<Alert>
    {
        return this.alerts;
    }

    clear(): void
    {
        this.alerts.clear();
    }
}

export enum AlertType
{
    Message = LogType.Information,
    Warning = LogType.Warning,
    Error = LogType.Error
}

export class Alert
{
    private alertType: AlertType;

    private innerMessage: string;

    get type(): AlertType { return this.alertType; }

    get typeName(): string { return Alert.getTypeName(this.alertType); }

    get message(): string { return this.innerMessage; }

    constructor(alertType: AlertType, message: string)
    {
        this.alertType = alertType;
        this.innerMessage = message;
    }

    private static getTypeName(alertType: AlertType): string
    {
        switch (alertType)
        {
            case AlertType.Message:
                return 'message';

            case AlertType.Warning:
                return 'warning';

            case AlertType.Error:
                return 'error';

            default:
                return 'unknown';
        }
    }
}
