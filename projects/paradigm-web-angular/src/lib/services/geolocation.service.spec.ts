import { TestBed } from '@angular/core/testing';
import { NavigationGeolocationProvider, GeolocationService, IGeolocationProvider, Coordinate, GeolocationWatcher } from './geolocation.service';

class MockAvailableGeolocationProvider implements IGeolocationProvider
{
    isAvailable(): boolean
    {
        return true;
    }

    getGeolocation(): Promise<Coordinate>
    {
        return Promise.resolve({ latitude: 0, longitude: 0 });
    }

    registerWatcher(): GeolocationWatcher
    {
        const watcher = new GeolocationWatcher(this);

        watcher.register(1);

        setTimeout(() =>
        {
            if (watcher.onInformationReceived)
            {
                watcher.onInformationReceived({ latitude: 0, longitude: 0 });
            }
        }, 200);

        return watcher;
    }

    unregisterWatcher(watcher: GeolocationWatcher): void
    {
        if (!watcher.isBeingUnregistered())
        {
            throw new Error('Can not call this method directly. Call GeolocationWatcher.unregister instead.');
        }
    }
}

describe('GeolocationService', () =>
{
    beforeEach(() => TestBed.configureTestingModule({}));

    describe('creating the service', () =>
    {
        it('should be created', () =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            expect(service).toBeTruthy();
        });
    });

    describe('using the service', () =>
    {
        it('should change the geolocation provider', () =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            expect(() => service.setGeolocationProvider(new MockAvailableGeolocationProvider())).not.toThrow();
        });

        it('should fail when the geolocation provider is null', () =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            expect(() => service.setGeolocationProvider(null)).toThrow();
        });

        it('should fail when the geolocation provider is undefined', () =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            expect(() => service.setGeolocationProvider(undefined)).toThrow();
        });

        it('should be available', () =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            service.setGeolocationProvider(new MockAvailableGeolocationProvider());
            expect(service.isAvailable()).toBeTruthy();
        });

        it('should get geolocation information', (done: () => void) =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            service.setGeolocationProvider(new MockAvailableGeolocationProvider());

            service.getGeolocation().then(coordinates =>
            {
                expect(coordinates).toBeDefined();
                expect(coordinates.latitude).toBe(0);
                expect(coordinates.longitude).toBe(0);
                done();
            });
        }, 1000);

        it('should register a geolocation watcher', (done: () => void) =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            service.setGeolocationProvider(new MockAvailableGeolocationProvider());

            const watcher = service.registerWatcher();

            expect(watcher.isDisposed()).toBeFalsy();
            expect(watcher.getWatchIndex()).toBeGreaterThanOrEqual(0);

            watcher.onInformationReceived = coordinates =>
            {
                expect(coordinates).toBeDefined();
                expect(coordinates.latitude).toBe(0);
                expect(coordinates.longitude).toBe(0);
                done();
            };
        }, 1000);

        it('should unregister a geolocation watcher', (done: () => void) =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            service.setGeolocationProvider(new MockAvailableGeolocationProvider());

            const watcher = service.registerWatcher();

            watcher.onInformationReceived = coordinates =>
            {
                expect(coordinates).toBeDefined();
                expect(coordinates.latitude).toBe(0);
                expect(coordinates.longitude).toBe(0);
                expect(() => watcher.unregister()).not.toThrow();
                expect(watcher.isDisposed()).toBeTruthy();

                done();
            };
        }, 1000);

        it('should fail when registering a watcher twice', () =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            service.setGeolocationProvider(new MockAvailableGeolocationProvider());

            const watcher = service.registerWatcher();
            expect(() => watcher.register(1)).toThrow();
        });

        it('should fail when unregistering a watcher twice', () =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            service.setGeolocationProvider(new MockAvailableGeolocationProvider());

            const watcher = service.registerWatcher();
            watcher.unregister();
            expect(() => watcher.unregister()).toThrow();
        });
    });

    describe('using navigation.geolocation', () =>
    {
        let getCurrentPosition = null;
        let watchPosition = null;

        beforeAll(() =>
        {
            getCurrentPosition = navigator.geolocation.getCurrentPosition;
            watchPosition = navigator.geolocation.watchPosition;

            navigator.geolocation.getCurrentPosition = (success) =>
                success({
                    coords: {
                        latitude: 0,
                        longitude: 0,
                        accuracy: 0,
                        altitude: 0,
                        altitudeAccuracy: 0,
                        speed: 0,
                        heading: 0
                    },
                    timestamp: Date.now(),
                });

            navigator.geolocation.watchPosition = (success) =>
            {
                setTimeout(() =>
                {
                    success({
                        coords: {
                            latitude: 0,
                            longitude: 0,
                            accuracy: 0,
                            altitude: 0,
                            altitudeAccuracy: 0,
                            speed: 0,
                            heading: 0
                        },
                        timestamp: Date.now(),
                    });
                });
                return 1;
            };
        });

        afterAll(() =>
        {
            navigator.geolocation.getCurrentPosition = getCurrentPosition;
            navigator.geolocation.watchPosition = watchPosition;
        });

        it('should be available', () =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            expect(service.isAvailable()).toBeTruthy();
        });

        it('should get geolocation information', (done: () => void) =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);

            service.getGeolocation().then(coordinates =>
            {
                expect(coordinates).toBeDefined();
                expect(coordinates.latitude).toBe(0);
                expect(coordinates.longitude).toBe(0);
                done();
            });
        }, 1000);

        it('should register a geolocation watcher', (done: () => void) =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            const watcher = service.registerWatcher();

            watcher.onInformationReceived = coordinates =>
            {
                expect(coordinates).toBeDefined();
                expect(coordinates.latitude).toBe(0);
                expect(coordinates.longitude).toBe(0);
                done();
            };
        }, 1000);

        it('should unregister a geolocation watcher', (done: () => void) =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            const watcher = service.registerWatcher();

            watcher.onInformationReceived = coordinates =>
            {
                expect(coordinates).toBeDefined();
                expect(coordinates.latitude).toBe(0);
                expect(coordinates.longitude).toBe(0);
                expect(() => watcher.unregister()).not.toThrow();
                expect(watcher.isDisposed()).toBeTruthy();

                done();
            };
        }, 1000);

        it('should fail when unregistering from the provider', () =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            const provider = new NavigationGeolocationProvider();
            const watcher = service.registerWatcher();
            expect(() => provider.unregisterWatcher(watcher)).toThrow();
        });
    });

    describe('using without navigation.geolocation', () =>
    {
        let getCurrentPosition = null;
        let watchPosition = null;

        beforeAll(() =>
        {
            getCurrentPosition = navigator.geolocation.getCurrentPosition;
            watchPosition = navigator.geolocation.watchPosition;
            navigator.geolocation.getCurrentPosition = null;
            navigator.geolocation.watchPosition = null;
        });

        afterAll(() =>
        {
            navigator.geolocation.getCurrentPosition = getCurrentPosition;
            navigator.geolocation.watchPosition = watchPosition;
        });

        it('shouldnt be available', () =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            expect(service.isAvailable()).toBeFalsy();
        });

        it('should fail when getting the geolocation information', (done: () => void) =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);

            service.getGeolocation().then(null, error =>
            {
                expect(error).toBeDefined();
                done();
            });
        }, 1000);

        it('should fail when registering a geolocation watcher', () =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            expect(() => service.registerWatcher()).toThrow();
        });
    });

    describe('using navigation.geolocation with errors', () =>
    {
        let getCurrentPosition = null;
        let watchPosition = null;

        beforeAll(() =>
        {
            getCurrentPosition = navigator.geolocation.getCurrentPosition;
            watchPosition = navigator.geolocation.watchPosition;

            navigator.geolocation.getCurrentPosition = (_, fail) => fail({
                code: 0,
                message: 'Unable to get the geolocation',
                PERMISSION_DENIED: 0,
                POSITION_UNAVAILABLE: 0,
                TIMEOUT: 0
            });

            navigator.geolocation.watchPosition = (_, fail) =>
            {
                setTimeout(() =>
                {
                    fail({
                        code: 0,
                        message: 'Unable to get the geolocation',
                        PERMISSION_DENIED: 0,
                        POSITION_UNAVAILABLE: 0,
                        TIMEOUT: 0
                    });
                });
                return 1;
            };
        });

        afterAll(() =>
        {
            navigator.geolocation.getCurrentPosition = getCurrentPosition;
            navigator.geolocation.watchPosition = watchPosition;
        });

        it('should fail whilst getting geolocation information', (done: () => void) =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);

            service.getGeolocation().then(null, error =>
            {
                expect(error).toBeDefined();
                done();
            });
        }, 1000);

        it('should fail whilst registering a geolocation watcher', (done: () => void) =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            const watcher = service.registerWatcher();

            watcher.onError = error =>
            {
                expect(error).toBeDefined();
                done();
            };
        }, 1000);
    });
});
