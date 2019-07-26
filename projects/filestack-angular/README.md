<h1 align="center">
  filestack-angular
</h1>
<p align="center">
  Angular component library which allow you to easily integrate powerful filestack-api into your app.
</p>

**Table of Contents**
- [Overview](#overview)
- [Usage](#usage)
  - [Installation](#installation)
  - [CDN](#cdn)
  - [Available inputs](#available-inputs)
  - [Available outputs](#available-outputs)
  - [FilestackService](#FilestackService)
  - [Examples](#examples)
- [Documentation](#documentation)
- [Development](#development)
- [Contributing](#contributing)

## Overview
filestack-angular is a kind of wrapper on [filestack-js](https://github.com/filestack/filestack-js) sdk which allow you to integrate with filestack service in just a few lines of code. Almost all you are able to do with [filestack-js](https://filestack.github.io/filestack-js/index.html) you can also do using this component.

This repository a contains angular workspace with two projects:
- `filestack-angular` library which contains `FilestackAngularModule` published via npm
- `example` angular app to show examples of using `FilestackModule` features

`FilestackAngularModule` consists of 
- **FilestackService** - wrapper for a filestack-js client class with added support for an observables
- **FilestackTransformPipe** - Pipe for easily creating url with [transformations](https://www.filestack.com/docs/api/processing/)  in your template
- **PickerOverlayComponent** - Filestack picker component that will open in overlay mode
- **PickerInlineComponent** - Filestack picker component that will open in a provided html container
- **PickerDropPaneComponent** - Filestack drop pane component that will open in a provided html container
which can be also used independently if needed

## Usage
### Installation
Install it through NPM
```bash
npm install filestack-js
npm install @filestack/angular
```
Include ```FilestackModule``` in ```app.module.ts```
```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FilestackModule } from '@filestack/angular';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FilestackModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
Use in .html file
```html
<ng-picker-overlay
  apikey="YOUR_API_KEY">
</ng-picker-overlay>
```
### CDN
In the case you would like to import `filestack-module` bundle file directly to your app
instead of using npm package you can find it on our cdn:
```
https://static.filestackapi.com/filestack-angular/{MODULE_VERSION}/filestack-angular.umd.min.js
```
```
https://static.filestackapi.com/filestack-angular/{MODULE_VERSION}/filestack-angular.umd.min.js.map
```
where {MODULE_VERSION} is desired version of this package
### Available inputs
| Name                       | Type                                                                                  | Required                                            | Default  | Description                                                                                             |
|----------------------------|---------------------------------------------------------------------------------------|-----------------------------------------------------|----------|---------------------------------------------------------------------------------------------------------|
| apikey                     | String                                                                                | True                                                |          | Filestack api key                                                                                       |
| options                    | Object                                                                                |                                                     |          | Check [pickerOptions](https://filestack.github.io/filestack-js/interfaces/pickeroptions.html)             |
| clientOptions.cname        | String                                                                                |                                                     |          | Check [cname](https://filestack.github.io/filestack-js/interfaces/clientoptions.html#cname)               |
| clientOptions.security     | Object([Security](https://filestack.github.io/filestack-js/interfaces/security.html))   |                                                     |          | Check [security](https://filestack.github.io/filestack-js/interfaces/clientoptions.html#security)         |
| clientOptions.sessionCache | Boolean                                                                               |                                                     |          | Check [sessionCache](https://filestack.github.io/filestack-js/interfaces/clientoptions.html#sessioncache) |
| file                        | [InputFile](https://filestack.github.io/filestack-js/globals.html#inputfile)       |     |                                                     |          | Use it to insert a file object for 'upload' action                                                                  |
| source                     | String                                                                                |                                                     |          | Filestack handle or external url. Use it for 'transform', 'remove', 'metadata' or 'preview' action      |

### Available outputs
| Name                       | Type                                                                                  | Required | Default  | Description                                                                                                                                        |
|----------------------------|---------------------------------------------------------------------------------------|----------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| uploadSuccess              | Subject<PickerResponse>                                                               |          |          | A subject that emits on uploadSuccess event                                                                                                              |
| uploadError                | Subject<FilestackError>                                                               |          |          | A subject that emits on uploadError event   

### FilestackService
The `FilestackService` is an adapter on filestack-js [client class](https://filestack.github.io/filestack-js/classes/client.html)
and allows you to work with Observables instead of promises. 
Methods get the same input params as client class method.

| method            | return                                                                                    | description                                                                  |
|-------------------|-------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| init              | void                                                                                      | Init filestack client with your apikey                                        |
| picker            | [PickerInstance](https://filestack.github.io/filestack-js/interfaces/pickerinstance.html)   | Open or close picker instance                                                |
| transform         | string                                                                                    | Create a transformation url                                                  |
| retrieve          | Observable                                                                                | Retrieve an info about a filestack handle                                     |
| metadata          | Observable                                                                                | Access files via their Filestack handles                                      |
| storeURL          | Observable                                                                                | Get info about a filestack handle metadata                                    |
| upload            | Observable                                                                                | Upload a file to the Filestack                                                |
| remove            | Observable                                                                                | Remove a file from the Filestack                                              |
| removeMetadata    | Observable                                                                                | Remove a file only from the Filestack system. The file remains in storage.     |
| preview           | HTMLIFrameElement | Window                                                                | Get preview of uploaded file (need additional addon in your Filestack account)|
| logout            | Observable                                                                                | Clear cloud session from picker procviders                                   |
| setClientInstance | [ClientInstance](https://filestack.github.io/filestack-js/classes/client.html)              | Put an existing client instance into filestack service                        |

### Examples
Below you can find some basic examples.

You can also find and try these examples in `angular-filestack-example` app

To run it locally type

```
ng serve filestack-angular-example
```
then visit

```
http://localhost:4200/
```

#### Open picker directly after component initialization

`component.ts`
```typescript
export class AppComponent implements OnInit {
  apikey: string;

  ngOnInit() {
    this.apikey = 'YOUR_API_KEY';
  }
}
```

`component.html`
```html
<ng-picker-overlay
  [apikey]="apikey">
</ng-picker-overlay>
```

#### Open picker by clicking the custom button

`component.ts`
```typescript
export class AppComponent implements OnInit {
  apikey: string;

  ngOnInit() {
    this.apikey = 'YOUR_API_KEY';
    this.onSuccess = (res) => console.log('###onSuccess', res);
    this.onError = (err) => console.log('###onErr', err);
  }

  onUploadSuccess(res: object) {
    console.log('###uploadSuccess', res);
  }

  onUploadError(err: any) {
    console.log('###uploadError', err);
  }
}
```

`component.html`
```html
<ng-picker-overlay
  [apikey]="apikey"
  (uploadSuccess)="onUploadSuccess($event)"
  (uploadError)="onUploadError($event)">
  <button>Open picker</button>
</ng-picker-overlay>
```
#### Open picker in inline mode

`component.ts`
```typescript
export class AppComponent implements OnInit {
  apikey: string;

  ngOnInit() {
    this.apikey = 'YOUR_API_KEY';
  }

  onUploadSuccess(res: object) {
    console.log('###uploadSuccess', res);
  }

  onUploadError(err: any) {
    console.log('###uploadError', err);
  }
}
```

`component.html`
```html
<ng-picker-inline
  [apikey]="apikey"
  (uploadSuccess)="onUploadSuccess($event)"
  (uploadError)="onUploadError($event)">
  <button>Open picker</button>
</ng-picker-inline>
```

#### Open picker in drop pane mode

`component.ts`
```typescript
export class AppComponent implements OnInit {
  apikey: string;

  ngOnInit() {
    this.apikey = 'YOUR_API_KEY';
  }

  onUploadSuccess(res: object) {
    console.log('###uploadSuccess', res);
  }

  onUploadError(err: any) {
    console.log('###uploadError', err);
  }
}
```

`component.html`
```html
<ng-picker-drop-pane
  [apikey]="apikey"
  (uploadSuccess)="onUploadSuccess($event)"
  (uploadError)="onUploadError($event)">
</ng-picker-drop-pane>
```
#### Get transformed url using filestackTransform pipe

`component.ts`
```typescript
...
import { TransformOptions } from 'filestack-js';

export class AppComponent implements OnInit {
  transformOptions: TransformOptions;

  constructor(private filestackService: FilestackService) {}

  ngOnInit() {
    this.transformOptions = {
      resize: {
        width: 400
      },
      sepia: {
        tone: 80
      }
    }
  }
}
```

`component.html`
```html
  <img src="{{'5aYkEQJSQCmYShsoCnZN' | filestackTransform: transformOptions}}">
```
#### Select file and upload using sdk client.upload()

`component.ts`
```typescript
export class AppComponent implements OnInit {
  file: any;

  constructor(private filestackService: FilestackService) {}

  ngOnInit() {
    this.filestackService.init('YOUR_API_KEY'); 
  }
  fileChanged(e) {
    this.file = e.target.files[0];
  }
  uploadFile() {
    this.filestackService.upload(this.file)
      .subscribe(res => console.log(res));
  }
}
```

`component.html`
```html
  <input type='file' (change)="fileChanged($event)">
  <button (click)="uploadFile()">Upload file</button>
```

## Documentation
You can find necessary info about avalaible options for actions (Client class methods) at https://filestack.github.io/filestack-js/

## Development
After adding changes to `FilestackAngularModule` in /projects/filestack-angular/src 

you need to build this module

```
ng build filestack-angular
```

this command will produce /dist which conatins ready to use filestack module

you can check correctness of it by checking examples from `example` app:

1. Update api key in `/projects/example/src/app/app.component.ts`

2. start app locally
```
ng serve example
```
3. visit [http://localhost:4200/](http://localhost:4200/)

## Contributing
Any of your contributions or ideas are more than welcome. Please consider that we follow the conventional commits specification to ensure consistent commit messages and changelog formatting.