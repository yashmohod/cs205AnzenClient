import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';

export default class CommonButton extends Component {
   
    constructor(props) {
      super(props);
      this.btnClickedHandler = this.btnClickedHandler.bind(this);
    }
    btnClickedHandler(e) {
     this.props.clicked(this.props.value);
     this.props.editPermissions(this.props,e, this.props.org);
    }
    render() {
      return (
        <Form.Check type={"checkbox"} defaultChecked={this.props.value} onChange={(e)=>this.btnClickedHandler(e)}/>
      )
    }
  }
