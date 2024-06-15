import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { FaqComponent } from 'src/app/components/faq/faq.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    SharedModule
  ],
  declarations: [SettingsPage, FaqComponent]
})
export class SettingsPageModule {}
