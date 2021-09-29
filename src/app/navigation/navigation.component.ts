import { Component, OnInit, Renderer2, RendererFactory2 } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  private renderer: Renderer2
  private element: any
  constructor(rendererFactory: RendererFactory2) {this.renderer = rendererFactory.createRenderer(null, null) }

  ngOnInit(): void {
  }
  chBackground(event: any):void {
    if(this.element) {
      this.renderer.removeClass(this.element, 'active');
    }
    this.renderer.addClass(event.target.parentNode, 'active');

    this.element = event.target.parentNode
  }

}

