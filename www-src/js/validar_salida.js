var React = require('react')
var browserHistory = require('react-router').hashHistory
var isNotLoggedIn = require('../js/utils').isNotLoggedIn
var Notification = require('../js/common').Notification
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var locatePatient = require ('../js/utils').locatePatient 
var RaisedButton = require('material-ui').RaisedButton
var AppBar = require('material-ui').AppBar
var IconButton = require('material-ui').IconButton
var ArrowBackIcon = require('material-ui/svg-icons/navigation/arrow-back').default
var PersonPin = require('material-ui/svg-icons/maps/person-pin').default
var ExitToApp = require('material-ui/svg-icons/action/exit-to-app').default

var Paper = require('material-ui').Paper
var TextField = require('material-ui').TextField
var Divider = require('material-ui').Divider
var get = require('../js/utils').get
var post = require('../js/utils').post
var {greenA200} = require('material-ui/styles/colors')


module.exports = class Patients extends React.Component {
    constructor(props) {
        super(props);
        this.marcar_salida = this.marcar_salida.bind(this)
        this.handleClose = this.handleClose.bind(this);
        this.handleObservacionesChange = this.handleObservacionesChange.bind(this);
        this.state = {
            code: "",
            error: false,
            observaciones: "",
            paciente: locatePatient(props.params.id),
            feedback: ""
        }
    }

    componentDidMount(){
        if (isNotLoggedIn()){
            browserHistory.push('/');
        }
    }

    handleObservacionesChange(event){
        this.setState({
          observaciones: event.target.value
        })
    }

    marcar_salida(){
        if (this.state.observaciones != ""){
            post('/marcar/salida', {paciente: this.state.paciente, 
                                    observacion: this.state.observaciones}).then(function(response){
                if (response.success){
                    sessionStorage.loggedBusy = null;
                    browserHistory.push('/home');
                } else {
                    this.setState({feedback: response.data} );
                }
            }.bind(this))
        }else{
            this.setState({feedback: "Las observaciones son obligatorias.", error: true} );
        }
    }

    handleClose(error) {
        this.setState({feedback: "", error: false})
    }
    

    render(){
        return(
            <span>
                <AppBar
                    title={"Terminar atención"}
                    iconElementLeft={<IconButton onTouchTap={() => browserHistory.goBack()}><ArrowBackIcon /></IconButton>}
                />
                  <Notification open={this.state.error} onRequestClose={this.handleClose}>{this.state.feedback}</Notification>
                 <Card>
                  <CardText>
                      <Paper style={{"padding": "10px"}}>
                      <p>Ingrese las observaciones que considere de importancia. Las mismas serán guardadas en el historial:</p>
                          <TextField
                              id="id_observacion"
                              hintText="Prestacion realizada"
                              floatingLabelText="Prestacion realizada"
                              value={this.state.observaciones}
                            onChange={this.handleObservacionesChange}
                            fullWidth={true}
                            multiLine={true}
                            rows={2}
                        />
                       </Paper>  
                  </CardText>
                  <CardActions style={{"text-align":"center"}}>
                    <RaisedButton onTouchTap={this.marcar_salida} secondary={true} icon={<ExitToApp/>} fullWidth={true} label="Dejar de atender" />   
                  </CardActions>
                 </Card> 
            </span>
       )
    }
}

