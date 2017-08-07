var React = require('react')
var browserHistory = require('react-router').hashHistory
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var locatePatient = require ('../js/utils').locatePatient 
var isNotLoggedIn = require('../js/utils').isNotLoggedIn
var Paper = require('material-ui').Paper
var TextField = require('material-ui').TextField
var AppBar = require('material-ui').AppBar
var IconButton = require('material-ui').IconButton
var ArrowBackIcon = require('material-ui/svg-icons/navigation/arrow-back').default

var RaisedButton = require('material-ui').RaisedButton
var styles = require('../js/config').styles_tabs 
var {Tabs, Tab} = require('material-ui/Tabs')
var get = require('../js/utils').get
var post = require('../js/utils').post
var getPriorizationIcon = require('../js/utils').getPriorizationIcon
var FloatingActionButton = require('material-ui').FloatingActionButton
var AssignmentInd = require('material-ui/svg-icons/action/assignment-ind').default
var Assignment = require('material-ui/svg-icons/action/assignment').default
var Place = require('material-ui/svg-icons/maps/place').default
var Call = require('material-ui/svg-icons/communication/call').default
var Dialog = require('material-ui').Dialog
var {blue500, red500, greenA200} = require('material-ui/styles/colors')
var Divider = require('material-ui').Divider

var PersonPin = require('material-ui/svg-icons/maps/person-pin').default
var ExitToApp = require('material-ui/svg-icons/action/exit-to-app').default
var People = require('material-ui/svg-icons/social/people').default

var form_style: {
      padding: 16
}

function onSuccess(result){
  console.log("Success: "+result);
}

function onError(result) {
  console.log("Error: "+result);
}

const local_styles = {
    marcar_entrada_icon: {
        bottom: 30,
        right: 30,
        position: "fixed",
        display: "block",
        zIndex: 999,
        buttonColor: '#9b59b6',
        backgroundColor: greenA200
    },
    marcar_salida_icon: {
        bottom: 30,
        right: 30,
        position: "fixed",
        display: "block",
        zIndex: 999,
        backgroundColor: red500
    },
    ir_a_paciente_icon: {
        bottom: 30,
        right: 30,
        position: "fixed",
        display: "block",
        zIndex: 999,
        backgroundColor: blue500
    },
}

const MarcarEntadaIcon = (props) => (<PersonPin/>);
const MarcarSalidaIcon = (props) => (<ExitToApp/>);
const IrAPacienteIcon = (props) => (<p><b>Ir a</b></p>);



class Prestaciones extends React.Component{
    constructor(props) {
        super(props);
        this.handleDialogClose = this.handleDialogClose.bind(this)
        this.getPrestaciones = this.getPrestaciones.bind(this)
        this.state = {
            show_new_prestacion: false,
            feedback: "",
            error: false,
            prestaciones: [],
        }
    }

    componentDidMount(){
        if (isNotLoggedIn()){
            browserHistory.push('/');
        } else {
            this.getPrestaciones();
        }
    }

    getPrestaciones(){
        get('/prestaciones_paciente/' + this.props.paciente.IdEnte).then(function(response){
            if (response.success){
                this.setState({prestaciones: response.data});
            } else {
               this.setState({feedback: response.data, error: true});
            }
        }.bind(this))   
    }

    handleDialogClose(){
        this.setState({show_new_prestacion: false, observacion: ""})
    }
 
    render(){         
        return (
            <span>   
                {
                    this.state.prestaciones.map((v, i) => (
                        <div key={i}>
                            <Card>
                                <CardHeader title={v.DescProducto} subtitle={v.Fecha} 
                                actAsExpander={true}
                                />
                                <CardText>
                                    {v.Observaciones}
                                </CardText>
                            </Card>
                        </div>
                      )
                    )
                }
            </span>   
        )
    }
}

module.exports = class Patients extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleCall = this.handleCall.bind(this)
        this.handleScanQR = this.handleScanQR.bind(this)

        this.state = {
            value:'Paciente',
            busy: JSON.parse(sessionStorage.loggedBusy),
            paciente: locatePatient(props.params.id)
        }
    }

    componentDidMount(){
        if (isNotLoggedIn()){
            browserHistory.push('/');
        }
    }


    handleScanQR(){
        cordova.plugins.barcodeScanner.scan(
            ((result) => browserHistory.push("/validar_entrada/" + this.state.paciente.IDPrestacionPrestador)),
            ((error) => this.setState({error: true, feedback: error})),
            {
                "preferFrontCamera" : false, // iOS and Android
                "showFlipCameraButton" : true, // iOS and Android
                "prompt" : "Lleve el recuadro hacia el código QR del paciente", // supported on Android only
                "formats" : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
                "orientation" : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                "resultDisplayDuration": 0
            }
        );
    }


    handleCall(){
        window.plugins.CallNumber.callNumber(onSuccess, onError, this.state.paciente.Telefono1, false)
    }

    handleChange(value){
        this.setState({
          value: value
        })

    }

    render(){
        var rightAction = undefined
        if ((this.state.busy != null) && (this.state.busy.IDPrestacionPrestador != this.state.paciente.IDPrestacionPrestador)) {
            rightAction = (
                <RaisedButton icon={<People/>} label="Ir a paciente actual"  onTouchTap={() => this.setState({paciente: locatePatient(this.state.busy.IDPrestacionPrestador)})}>
                </RaisedButton>
            )
        } else if ((this.state.busy != null) && (this.state.busy.IDPrestacionPrestador == this.state.paciente.IDPrestacionPrestador)) {
            rightAction = (
                <RaisedButton icon={<ExitToApp/>} secondary={true} label="Dejar de atender" onTouchTap={() => browserHistory.push("/validar_salida/" + this.state.paciente.IDPrestacionPrestador)}>
                </RaisedButton>
            )
        } else if (this.state.busy == null) {
            rightAction = (
                <RaisedButton icon={<PersonPin/>} primary={true} label="Atender" onTouchTap={this.handleScanQR}>
                </RaisedButton>
            )
        
        }
        return(
            <span>
                <AppBar
                    title={this.state.value}
                    iconElementLeft={<IconButton onTouchTap={() => browserHistory.push("/home")}><ArrowBackIcon /></IconButton>}
                />
                <Tabs value={this.state.value} onChange={this.handleChange} >
                    <Tab icon={<AssignmentInd/>} value="Paciente" label="Paciente">
                     <Card>
                      <CardText>
                          <p>Vista detallada de la prestación a realizar. Recuerde que para comenzar la atención deberá tener el codigo QR del paciente y estar ubicado en su domicilio.</p>
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
                              <TextField underlineShow={false} style={{"width": "80px"}} inputStyle={{"width": "20px"}} floatingLabelText="Hora hasta" value={this.state.paciente.HoraHasta}  />
                           </Paper>  
                      </CardText>
                      <CardActions style={{"text-align":"center"}}>
                        {rightAction}
                        <RaisedButton icon={<Call/>} label="Llamar" disabled={!(this.state.paciente.Telefono1 && parseInt(this.state.paciente.Telefono1))}
                            onTouchTap={this.handleCall}>                                        
                        </RaisedButton>

                        <RaisedButton icon={<Place/>} label="Mapa"  href={"https://www.google.com.ar/maps/place/" + this.state.paciente.Domicilio}>
                        </RaisedButton>
                      </CardActions>
                     </Card> 
                    </Tab>
                    <Tab icon={<Assignment/>} onChange={this.handleChange} label="Historial" value="Historial" >
                        <Prestaciones paciente={this.state.paciente} />
                    </Tab>
                  </Tabs>                 
            </span>
       )
    }
}

