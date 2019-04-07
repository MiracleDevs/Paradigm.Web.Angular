[![Build Status](https://travis-ci.org/MiracleDevs/Paradigm.Web.Angular.svg?branch=master)](https://travis-ci.org/MiracleDevs/Paradigm.Web.Angular)

# Paradigm.Web.Angular
A Angular Library with base classes and helper services.

# Releases

## v0.0.1
- Added a base component for all the application components, with helper protected methods.
  Most of the methods are lazy, and won't affect the component if not used.
- Added modal component base to use in conjunction with the `ModalService`.
- Added `Message` decorator to use in conjunction with the `MessageBusService`.
- Added `AlertService` to handle application alerts. The alert service holds an array of alerts
  than can be shared and binded to the UI to show the alerts to the end user.
- Added `FileService` to handle file related tasks. For now reads the file contents using a `FileReader`
  and ensures that all the events are correctly added and removed before leaving the context.
- Added `GeolocationService` that is agnostic from the implementation. By default, it will use the navigator
  provider, but can be changed on different platforms.
- Added `LoggingService` to handle application logs. Loke the geolocation service, the `LoggingService` is also
  agnostic and the user can provide their own provider. By default, the logging will use the console provider.
- Added `MessageBusService` to manage and handle application messaging. Allows the user to create custom messages
  and send these messages from anywhere in the application, decoupling the different layers.
- Added `ModalService` to allow the component logic to order the opening of a modal. Modal components are created,
  handled and destroyed by the `ModalService`. Remember to add the modal components not only in the `declarations` array,
  but also in the `entryComponents` in your module, or angular will trim your components because they won't be used
  anywhere in your templating code.