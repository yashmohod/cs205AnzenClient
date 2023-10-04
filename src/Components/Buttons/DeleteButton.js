import React, {Component} from 'react';
import Button from 'rsuite/Button';

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
        <Button color="red" appearance="primary" onClick={this.btnClickedHandler} className="p-1" title="Delete">
          <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" width={30} height={30}/>
        </Button>
      )
    }
  }