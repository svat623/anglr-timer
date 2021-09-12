import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class TickService {
  s:number=0;
  isStop:boolean=true;
  isWait:boolean=false;
  mysub:Subscription=new Subscription();
  
  constructor() {}
}
