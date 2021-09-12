import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { empty, fromEvent, interval, merge } from 'rxjs';
import { bufferTime, filter, map, mapTo, startWith, switchMap, tap } from 'rxjs/operators';
import { TickService } from './tick.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'anglr-timer';
  @ViewChild('wait') wait:any;
  @ViewChild('start') start:any;
  @ViewChild('reset') reset:any;
  
  constructor(private tick:TickService) {}

  get tmstate() {
    return {
      s: this.tick.s,
      isWait: this.tick.isWait,
      isStop: this.tick.isStop
    };
  }

  ngAfterViewInit() {
    let interval$ = interval(100).pipe(mapTo(1));

    let pause$ = fromEvent(this.wait.nativeElement,'click')
    .pipe(
      bufferTime(500),
      map(clicks => clicks.length),
      filter(clicks => clicks == 2),
      tap(_=> {
        if(!this.tick.isStop) this.tick.isWait=true
      } ),
      mapTo(false)
    );

    let resume$ = fromEvent(this.start.nativeElement,'click')
    .pipe(
      tap((e) => {
        if(!this.tick.isWait) {
          this.tick.isStop = !this.tick.isStop;
        } else {
          this.tick.isWait = false;
        }
      })
    );

    let reset$ = fromEvent(this.reset.nativeElement,'click')
    .pipe(
      tap(_ => {
        this.tick.s=0;
      })
    );

    let flow$ = merge(resume$, reset$).pipe(map(_=>{
        if(!this.tick.isStop && !this.tick.isWait) {
          return true;
        } else {
          this.tick.s=0;
          return false;
        }
      })
    );
    
    this.tick.mysub =merge(pause$, flow$).pipe(
        startWith(false),
        switchMap(val => (val ? interval$ : empty()))
      ).subscribe((val) => {
         this.tick.s+=val*100;
    });  
  }
}
