var React = require('react')
var browserHistory = require('react-router').hashHistory
var isNotLoggedIn = require('../js/utils').isNotLoggedIn
var locatePatient = require ('../js/utils').locatePatient 
var RaisedButton = require('material-ui').RaisedButton
var AppBar = require('material-ui').AppBar
var IconButton = require('material-ui').IconButton
var NavigationClose = require('material-ui/svg-icons/navigation/close').default

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
        } else {
            cordova.plugins.barcodeScanner.scan(
                ((result) => this.setState({code: result.text})),
                ((error) => this.setState({error: true, feedback: error})),
                {
                    "preferFrontCamera" : false, // iOS and Android
                    "showFlipCameraButton" : true, // iOS and Android
                    "prompt" : "Lleve el recuadro hacia el código QR del ticket electrónico", // supported on Android only
                    "formats" : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
                    "orientation" : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                    "resultDisplayDuration": 0
                }
            );
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
                    title={"Marcar entrada"}
                    iconElementLeft={<IconButton onTouchTap={() => browserHistory.goBack()}><NavigationClose /></IconButton>}
                />
                <div style={local_styles.div_principal}>
                    <p><strong>Nombre: </strong> {this.state.paciente.BuscarComo} ({this.state.paciente.EDAD} año)</p>
                    <p><strong>Especialidad: </strong>{this.state.paciente.DescProducto}</p>
                    <p><strong>Cantidad: </strong>{this.state.paciente.Cantidad} {this.state.paciente.CodUnidadMedidaSalida}</p>
                    <p><strong>Horario: </strong> Desde las {this.state.paciente.HoraDesde}hs hasta las {this.state.paciente.HoraHasta}hs.</p>
                    <RaisedButton onTouchTap={this.marcar_entrada} label="Atender" />
                    <RaisedButton onTouchTap={() => browserHistory.goBack()} label="Volver" />
                </div>
            </span>
       )
    }
}

