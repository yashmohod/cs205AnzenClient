import React from "react";
import Popup from "reactjs-popup";



export default class EditPopUp extends React.Component {
  render() {
    return(
      <Popup open={this.props.open} modal>

        <div>
            <p>{this.props.id}</p>
            <button onClick={() => this.props.setOpen(false)}>
                close   
            </button>
        </div>

      </Popup>
    )
  }
}