import { Component, VERSION, ViewChildren } from '@angular/core';
import { HelloComponent } from './hello.component';
import { timer } from 'rxjs';
import { takeLast } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular ' + VERSION.major;
  arr: any[] = [];
  count = 20;

  data = null;
  showToast = false;
  @ViewChildren(HelloComponent) greetings;

  private intersectionObserver: IntersectionObserver;


  ngOnInit() {
    this.generateColors();
  }

  generateColors() {
    let arr = this.arr.slice();
    if (!arr.length) { arr.length = this.count; }
    for(let x = 0; x < arr.length; x++) {
      const hue = Math.floor(Math.random() * 255);
      const hue2 = Math.floor(Math.random() * 255);
      const hue3 = Math.floor(Math.random() * 255);
      const string = 'hsla(${hue}%, 100%, 50%, 1)'
      const bg = { background: `rgba(${hue}, ${hue2}, ${ hue3 })` }
      arr[x] = {
        bg,
        hue
      }
    }

    this.arr = arr;
  }

  refreshColors() {
    this.disposeObservers();
    this.generateColors();
    console.log('x')
    const defer = timer().subscribe(() => {
      defer.unsubscribe();
      console.log(defer.closed, document.querySelectorAll('hello'));
      this.connectObservers();
    });
    console.log(defer.closed);
  }

  ngAfterViewInit() {
    let options = {
      root: document.querySelector('body'),
      rootMargin: '0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    }

    this.intersectionObserver = new IntersectionObserver((entries, observer) => {
      const greetings: HelloComponent[] = Array.from(this.greetings);
      const greetingEls = Array.from(document.querySelectorAll('hello'));
      entries.forEach((entry) => {
        let target = entry.target;
        let index = greetingEls.indexOf(target);
        const el = greetings[index];
        const inViewPort = entry.intersectionRatio >= 0.1;
        if (el.shouldTrigger && !el.isVisible && inViewPort) { 
          console.log('updating', el.name);
          el.trigger();
        } else if(!inViewPort && el.isVisible){
          console.log(el.shouldTrigger, 'hiding', el.name);
          el.toggle(false);
        } else if(inViewPort && !el.isVisible){
          console.log(el.shouldTrigger, 'showing', el.name);
          el.toggle(true);
        }
      });
    }, options);
    
    this.connectObservers();
  }

  clickity() {
    const random = Math.floor(Math.random() * 255);
    this.data = { random };

    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }

  remove(i){
    const hello = document.querySelectorAll('hello')[i];
    this.intersectionObserver.unobserve(hello);
    console.log('removed', this.arr.splice(i, 1))
    this.resetObserver();
  }

  disposeObservers() {
    this.intersectionObserver.disconnect();
  }

  connectObservers() {
    console.log('y')
    const greetingEls = Array.from(document.querySelectorAll('hello'));
    greetingEls.forEach((hello, i) => {
      this.intersectionObserver.observe(hello);
    });
  }

  resetObserver() {
    this.disposeObservers();
    this.connectObservers();
  }

  trackByFunc(i, x) {
    return i//x.hue;
  }
}
