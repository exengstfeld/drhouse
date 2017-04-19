var React = require('react')
var browserHistory = require('react-router').hashHistory
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var Paper = require('material-ui').Paper
var FlatButton = require('material-ui').FlatButton
var form_style = require('../js/config').form_style
var locatePatient = require ('../js/utils').locatePatient 
var isNotLoggedIn = require('../js/utils').isNotLoggedIn
var input_style = require('../js/config').input_style
var TextField = require('material-ui').TextField
var AppBar = require('material-ui').AppBar
var IconButton = require('material-ui').IconButton
var NavigationClose = require('material-ui/svg-icons/navigation/close').default

var Subheader = require('material-ui').Subheader;
var List = require('material-ui/List').List;
var ListItem = require('material-ui/List').ListItem;

var RaisedButton = require('material-ui').RaisedButton
var styles = require('../js/config').styles_tabs 
var Divider = require('material-ui').Divider
var {Tabs, Tab} = require('material-ui/Tabs')
var closeActiveSession = require('../js/utils').closeActiveSession
var app_bar_style = require('../js/config').app_bar_style 
var get = require('../js/utils').get
var post = require('../js/utils').post
var getPriorizationIcon = require('../js/utils').getPriorizationIcon
var FloatingActionButton = require('material-ui').FloatingActionButton
var ContentAdd = require('material-ui/svg-icons/content/add').default
var PlayForWork = require('material-ui/svg-icons/action/play-for-work').default
var Create = require('material-ui/svg-icons/content/create').default
var Description = require('material-ui/svg-icons/action/description').default
var Reorder = require('material-ui/svg-icons/action/reorder').default
var Assignment = require('material-ui/svg-icons/action/assignment').default
var Toys = require('material-ui/svg-icons/hardware/toys').default
var Done = require('material-ui/svg-icons/action/done').default
var Dialog = require('material-ui').Dialog

const local_styles = {
    floating: {
        bottom: 30,
        right: 30,
        position: "fixed",
        display: "block"
    }
}


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
        get('/prestaciones_paciente/' + this.props.paciente.IDPrestacionPrestador).then(function(response){
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
                                    <p><b> {v.Descproducto} </b> ( {v.FecVisita} )</p>
                                    <p>{v.DescNovedad}</p>
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
        this.setState({show_observaciones_salida: true})
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
                <FloatingActionButton onTouchTap={() => this.setState({paciente: locatePatient(this.state.busy.IDPrestacionPrestador)})} style={local_styles.floating}>
                    Ir a
                </FloatingActionButton >
            )
        } else if ((this.state.busy != null) && (this.state.busy.IDPrestacionPrestador == this.state.paciente.IDPrestacionPrestador)) {
            rightAction = (
                <FloatingActionButton onTouchTap={this.openMarcarSalida} style={local_styles.floating}>
                    Salir
                </FloatingActionButton>
            )
        } else if (this.state.busy == null) {
            rightAction = (
                <FloatingActionButton href={"index.html#/validar_entrada/" + this.state.paciente.IDPrestacionPrestador} style={local_styles.floating}>
                    Entrar
                </FloatingActionButton>
            )
        }
        return(
            <span>
                <AppBar
                    title={this.state.value}
                    iconElementLeft={<IconButton onTouchTap={() => browserHistory.push("/home")}><NavigationClose /></IconButton>}
                />
                {rightAction}
                <Tabs value={this.state.value} onChange={this.handleChange} >
                    <Tab icon={<Assignment />} value="Detalles">
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
                                    <p><strong>Telefono: </strong> {this.state.paciente.Telefono1}.</p>
                                    <p><strong>Direccion: </strong> {this.state.paciente.Domicilio}.</p>                                </div>   
                            </CardText>
                        </Card>
                    </Tab>

                    <Tab icon={<Create />} value="Prestaciones" >
                        <Prestaciones paciente={this.state.paciente} />
                    </Tab>

                  </Tabs>                 

                  <Dialog
                      title="Marcar salida"
                      actions={[
                          <RaisedButton label="Marcar salida" onTouchTap={this.marcar_salida} />,
                      ]}
                    modal={false}
                    open={this.state.show_observaciones_salida}
                    onRequestClose={this.handleDialogClose}
                  >
                      Por favor, ingrese las observaciones del paciente
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

