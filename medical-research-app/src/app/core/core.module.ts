import { NgModule } from '@angular/core';
import { Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guards/auth.guard';
//import { LoggerService } from './services/logger.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    //LoggerService,
    AuthGuard,
    // 👇 Do NOT add interceptors here; register them in AppModule only
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it only in AppModule!'
      );
    }
  }
}
