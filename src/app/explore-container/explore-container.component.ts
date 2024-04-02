import { Component, Input } from '@angular/core';
import { PoButtonModule, PoTableModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
  standalone: true,
  imports: [PoButtonModule, PoTableModule],
})
export class ExploreContainerComponent {
  @Input() name?: string;
}
