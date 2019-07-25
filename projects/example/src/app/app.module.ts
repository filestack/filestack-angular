import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FilestackModule } from './../../../../dist/filestack-angular';
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
