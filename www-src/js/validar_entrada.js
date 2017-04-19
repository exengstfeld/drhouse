var React = require('react')
var browserHistory = require('react-router').hashHistory
var isNotLoggedIn = require('../js/utils').isNotLoggedIn
var locatePatient = require ('../js/utils').locatePatient 
var FlatButton = require('material-ui').FlatButton
var get = require('../js/utils').get
var post = require('../js/utils').post

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
                {this.state.code}
                <FlatButton onTouchTap={this.marcar_entrada} label="Marcar Entrada" />
            </span>
       )
    }
}

