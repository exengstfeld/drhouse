var React = require('react')
var browserHistory = require('react-router').hashHistory
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var Paper = require('material-ui').Paper
var FlatButton = require('material-ui').FlatButton
var form_style = require('../js/config').form_style
var locateFunction = require ('../js/utils').locateFunction 
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


class Prestaciones extends React.Component{
    constructor(props) {
        super(props);
        this.getPrestaciones = this.getPrestaciones.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this)
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
        console.info(this)
        console.info(this.keys())
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
                <FloatingActionButton onTouchTap={this.newPrestacion} disabled={!this.props.can_operate} style={{bottom: 30, display: this.props.can_operate ? "block" : "none", right: 15, position: "fixed"}}>
                    <ContentAdd />
                </FloatingActionButton>
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
        this.marcar_entrada = this.marcar_entrada.bind(this)

        this.state = {
            value:'detalles',
            busy: null,
            paciente:{}
        }
    }

    componentDidMount(){
        if (isNotLoggedIn()){
            browserHistory.push('/');
        } else {
            this.setState({
                paciente: JSON.parse(sessionStorage.shows)[this.props.params.id], 
                busy: JSON.parse(sessionStorage.loggedBusy)
            });
        }
    }

    marcar_entrada(){
        post('/marcar/entrada', this.state.paciente).then(function(response){
            if (response.success){
                this.setState({busy: this.state.paciente});
                sessionStorage.loggedBusy = JSON.stringify(this.state.paciente);
            } else {
                this.setState({feedback: response.data});
            }
        }.bind(this))

    }

    marcar_salida(){
        post('/marcar/salida', {paciente: this.state.paciente, 
                                observacion: 'observacion, de salida'}).then(function(response){
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

    render(){
        var rightAction = undefined
        if ((this.state.busy != null) && (this.state.busy.IDPrestacionPrestador != this.state.paciente.IDPrestacionPrestador)) {
            rightAction = (
                <FlatButton onTouchTap={browserHistory.goBack} label={"Ir a paciente actual"}>
                </FlatButton>
            )
        } else if ((this.state.busy != null) && (this.state.busy.IDPrestacionPrestador == this.state.paciente.IDPrestacionPrestador)) {
            rightAction = (
                <FlatButton onTouchTap={this.marcar_salida} label={"Marcar Salida"}>
                </FlatButton>
            )
        } else if (this.state.busy == null) {
            rightAction = (
                <FlatButton onTouchTap={this.marcar_entrada} label={"Marcar Entrada"}>   
                </FlatButton>
            )
        }
        return(
            <span>
                <AppBar
                    title={this.state.paciente.BuscarComo}
                    iconElementLeft={<IconButton onTouchTap={browserHistory.goBack}><NavigationClose /></IconButton>}
                    iconElementRight={rightAction}
                />
                <Tabs value={this.state.value} onChange={this.handleChange} >
                    <Tab icon={<Assignment />} value="detalles">
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

                    <Tab icon={<Create />} value="prestaciones" >
                        <Prestaciones paciente={this.state.paciente} can_operate={(this.state.busy != null) && (this.state.busy.IDPrestacionPrestador == this.state.paciente.IDPrestacionPrestador) && (this.state.value == "prestaciones")} />
                    </Tab>

                  </Tabs>                 
            </span>
       )
    }
}

