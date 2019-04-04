/*!
 * Paradigm Framework - Angular Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { ServiceBase } from './base.service';
import { ObjectExtensions } from '@miracledevs/paradigm-ui-web-shared';
import { Injectable } from '@angular/core';

/**
 * Represents the response of the geolocation service.
 */
export interface Coordinate
{
    /**
     * the latitude as a decimal number (always returned).
     */
    latitude: number;

    /**
     * the longitude as a decimal number (always returned).
     */
    longitude: number;

    /**
     * the accuracy of position (always returned).
     */
    accuracy?: number;

    /**
     * the altitude in meters above the mean sea level (returned if available).
     */
    altitude?: number;

    /**
     * the altitude accuracy of position (returned if available).
     */
    altitudeAccuracy?: number;

    /**
     * the heading as degrees clockwise from North (returned if available).
     */
    heading?: number;

    /**
     * the speed in meters per second (returned if available).
     */
    speed?: number;
}

/**
 * Represents the @see navigator.geolocation options.
 */
export interface IPositionOptions
{
    /**
     * Indicates if the geolocation should have high accuracy to find the current position.
     */
    enableHighAccuracy?: boolean;

    /**
     * A timeout value for the geolocation query.
     */
    timeout?: number;

    /**
     * The maximum age for the request.
     */
    maximumAge?: number;
}


/**
 * Represents a geolocation watcher.
 * It listens for geolocation events.
 */
export class GeolocationWatcher
{
    /**
     * The geolocation watch operation index.
     */
    private watchIndex: number;

    /**
     * Indicates if the watcher is being unregistered.
     */
    private beingUnregistered: boolean;

    /**
     * Event called when the geolocation service reports new geolocation information.
     * @param coordinates the new geolocation coordinates.
     */
    onInformationReceived: (coordinates: Coordinate) => void;

    /**
     * Event called when the geolocation service found an error.
     * @param error the error found.
     */
    onError: (error: string) => void;

    /**
     * Creates a new instance of @see GeolocationWatcher
     * @param geolocation a reference to the geolocation service.
     */
    constructor(private geolocation: IGeolocationProvider)
    {
        this.watchIndex = -1;
    }

    /**
     * Register the watcher and stores the watch operation index.
     * @param index the index representing this watch operation.
     */
    register(index: number): void
    {
        if (!this.isDisposed())
        {
            throw new Error('This watcher can not be registered again.');
        }

        this.watchIndex = index;
    }

    /**
     * Unregisters the watcher.
     * Once unregistered, the watcher does not receives any more events.
     */
    unregister(): void
    {
        if (this.isDisposed())
        {
            throw new Error('This watcher has not been properly registered.');
        }

        this.beingUnregistered = true;
        this.geolocation.unregisterWatcher(this);
        this.beingUnregistered = false;
        this.watchIndex = -1;
    }

    /**
     * Gets the watch index.
     */
    getWatchIndex(): number
    {
        return this.watchIndex;
    }

    /**
     * Indicates if this watcher is disposed.
     */
    isDisposed(): boolean
    {
        return this.watchIndex < 0;
    }

    /**
     * Indicates if the watcher is being unregistered.
     */
    isBeingUnregistered(): boolean
    {
        return this.beingUnregistered;
    }
}

/**
 * Provides a common interface for different geolocation providers.
 */
export interface IGeolocationProvider
{
    /**
     * Indicates if the geolocation provider is available.
     */
    isAvailable(): boolean;

    /**
     * Gets the current geolocation.
     */
    getGeolocation(): Promise<Coordinate>;

    /**
     * Registers a new geolocation watcher.
     */
    registerWatcher(): GeolocationWatcher;

    /**
     * Unregisters a geolocation watcher.
     * @param watcher the watcher that will be unregistered.
     */
    unregisterWatcher(watcher: GeolocationWatcher): void;
}

/**
 * Implements the geolocation provider api using the @see navigator.geolocation
 */
export class NavigationGeolocationProvider implements IGeolocationProvider
{
    /**
     * Creates a new instance of @see NavigationGeolocationProvider
     * @param options geolocation options.
     */
    constructor(private options?: IPositionOptions)
    {
    }

    /**
     * Gets the current geolocation if a service geolocation service is available.
     */
    getGeolocation(): Promise<Coordinate>
    {
        if (this.isAvailable())
        {
            return new Promise((resolve, reject) => this.getGeoLocator().getCurrentPosition(
                info => resolve(info.coords),
                error => reject(error.message),
                this.options));
        }

        return Promise.reject('The geolocation service is not available.');
    }

    /**
     * Registers a geolocation watcher to lister for geolocation events.
     */
    registerWatcher(): GeolocationWatcher
    {
        if (this.isAvailable())
        {
            const watcher = new GeolocationWatcher(this);

            watcher.register(this.getGeoLocator().watchPosition(
                info =>
                {
                    if (watcher.onInformationReceived)
                    {
                        watcher.onInformationReceived(info.coords);
                    }
                }, error =>
                {
                    if (watcher.onError)
                    {
                        watcher.onError(error.message);
                    }
                }, this.options));

            return watcher;
        }

        throw new Error('The geolocation service is not available.');
    }

    /**
     * Unregisters the geolocation watcher.
     * @param watcher the watcher that will be unregistered.
     */
    unregisterWatcher(watcher: GeolocationWatcher): void
    {
        if (!watcher.isBeingUnregistered())
        {
            throw new Error('Can not call this method directly. Call GeolocationWatcher.unregister instead.');
        }

        if (this.isAvailable())
        {
            this.getGeoLocator().clearWatch(watcher.getWatchIndex());
        }
    }

    /**
     * Indicates if the geolocation service is available.
     */
    isAvailable(): boolean
    {
        return !ObjectExtensions.isNull(navigator.geolocation) &&
            !ObjectExtensions.isNull(navigator.geolocation.getCurrentPosition) &&
            !ObjectExtensions.isNull(navigator.geolocation.watchPosition) &&
            !ObjectExtensions.isNull(navigator.geolocation.clearWatch);
    }

    /**
     * Gets the geolocation service.
     */
    private getGeoLocator(): Geolocation
    {
        return navigator.geolocation;
    }
}

@Injectable({
    providedIn: 'root'
})
export class GeolocationService extends ServiceBase
{
    /**
     * Reference to a geolocation provider.
     */
    private geolocationProvider: IGeolocationProvider;

    /**
     * Creates a new instance of @see GeolocationService
     * By default @see GeolocationService uses @see NavigationGeolocationProvider as provider.
     * The provider can be changed using @see GeolocationService.setGeolocationProvider
     */
    constructor()
    {
        super();
        this.geolocationProvider = new NavigationGeolocationProvider();
    }

    /**
     * Sets the geolocation provider.
     * @param provider geolocation provider.
     */
    setGeolocationProvider(provider: IGeolocationProvider): void
    {
        if (!provider)
        {
            throw new Error('The geolocation provider can not be null or undefined.');
        }

        this.geolocationProvider = provider;
    }

    /**
     * Gets the current geolocation if a service geolocation service is available.
     * @param options the geolocation options.
     */
    async getGeolocation(): Promise<Coordinate>
    {
        return await this.geolocationProvider.getGeolocation();
    }

    /**
     * Registers a geolocation watcher to lister for geolocation events.
     * @param options the geolocation options.
     */
    registerWatcher(): GeolocationWatcher
    {
        return this.geolocationProvider.registerWatcher();
    }

    /**
     * Indicates if the geolocation service is available.
     */
    isAvailable(): boolean
    {
        return this.geolocationProvider.isAvailable();
    }
}
