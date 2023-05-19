import React, {Component} from 'react';
import Button from 'rsuite/Button';

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
        <Button color="green" appearance="primary" onClick={this.btnClickedHandler} className="p-1" title="Edit">
          <img src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png" width={30} height={30}/>
        </Button>
      )
    }
  }