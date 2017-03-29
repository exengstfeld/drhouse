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
var Done = require('material-ui/svg-icons/action/done').default
var Dialog = require('material-ui').Dialog


class Prestaciones extends React.Component{
    constructor(props) {
        super(props);
        this.getPrestaciones = this.getPrestaciones.bind(this);
        this.newPrestacion = this.newPrestacion.bind(this);
        this.savePrestacion = this.savePrestacion.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this)
        this.state = {
            show_new_prestacion: false,
            feedback: "",
            error: false,
            prestaciones: []
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

    newPrestacion(){
        this.setState({
          show_new_prestacion: true,
        })
    }

    savePrestacion(){
        this.setState({
            feedback: "Se ha guardado la prestación con éxito!", 
            error: false
        })
    }

    render(){         
        return (
            <span>   
                <FloatingActionButton disabled={this.props.can_operate} onTouchTap={this.newPrestacion} style={{bottom: 30, display: "inline-block", right: 15}}>
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
                <Dialog
                  title="Nueva prestación"
                  actions={[
                      <RaisedButton label="Guardar" onTouchTap={this.savePrestacion} />,
                  ]}
                  modal={false}
                  open={this.state.show_new_prestacion}
                  onRequestClose={this.handleDialogClose}
                >
                    Por favor, ingrese una nueva prestación
                    <TextField
                        id="id_Observacion" 
                        hintText="Prestacion realizada"
                        errorText="Campo Obligatorio."
                        floatingLabelText="Prestacion realizada"
                        value={this.state.observacion} 
                        onChange={this.handleObservacionChange} 
                        fullWidth={true}
                        multiLine={true}
                        rows={2}
                    />
                </Dialog>
            </span>   
        )
    }
}

class Ordenes extends React.Component {
    constructor(props) {
        super(props);
        this.handleObservacionChange = this.handleObservacionChange.bind(this)
        this.newOrden = this.newOrden.bind(this)
        this.handleDialogClose = this.handleDialogClose.bind(this)
        this.saveOrden = this.saveOrden.bind(this)
        this.getOrdenes = this.getOrdenes.bind(this)

        this.state = {
            show_new_orden: false,
            ordenes: [],
            feedback: "",
            error: false,
            observacion: ""
        }    
    }

    componentDidMount(){
        if (isNotLoggedIn()){
            browserHistory.push('/');
        } else {
            this.setState({
                paciente: this.props.paciente
            });
            this.getOrdenes();
        }
    }

    saveOrden(){
        post('/ordenes_medicas', {'observacion':this.state.observacion, 'idEnte': this.state.paciente.IdEnte}).then(
            this.setState({feedback: "Se ha grabado una nueva orden con exito!", error: false})
        ).catch(
            this.setState({feedback: error, error: true})
        )     
    }

    handleObservacionChange(event){
        this.setState({observacion: event.target.value});
    }

    newOrden(){
        this.setState({show_new_orden: true})
    }
    
    handleDialogClose(){
        this.setState({show_new_orden: false, observacion: ""})
    }

    getOrdenes(){ 
        get('/ordenes_medicas/' + this.props.paciente.IDPrestacionPrestador).then(function(response){
            if (response.success){
                this.setState({ordenes: response.data});
            } else {
                this.setState({feedback: response.data, error: true});
            }
        }.bind(this))
    }

    render(){
        return (
            <span>
                <FloatingActionButton disabled={this.props.can_operate} onTouchTap={this.newOrden} style={{bottom: 30, display: "inline-block", left: 15}}>
                    <ContentAdd />
                </FloatingActionButton>
                {
                    this.state.ordenes.map((v, i) => (
                        <div key={i}>
                            <Card>
                                <CardText>
                                   <p><b> {v.BuscarComo} </b> ( {v.FecEmision} )</p>
                                   <p>{v.OBSOrdenMedica}</p>
                                </CardText>
                            </Card>
                        </div>
                      )
                    )
                }
                <Dialog
                  title="Nueva órden"
                  actions={[
                      <RaisedButton label="Guardar" onTouchTap={this.saveOrden} />,
                  ]}
                  modal={false}
                  open={this.state.show_new_orden}
                  onRequestClose={this.handleDialogClose}
                >
                    Por favor, ingrese una nueva orden médica
                    <TextField
                        id="id_observacion" 
                        hintText="Nueva orden medica"
                        errorText="Campo Obligatorio."
                        floatingLabelText="Nueva orden medica"
                        value={this.state.observacion} 
                        onChange={this.handleObservacionChange} 
                        fullWidth={true}
                        multiLine={true}
                        rows={2}
                    />
                  
                </Dialog>
            </span>    
        )
    }
}

class HojaAdmision extends React.Component {
    constructor(props){
        super(props);
        this.getHojaAdmision = this.getHojaAdmision.bind(this)     
        this.state = {
            hoja_admision:{}
        }    
    }

    componentDidMount(){
        if (isNotLoggedIn()){
            browserHistory.push('/');
        } else {
            this.getHojaAdmision();
        }
    }

    getHojaAdmision(){
        get('/hoja_admision/' + this.props.paciente.IDPrestacionPrestador).then(function(response){
            if (response.success){
               this.setState({hoja_admision: response.data});
            } else {
               this.setState({feedback: response.data});
            }
        }.bind(this))
    }

    render(){
        return(
            <Card>
                <CardText>
                    <p><b>Fecha:</b> {this.state.hoja_admision.FecEmision}</p>
                    <p><b>Nro de Revision:</b> {this.state.hoja_admision.NroRevision}</p>
                    <p><b>Medicamentos:</b> {this.state.hoja_admision.DescReaccionesAdvMedicamentos}</p>
                    <p><b>Motivo de Internacion:</b> {this.state.hoja_admision.DescMotivoInternacion}</p>
                    <p><b>Enfermedad Actual:</b> {this.state.hoja_admision.DescEnfermedadActual}</p>
                    <p><b>Diagnostico de Ingreso:</b> {this.state.hoja_admision.DescDiagnosticoIngreso}</p>
                </CardText>
            </Card>
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
                this.setState({busy: JSON.stringify(this.state.paciente)});
                sessionStorage.loggedBusy = JSON.stringify(this.state.paciente);
            } else {
                this.setState({feedback: response.data});
            }
        }.bind(this))

    }

    marcar_salida(){
        post('/marcar/salida', {IDPrestacionPrestador: this.state.busy.IDPrestacionPrestador}).then(function(response){
            if (response.success){
                sessionStorage.loggedBusy = null;
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
                    title={"Paciente"}
                    iconElementLeft={<IconButton onTouchTap={browserHistory.goBack}><NavigationClose /></IconButton>}
                    iconElementRight={rightAction}
                />
                <Tabs value={this.state.value} onChange={this.handleChange} >
                    <Tab label="Detalles" value="detalles">
                        <Card>
                            <CardHeader
                                avatar = {getPriorizationIcon(this.state.paciente.status)}
                                title= {this.state.paciente.BuscarComo} 
                                subtitle= {<span>{this.state.paciente.DescProducto} ({this.state.paciente.HoraDesde} - {this.state.paciente.HoraHasta})</span>}
                            />
                            <CardText>
                                <div>
                                    <p><strong>Nombre: </strong> {this.state.paciente.BuscarComo}</p>
                                    <p><strong>Descripción: </strong>{this.state.paciente.DescProducto}</p>
                                    <p><strong>Horario: </strong> {this.state.paciente.HoraDesde} - {this.state.paciente.HoraHasta}.</p>
                                    <p><strong>Telefono: </strong> {this.state.paciente.Telefono1}.</p>
                                    <p><strong>Direccion: </strong> {this.state.paciente.Domicilio}.</p>
                                </div>   
                            </CardText>
                        </Card>
                    </Tab>

                    <Tab label="Prestaciones" value="prestaciones" >
                        <Prestaciones paciente={this.state.paciente} can_operate={(this.state.busy != null) && (this.state.busy.IDPrestacionPrestador == this.state.paciente.IDPrestacionPrestador)} />
                    </Tab>

                    <Tab label="Órdenes" value="ordenes_medicas">
                        <Ordenes paciente={this.state.paciente} can_operate={(this.state.busy != null) && (this.state.busy.IDPrestacionPrestador == this.state.paciente.IDPrestacionPrestador)} />
                    </Tab>

                    <Tab label="Insumos" value="insumos">
                        <p>No hay insumos que mostrar</p>
                    </Tab>

                    <Tab label="Admisión" value="tab_hoja_admision">
                        <HojaAdmision paciente={this.state.paciente} />
                    </Tab>
                  </Tabs>                 
            </span>
       )
    }
}

