/*!
 * Paradigm Framework - Angular Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { ServiceBase } from './base.service';
import { DateExtensions, Dictionary, StringExtensions } from '@miracledevs/paradigm-ui-web-shared';
import { Injectable } from '@angular/core';

/**
 * Represents a log provider.
 * The interface was specifically made to
 * match the one from @see console that is
 * the default provider used by @see LoggingService.
 */
export interface ILogProvider
{
    /**
     * Adds a trace log.
     * @param message the message to be logged.
     */
    trace(message: string): void;

    /**
     * Adds a debug log.
     * @param message the message to be logged.
     */
    debug(message: string): void;

    /**
     * Adds an info log.
     * @param message the message to be logged.
     */
    info(message: string): void;

    /**
     * Adds a warn log.
     * @param message the message to be logged.
     */
    warn(message: string): void;

    /**
     * Adds an error log.
     * @param message the message to be logged.
     */
    error(message: string): void;

    /**
     * Adds a critical error log.
     * @param message the message to be logged.
     */
    critical?(message: string): void;
}

/**
 * Enumerates the types of logging entries.
 */
export enum LogType
{
    /**
     * Represents a trace log.
     */
    Trace = 0,

    /**
     * Represents a debug log.
     */
    Debug = 1,

    /**
     * Represents an information log.
     */
    Information = 2,

    /**
     * Represents a warning log.
     */
    Warning = 3,

    /**
     * Represents an error log.
     */
    Error = 4,

    /**
     * Represents a critical error log.
     */
    Critical = 5
}

@Injectable({
    providedIn: 'root'
})
export class LoggingService extends ServiceBase
{
    /**
     * Error message.
     */
    private static readonly typeNotRecognized: string = 'The provided type is not recognized as a valid log type.';

    /**
     * An array of message templates.
     */
    private messageTemplates: string[];

    /**
     * The minimum log type that will logged.
     * Log types smaller than this value will be ignored.
     */
    private minimumLevel: LogType;

    /**
     * A log provider.
     * By default @see console will be used.
     */
    private logProvider: ILogProvider;

    /**
     * Creates a new instance of @see LoggingService.
     */
    constructor()
    {
        super();
        this.logProvider = console;
        const message = '[{0}][{1}] - {3}{2}';
        this.messageTemplates = new Array<string>();

        this.messageTemplates.push(message);
        this.messageTemplates.push(message);
        this.messageTemplates.push(message);
        this.messageTemplates.push(message);
        this.messageTemplates.push(message);
        this.messageTemplates.push(message);

        this.minimumLevel = LogType.Information;
    }

    /**
     * Sets a log provider.
     * By default @see console is used as provider.
     */
    setLogProvider(logProvider: ILogProvider): void
    {
        this.logProvider = logProvider;
    }

    /**
     * Sets the message template for a given log type.
     * There are some predefined content placeholders the user can utilize
     * to configure the custom messages:
     *
     * {0}: The time when the log was added.
     *
     * {1}: The type of the log (Trace, Debug , Information, etc)
     *
     * {2}: A custom tag value provided by the user.
     *
     * {3}: The log message.
     */
    setMessageTemplate(type: LogType, message: string): void
    {
        if (type < 0 || type >= this.messageTemplates.length)
        {
            throw new Error(LoggingService.typeNotRecognized);
        }

        this.messageTemplates[type] = message;
    }

    /**
     * Sets the minimum log level.
     * Log types smaller than this value will be ignored.
     */
    setMinimumLevel(type: LogType): void
    {
        if (type < 0 || type >= this.messageTemplates.length)
        {
            throw new Error(LoggingService.typeNotRecognized);
        }

        this.minimumLevel = type;
    }

    /**
     * Logs the specified message.
     * @param message the message to be logged.
     * @param type the type of log entry.
     * @param tag a tag value used for further analysis.
     */
    log(message: string, type: LogType = LogType.Trace, tag: string = null): void
    {
        if (type < 0 || type >= this.messageTemplates.length)
        {
            throw new Error(LoggingService.typeNotRecognized);
        }

        if (type < this.minimumLevel)
        {
            return;
        }

        const formattedMessage = StringExtensions.format(this.messageTemplates[type], DateExtensions.format(new Date(), 'hh:mm:ss'), LogType[type], tag, message);

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

    /**
     * Adds a trace log entry.
     * @param message the message to be logged.
     * @param tag a tag value for the entry.
     */
    trace(message: string, tag: string = null): void
    {
        this.log(message, LogType.Trace, tag);
    }

    /**
     * Adds a debug log entry.
     * @param message the message to be logged.
     * @param tag a tag value for the entry.
     */
    debug(message: string, tag: string = null): void
    {
        this.log(message, LogType.Debug, tag);
    }

    /**
     * Adds an information log entry.
     * @param message the message to be logged.
     * @param tag a tag value for the entry.
     */
    information(message: string, tag: string = null): void
    {
        this.log(message, LogType.Information, tag);
    }

    /**
     * Adds a warning log entry.
     * @param message the message to be logged.
     * @param tag a tag value for the entry.
     */
    warning(message: string, tag: string = null): void
    {
        this.log(message, LogType.Warning, tag);
    }

    /**
     * Adds an error log entry.
     * @param message the message to be logged.
     * @param tag a tag value for the entry.
     */
    error(message: string, tag: string = null): void
    {
        this.log(message, LogType.Error, tag);
    }

    /**
     * Adds a critical error log entry.
     * @param message the message to be logged.
     * @param tag a tag value for the entry.
     */
    critical(message: string, tag: string = null): void
    {
        this.log(message, LogType.Critical, tag);
    }
}
