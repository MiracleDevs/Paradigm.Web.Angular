import { TestBed } from '@angular/core/testing';
import { GeolocationService, IGeolocationProvider, Coordinate, GeolocationWatcher } from './geolocation.service';

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

        setTimeout(() => watcher.onInformationReceived({ latitude: 0, longitude: 0 }), 200);

        return watcher;
    }

    unregisterWatcher(watcher: GeolocationWatcher): void
    {
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

        it('should create a geolocation watcher', (done: () => void) =>
        {
            const service: GeolocationService = TestBed.get(GeolocationService);
            service.setGeolocationProvider(new MockAvailableGeolocationProvider());

            const watcher = service.registerWatcher();

            watcher.onInformationReceived = coordinates =>
            {
                expect(coordinates).toBeDefined();
                expect(coordinates.latitude).toBe(0);
                expect(coordinates.longitude).toBe(0);
                done();
            };
        }, 1000);
    });
});
