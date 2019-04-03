/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { ServiceBase } from './base.service';
import { DateExtensions, Dictionary, StringExtensions } from '@miracledevs/paradigm-ui-web-shared';
import { Injectable } from '@angular/core';

export enum LogType
{
    Trace = 0,
    Debug = 1,
    Information = 2,
    Warning = 3,
    Error = 4,
    Critical = 5
}

@Injectable({
    providedIn: 'root'
})
export class LoggingService extends ServiceBase
{
    private static readonly typeNotRecognized: string = 'The provided type is not recognized as a valida log type.';

    private messages: string[];

    private minimumLevel: LogType;

    private logProvider: ILogProvider;

    constructor()
    {
        super();
        this.logProvider = console;
        const message = '[{0}][{1}] - {3}{2}';
        this.messages = new Array<string>();

        this.messages.push(message);
        this.messages.push(message);
        this.messages.push(message);
        this.messages.push(message);
        this.messages.push(message);
        this.messages.push(message);

        this.minimumLevel = LogType.Information;
    }

    /**
     * Sets a log provider.
     * By default console is used as provider.
     */
    setLogProvider(logProvider: ILogProvider): void
    {
        this.logProvider = logProvider;
    }

    /**
     * Sets the custom message for a given log type.
     * There are some predefined content placeholders the user can utilize
     * to configure the custom messages:
     * {0}: The time when the log was added.
     * {1}: The type of the log (Trace, Debug , Information, etc)
     * {2}: A custom tag value provided by the user.
     * {3}: The log message.
     */
    setCustomMessage(type: LogType, message: string): void
    {
        if (type < 0 || type >= this.messages.length)
        {
            throw new Error(LoggingService.typeNotRecognized);
        }

        this.messages[type] = message;
    }

    /**
     * Sets the minimum log level.
     */
    setMinimumLevel(type: LogType): void
    {
        if (type < 0 || type >= this.messages.length)
        {
            throw new Error(LoggingService.typeNotRecognized);
        }

        this.minimumLevel = type;
    }

    /**
     * Logs the specified message.
     */
    log(message: string, type: LogType = LogType.Trace, tag: string = null): void
    {
        if (type < 0 || type >= this.messages.length)
        {
            throw new Error(LoggingService.typeNotRecognized);
        }

        if (type < this.minimumLevel)
        {
            return;
        }

        const formattedMessage = StringExtensions.format(this.messages[type], DateExtensions.format(new Date(), 'hh:mm:ss'), LogType[type], tag, message);

        switch (type)
        {
            case LogType.Trace:
                this.logProvider.trace(formattedMessage);
                break;

            case LogType.Debug:
                this.logProvider.debug(formattedMessage);
                break;

            case LogType.Information:
                this.logProvider.info(formattedMessage);
                break;

            case LogType.Warning:
                this.logProvider.warn(formattedMessage);
                break;

            case LogType.Error:
                this.logProvider.error(formattedMessage);
                break;

            case LogType.Critical:
                if (this.logProvider.critical)
                {
                    this.logProvider.critical(formattedMessage);
                }
                else
                {
                    this.logProvider.error(formattedMessage);
                }
                break;
        }
    }

    trace(message: string, tag: string = null): void
    {
        this.log(message, LogType.Trace, tag);
    }

    debug(message: string, tag: string = null): void
    {
        this.log(message, LogType.Debug, tag);
    }

    information(message: string, tag: string = null): void
    {
        this.log(message, LogType.Information, tag);
    }

    warning(message: string, tag: string = null): void
    {
        this.log(message, LogType.Warning, tag);
    }

    error(message: string, tag: string = null): void
    {
        this.log(message, LogType.Error, tag);
    }

    critical(message: string, tag: string = null): void
    {
        this.log(message, LogType.Critical, tag);
    }
}

export interface ILogProvider
{
    trace(message: string): void;
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    critical?(message: string): void;
}
