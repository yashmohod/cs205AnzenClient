import React, {Component} from 'react';
import {Button} from 'react-bootstrap'

export default class EditButton extends Component {
   
    constructor(props) {
      super(props);
      this.btnClickedHandler = this.btnClickedHandler.bind(this);
    }
    btnClickedHandler() {
     this.props.clicked(this.props.value);
    }
    render() {
      return (
        <Button variant="outline-success" onClick={this.btnClickedHandler} className="p-1">Edit</Button>
      )
    }
  }