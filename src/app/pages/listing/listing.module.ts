import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListingPageRoutingModule } from './listing-routing.module';

import { ListingPage } from './listing.page';
import { SearchbarComponent } from 'src/app/components/searchbar/searchbar.component';
import { CriterionItemComponent } from 'src/app/components/criterion-item/criterion-item.component';
import { TabsComponent } from 'src/app/components/shared/tabs/tabs.component';
import { SharedModule } from 'src/app/components/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListingPageRoutingModule,
    SharedModule
  ],
  declarations: [ListingPage, SearchbarComponent, CriterionItemComponent]
})
export class ListingPageModule {}
