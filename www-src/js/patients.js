var React = require('react')
var browserHistory = require('react-router').hashHistory
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var locatePatient = require ('../js/utils').locatePatient 
var isNotLoggedIn = require('../js/utils').isNotLoggedIn
var TextField = require('material-ui').TextField
var AppBar = require('material-ui').AppBar
var IconButton = require('material-ui').IconButton
var NavigationClose = require('material-ui/svg-icons/navigation/close').default

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

var PersonPin = require('material-ui/svg-icons/maps/person-pin').default
var ExitToApp = require('material-ui/svg-icons/action/exit-to-app').default
var People = require('material-ui/svg-icons/social/people').default



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
                                <CardText>
                                    <p><b> {v.DescProducto} </b> ( {v.Fecha} )</p>
                                    <p>{v.Observaciones}</p>
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
        this.marcar_salida = this.marcar_salida.bind(this)
        this.openMarcarSalida = this.openMarcarSalida.bind(this)
        this.handleObservacionesChange = this.handleObservacionesChange.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this)

        this.state = {
            value:'Detalles',
            busy: JSON.parse(sessionStorage.loggedBusy),
            paciente: locatePatient(props.params.id),
            observaciones: "",
            show_observaciones_salida: false
        }
    }

    componentDidMount(){
        if (isNotLoggedIn()){
            browserHistory.push('/');
        }
    }


    marcar_salida(){
        post('/marcar/salida', {paciente: this.state.paciente, 
                                observacion: this.state.observaciones}).then(function(response){
            if (response.success){
                sessionStorage.loggedBusy = null;
                this.setState({busy: null});
                browserHistory.push('/home');
            } else {
                this.setState({feedback: response.data} );
            }
        }.bind(this))
    }

    handleChange(value){
        console.info('statu value: ', value)
        if(value=='Call'){
            value = 'Detalles'
        }
        if(value=='Place'){
            value = 'Detalles'
        }
        if(value=='Cambiar'){
            value = 'Detalles'
        }
        if(value=='Salida'){
            value = 'Detalles'
        }

        this.setState({
          value: value
        })

    }
    handleObservacionesChange(event){
        this.setState({
          observaciones: event.target.value
        })
    }

    openMarcarSalida(){
        console.info('marca la salida !!!')
        this.setState({
            show_observaciones_salida: true
        })
    }

    handleDialogClose(){
        this.setState({
          show_observaciones_salida: false
        })
    }

    render(){
        var rightAction = undefined
        if ((this.state.busy != null) && (this.state.busy.IDPrestacionPrestador != this.state.paciente.IDPrestacionPrestador)) {
            rightAction = (
                <Tab icon={<People/>} label="Cambiar" value="Cambiar" onActive={() => this.setState({paciente: locatePatient(this.state.busy.IDPrestacionPrestador)})}>
                    <Prestaciones/>
                </Tab>
            )
        } else if ((this.state.busy != null) && (this.state.busy.IDPrestacionPrestador == this.state.paciente.IDPrestacionPrestador)) {
            rightAction = (
                    <Tab icon={<ExitToApp/>} label="Salida" value="Salida" onActive={this.openMarcarSalida}>
                        <Prestaciones/>
                    </Tab>
            )
        } else if (this.state.busy == null) {
            rightAction = (
                <Tab icon={<PersonPin/>} label="Entrada" value="Entrada" href={"index.html#/validar_entrada/" + this.state.paciente.IDPrestacionPrestador}>
                    <Prestaciones/>
                </Tab>
            )
        
        }
        return(
            <span>
                <AppBar
                    title={this.state.paciente.BuscarComo}
                    iconElementLeft={<IconButton onTouchTap={() => browserHistory.push("/home")}><NavigationClose /></IconButton>}
                />
                <Tabs value={this.state.value} onChange={this.handleChange} >
                    <Tab icon={<AssignmentInd/>} label="Paciente" value="Detalles">
                        <Card>
                            <CardHeader
                                avatar={getPriorizationIcon(this.state.paciente.status)}
                                title={this.state.paciente.BuscarComo} 
                                subtitle={<span>{this.state.paciente.DescProducto} ({this.state.paciente.HoraDesde} - {this.state.paciente.HoraHasta})</span>}
                            />
                            <CardText>
                                <div>
                                    <p><strong>Nombre: </strong> {this.state.paciente.BuscarComo} ({this.state.paciente.EDAD} año)</p>
                                    <p><strong>Especialidad: </strong>{this.state.paciente.DescProducto}</p>
                                    <p><strong>Cantidad: </strong>{this.state.paciente.Cantidad} {this.state.paciente.CodUnidadMedidaSalida}</p>
                                    <p><strong>Horario: </strong> Desde las {this.state.paciente.HoraDesde}hs hasta las {this.state.paciente.HoraHasta}hs.</p>
                                    <p><strong>Telefono: </strong>{this.state.paciente.Telefono1}</p>
                                    <p><strong>Direccion: </strong>{this.state.paciente.Domicilio}</p>
                               </div>   
                            </CardText>
                        </Card>
                    </Tab>
                    <Tab icon={<Assignment/>} label="Obser" value="Prestaciones" >
                        <Prestaciones paciente={this.state.paciente} />
                    </Tab>
                    <Tab icon={<Call/>} label="Llamar" value="Call" onActive={window.plugins.CallNumber.callNumber(onSuccess, onError, this.state.paciente.Telefono1, false)}>                                        
                        <Prestaciones paciente={this.state.paciente} />
                    </Tab>

                    <Tab icon={<Place/>} label="Mapa" value="Place" href={"https://www.google.com.ar/maps/place/" + this.state.paciente.Domicilio}>
                        <Prestaciones paciente={this.state.paciente} />
                    </Tab>
                    {rightAction}
                  </Tabs>                 

                  <Dialog
                      title="Marcar salida"
                      actions={[
                          <RaisedButton label="Marcar salida" onTouchTap={this.marcar_salida} />,
                          <RaisedButton label="Cancelar" onTouchTap={this.handleDialogClose} />,
                      ]}
                    modal={false}
                    open={this.state.show_observaciones_salida}
                    onRequestClose={this.handleDialogClose}
                  >
                      Observaciones del paciente
                      <TextField
                          id="id_observacion"
                          hintText="Prestacion realizada"
                          errorText="Campo Obligatorio."
                          floatingLabelText="Prestacion realizada"
                          value={this.state.observaciones}
                        onChange={this.handleObservacionesChange}
                        fullWidth={true}
                        multiLine={true}
                        rows={2}
                    />
                  </Dialog>

            </span>
       )
    }
}

