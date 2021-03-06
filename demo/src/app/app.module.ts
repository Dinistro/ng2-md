import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import {
    MdInputModule,
    MdSlideToggleModule,
    MdSliderModule,
    MdToolbarModule,
    MdButtonModule,
    MdListModule,
    MdSidenavModule,
    MdIconModule
} from '@angular/material';
import { AppComponent } from './app.component';
import { MdModule } from '../../../src';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        MdModule,
        // material
        MdInputModule,
        MdSlideToggleModule,
        MdSliderModule,
        MdToolbarModule,
        MdButtonModule,
        MdListModule,
        MdSidenavModule,
        MdIconModule
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}