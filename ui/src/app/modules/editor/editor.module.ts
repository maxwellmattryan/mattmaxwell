import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@app/modules/material/material.module';

import { EditorComponent } from './editor.component';
import { EditorRoutingModule } from './editor-routing.module';

import {
    PostEditorComponent,
    ProjectEditorComponent,
    TopicEditorComponent
} from './components';

@NgModule({
    declarations: [
        EditorComponent, 
        PostEditorComponent,
        ProjectEditorComponent,
        TopicEditorComponent
    ],
    imports: [
        CommonModule,
        EditorRoutingModule, 
        MaterialModule,
        ReactiveFormsModule
    ]
})
export class EditorModule { }