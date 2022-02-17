import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-multi-selection',
  templateUrl: './multi-selection.component.html',
  styleUrls: ['./multi-selection.component.scss']
})
export class MultiSelectionComponent implements OnInit {

  ngOnInit(): void {

  }

  availableLibraries = [
    {id: 1, name: 'express'},
    {id: 2, name: 'async'},
    {id: 3, name: 'request'},
    {id: 4, name: 'browserify'},
    {id: 5, name: 'grunt'}
  ];

  librariesSelectedForInstallation = [
    {id: 6, name: 'socket.io'},
    {id: 7, name: 'mocha'}
  ];

  leftSelectedLibrary :any = {};
  rightSelectedLibrary :any = {};


  setSelectedLibrary(library : any,ele: any, isLeft: boolean) {
    // TODO: Write your code here
    ele = ele.target;
    let selectedLibrary = isLeft ? this.leftSelectedLibrary: this.rightSelectedLibrary;
    if( !selectedLibrary[library.name]) {
        selectedLibrary[library.name] = library;
        ele.classList.add("libs-container_item--selected");
    }else {
        ele.classList.remove("libs-container_item--selected");
        delete selectedLibrary[library.name];
    }
  }

  onMoveLeftClick() {
    // TODO: Write your code here
    let obj = {
      source: this.librariesSelectedForInstallation,
      dest: this.availableLibraries,
      selected: this.rightSelectedLibrary
    }
    this.librariesSelectedForInstallation = this.moveLibrary(obj);
    this.rightSelectedLibrary = {};
  }

  onMoveRightClick() {
    // TODO: Write your code here
      let obj = {
        source: this.availableLibraries,
        dest: this.librariesSelectedForInstallation,
        selected: this.leftSelectedLibrary
      }
      this.availableLibraries = this.moveLibrary(obj);
      this.leftSelectedLibrary = {};
  }

  moveLibrary(obj: any){
    //return
    obj.source = obj.source.filter( (ele:any) => {
      return obj.selected[ele.name] === undefined;
    });
    for(var i in obj.selected){
      obj.dest.push(obj.selected[i]);
    }
    obj.selected = {};
    return obj.source;
  }

  installLibs() {
    // TODO: Write your code here
  }

}
