import { Pipe, PipeTransform, inject } from '@angular/core';
import { TimerService } from '../services/timer';

@Pipe({
  name: 'timeDisplay',
  standalone: true,
})
export class TimeDisplayPipe implements PipeTransform {
  private timer = inject(TimerService);

  transform(ms: number): string {
    return this.timer.formatMs(ms);
  }
}