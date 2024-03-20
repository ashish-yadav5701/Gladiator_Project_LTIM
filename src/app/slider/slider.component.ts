import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  sliderSource:string;
  currentIndex:number=0;
  images:string[]=["assets/birthday_event.jpg","assets/Event-Planning-Business-in-plan.jpg","assets/Family-Reunion-event.jpg","assets/wedding_event.jpg"]
  caption:string[]=["Birthday celebrations","Business Events","Get togather","Wedding"]
  constructor() {      setInterval(()=>{
    this.currentIndex=(this.currentIndex+1)%this.images.length;
    this.sliderSource=this.images[this.currentIndex];
   },2000)}

  ngOnInit(): void {

  }
  
}
