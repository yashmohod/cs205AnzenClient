import React, {Component} from 'react';
import {Button} from 'react-bootstrap'

export default class DeleteButton extends Component {
   
    constructor(props) {
      super(props);
      this.btnClickedHandler = this.btnClickedHandler.bind(this);
    }
    btnClickedHandler() {
     this.props.clicked(this.props.value);
    }
    render() {
      return (
        <Button onClick={this.btnClickedHandler} variant="danger" className="p-1">Delete</Button>
      )
    }
  }