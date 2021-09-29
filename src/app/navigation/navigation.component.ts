import { Component, OnInit, Renderer2, RendererFactory2 } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  private renderer: Renderer2
  constructor(rendererFactory: RendererFactory2) {this.renderer = rendererFactory.createRenderer(null, null) }

  ngOnInit(): void {
  }
  chBackground(event: any, className: string):void {
    const hasClass = event.target.parent.classList.contains('active');
console.log(hasClass)
    if(hasClass) {
      this.renderer.removeClass(event.target, 'active');
    } else {
      this.renderer.addClass(event.target, 'active');
    }
    // document.navigation.nav_item.style.background = '#dddddd'
}

}

