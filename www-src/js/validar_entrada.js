var React = require('react')
var browserHistory = require('react-router').hashHistory
var isNotLoggedIn = require('../js/utils').isNotLoggedIn
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var locatePatient = require ('../js/utils').locatePatient 
var RaisedButton = require('material-ui').RaisedButton
var AppBar = require('material-ui').AppBar
var IconButton = require('material-ui').IconButton
var ArrowBackIcon = require('material-ui/svg-icons/navigation/arrow-back').default
var PersonPin = require('material-ui/svg-icons/maps/person-pin').default

var Paper = require('material-ui').Paper
var TextField = require('material-ui').TextField
var Divider = require('material-ui').Divider
var get = require('../js/utils').get
var post = require('../js/utils').post
var {greenA200} = require('material-ui/styles/colors')

const local_styles = {
    div_principal: {
        zIndex: 999,
		padding: "20px"
    }
}


module.exports = class Patients extends React.Component {
    constructor(props) {
        super(props);
        this.marcar_entrada = this.marcar_entrada.bind(this)
        this.state = {
            code: "",
            error: false,
            paciente: locatePatient(props.params.id),
            feedback: ""
        }
    }

    componentDidMount(){
        if (isNotLoggedIn()){
            browserHistory.push('/');
        }
    }

    marcar_entrada(){
        post('/marcar/entrada', this.state.paciente).then(function(response){
            if (response.success){
                sessionStorage.loggedBusy = JSON.stringify(this.state.paciente);
                browserHistory.push("/patients/" + this.state.paciente.IDPrestacionPrestador)
            } else {
                this.setState({feedback: response.data});
            }
        }.bind(this))

    }

    render(){
        return(
            <span>
                <AppBar
                    title={"Comenzar atención"}
                    iconElementLeft={<IconButton onTouchTap={() => browserHistory.goBack()}><ArrowBackIcon /></IconButton>}
                />
                 <Card>
                  <CardText>
                      <p>Una vez comenzada la atención no podrá atender otro paciente hasta que esta finalice. Al finalizar podrá cargar las observaciones que considere de importancia para grabar en el historial.</p>
                      <Paper style={{"padding": "10px"}}>
                          <TextField underlineShow={false} style={{"width": "auto"}} floatingLabelText="Nombre" value={this.state.paciente.BuscarComo}  />
                          <TextField underlineShow={false} style={{"width": "auto"}} inputStyle={{"width": "20px"}} floatingLabelText="Edad" value={this.state.paciente.EDAD}  />
                          <Divider />
                          <TextField underlineShow={false} style={{"width": "auto"}} floatingLabelText="Telefono" value={this.state.paciente.Telefono1}  />
                          <TextField underlineShow={false} style={{"width": "auto"}} floatingLabelText="Domicilio" value={this.state.paciente.Domicilio}  />
                          <Divider />
                          <TextField underlineShow={false} style={{"width": "auto"}} floatingLabelText="Especialidad" value={this.state.paciente.DescProducto}  />
                          <Divider />
                          <TextField underlineShow={false} style={{"width": "auto"}} floatingLabelText="Cantidad" value={this.state.paciente.Cantidad}  />
                          <TextField underlineShow={false} style={{"width": "100px"}} inputStyle={{"width": "20px"}} floatingLabelText="Medida" value={this.state.paciente.CodUnidadMedidaSalida}  />
                          <Divider />
                          <TextField underlineShow={false} style={{"width": "auto"}} floatingLabelText="Hora desde" value={this.state.paciente.HoraDesde}  />
                          <TextField underlineShow={false} style={{"width": "100px"}} inputStyle={{"width": "20px"}} floatingLabelText="Hora hasta" value={this.state.paciente.HoraHasta}  />
                       </Paper>  
                  </CardText>
                  <CardActions style={{"text-align":"center"}}>
                    <RaisedButton onTouchTap={this.marcar_entrada} primary={true} icon={<PersonPin/>} fullWidth={true} label="Atender ahora" />   
                  </CardActions>
                 </Card> 
            </span>
       )
    }
}

