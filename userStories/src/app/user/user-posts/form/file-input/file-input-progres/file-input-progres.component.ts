import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-file-input-progres',
  templateUrl: './file-input-progres.component.html',
  styleUrls: ['./file-input-progres.component.scss']
})
export class FileInputProgresComponent implements OnInit {

  @Input() progress = 0;
  constructor() {}

  ngOnInit() {}

}
