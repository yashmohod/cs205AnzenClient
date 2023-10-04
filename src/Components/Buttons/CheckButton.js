import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';

export default class CommonButton extends Component {
   
    constructor(props) {
      super(props);
      this.btnClickedHandler = this.btnClickedHandler.bind(this);
    }
    btnClickedHandler(e) {
     this.props.clicked(this.props.value);
     if(this.props.permissionFunction){
      this.props.editPermissions(this.props,e.target.checked, this.props.org);
     }
     if(this.props.promotionFunction){
      this.props.edit_promotionNdemotion(this.props.transitionOf, this.props.data, this.props.isPromotion,e.target.checked);
     }
    }
    render() {
      return (
        <Form.Check type={"checkbox"} defaultChecked={this.props.value} onChange={(e)=>this.btnClickedHandler(e)}/>
      )
    }
  }
