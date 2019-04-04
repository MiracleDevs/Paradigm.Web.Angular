/*!
 * Paradigm Framework - Angular Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Injectable } from '@angular/core';
import { ArrayList } from '@miracledevs/paradigm-ui-web-shared';
import { LoggingService, LogType } from './logging.service';
import { ServiceBase } from './base.service';

/**
 * Enumerates the different types of alerts.
 */
export enum AlertType
{
    /**
     * Represents a message alert.
     * It's the equivalent of @see LogType.Information
     */
    Message = LogType.Information,

    /**
     * Represents a warning alert.
     * It's the equivalent of @see LogType.Warning
     */
    Warning = LogType.Warning,

    /**
     * Represents an error alert.
     * It's the equivalent of @see LogType.Error
     */
    Error = LogType.Error
}

/**
 * Represents an alert thrown by the system.
 */
export class Alert
{
    /**
     * The alert type.
     */
    private alertType: AlertType;

    /**
     * The alert inner message.
     */
    private innerMessage: string;

    /**
     * Gets the type of the alert.
     */
    get type(): AlertType { return this.alertType; }

    /**
     * Gets the type name.
     */
    get typeName(): string { return AlertType[this.alertType]; }

    /**
     * Gets the alert message.
     */
    get message(): string { return this.innerMessage; }

    /**
     * Creates a new instance of @see Alert.
     */
    constructor(alertType: AlertType, message: string)
    {
        this.alertType = alertType;
        this.innerMessage = message;
    }
}

@Injectable({
    providedIn: 'root'
})
export class AlertService extends ServiceBase
{
    /**
     * An array holding the alerts that are currently alive.
     */
    private alerts: ArrayList<Alert>;

    /**
     * Creates a new instance of @see AlertService
     * @param logger The current logging service.
     */
    constructor(private logger: LoggingService)
    {
        super();
        this.alerts = new ArrayList<Alert>();
    }

    /**
     * Gets the equivalent @see LogType for the specified @see AlertType.
     * @param alertType The specified alert type.
     * @returns the log type.
     */
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

        throw new Error('The alert type is not recognized.');
    }

    /**
     * Adds a new alert.
     * The alert service will also notify the @see LoggingService.
     * @param alertType the alert type.
     * @param message the alert message.
     */
    add(alertType: AlertType, message: string): void
    {
        this.alerts.add(new Alert(alertType, message));
        this.logger.log(message, AlertService.getLogType(alertType));
    }

    /**
     * Adds a new error alert.
     * The alert service will also notify the @see LoggingService.
     * @param message the error message.
     */
    addError(message: string): void
    {
        this.add(AlertType.Error, message);
    }

    /**
     * Adds a new warning alert.
     * The alert service will also notify the @see LoggingService.
     * @param message the error message.
     */
    addWarning(message: string): void
    {
        this.add(AlertType.Warning, message);
    }

    /**
     * Adds a new message alert.
     * The alert service will also notify the @see LoggingService.
     * @param message the error message.
     */
    addMessage(message: string): void
    {
        this.add(AlertType.Message, message);
    }

    /**
     * Removes one of the alerts from the alerts collection.
     * @param index The index of the alert, or the alert that needs to be removed.
     */
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

    /**
     * Gets the specified alert by its index.
     * @param index the alert index.
     */
    get(index: number): Alert
    {
        return this.alerts.get(index);
    }

    /**
     * Gets the alert collection.
     */
    getAlerts(): ArrayList<Alert>
    {
        return this.alerts;
    }

    /**
     * Clears the alert collection.
     */
    clear(): void
    {
        this.alerts.clear();
    }
}
