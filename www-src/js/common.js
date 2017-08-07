var React = require('react')
var Dialog = require('material-ui').Dialog
var FlatButton = require('material-ui').FlatButton

module.exports = {
    Notification: function(props){
        return (
          <Dialog
           title="Atención"
           actions={[
               <FlatButton
                 label="Volver"
                 primary={true}
                 onTouchTap={props.onRequestClose}
               />
           ]}
           {...props}
           modal={false}
          >
           {props.children}
          </Dialog>
       )
    }
}
