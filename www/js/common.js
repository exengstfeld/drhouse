var React = require('react')
var Dialog = require('material-ui').Dialog
var FlatButton = require('material-ui').FlatButton
var SvgIcon = require('material-ui').SvgIcon

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
    },

    VTIcon: function(props){
        return (
            <img src={"img/Viaticket_2017_2.png"} />
        )
    },

    MoreIcon: function(props){
        return (
            <SvgIcon>
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </SvgIcon>
        )
    },

    CloseIcon: function(props){
        return (
            <SvgIcon>
                <path d="M15 8.25H5.87l4.19-4.19L9 3 3 9l6 6 1.06-1.06-4.19-4.19H15v-1.5z"/>
            </SvgIcon>
        )
    }
}
