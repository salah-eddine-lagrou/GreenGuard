import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { FaqComponent } from 'src/app/components/faq/faq.component';
import { AboutGreenguardComponent } from 'src/app/components/about-greenguard/about-greenguard.component';
import { AboutUsComponent } from 'src/app/components/about-us/about-us.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    SharedModule
  ],
  declarations: [SettingsPage, FaqComponent, AboutGreenguardComponent, AboutUsComponent]
})
export class SettingsPageModule {}
