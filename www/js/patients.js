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
    
var RaisedButton = require('material-ui').RaisedButton
var styles = require('../js/config').styles_tabs 
var Divider = require('material-ui').Divider
var {Tabs, Tab} = require('material-ui/Tabs')
var closeActiveSession = require('../js/utils').closeActiveSession
var app_bar_style = require('../js/config').app_bar_style 
var get = require('../js/utils').get
var post = require('../js/utils').post



class Prestaciones extends React.Component{
    constructor(props) {
        super(props);
        this.get_prestaciones_list = this.get_prestaciones_list.bind(this);
        this.new_prestacion = this.new_prestacion.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this)
        this.state = {
            prestaciones_list:[]
        }
    }

    componentDidMount(props){
        if (isNotLoggedIn()){
            browserHistory.push('/');
        } else {
        console.info(this.props)
        this.get_prestaciones_list();
        }
    }

    get_prestaciones_list(props){ 
        get('/prestaciones_paciente/' + this.props.paciente.IDPrestacionPrestador).then(function(response){
            if (response.success){
                this.setState({prestaciones_list: response.data});
            } else {
               this.setState({feedback: response.data});
            }
        }.bind(this))   
    }

    new_prestacion(){
        this.setState({
          show_new_prestacion: !this.state.show_new_prestacion,
        })
    }

    render(){         
        var view = (<span> Cargando vista </span>)
        if (this.state.show_new_prestacion){
            view=(
                <div>
                    <CardText>
                        <TextField
                            id="id_Observacion" 
                            hintText="Prestacion realizada"
                            errorText="Campo Obligatorio."
                            floatingLabelText="Prestacion realizada"
                            value={this.state.Observacion} 
                            onChange={this.handleObservacionChange} 
                            fullWidth={true}
                            multiLine={true}
                            rows={2}
                        />
                    </CardText>
                    <CardActions>
                        <RaisedButton label="Guardar" onTouchTap={this.new_prestacion} />
                        <RaisedButton label="Cancelar" onTouchTap={this.new_prestacion} />
                    </CardActions>
                </div>
            )
        } else {
            view = (
                <div>   
                    <RaisedButton label="Nueva Prestacion" onTouchTap={this.new_prestacion} fullWidth={true}/>
                    {
                        this.state.prestaciones_list.map((v, i) => (
                            <div key={i}>
                                <Paper style={form_style} zDepth={2}>
                                <Card>
                                    <CardText>
                                        <div>
                                           <b> {v.Descproducto} </b> ( {v.FecVisita} ) 
                                        </div>
                                        <div>
                                            <i> {v.DescNovedad} </i>
                                        </div>
                                    </CardText>
                                </Card>
                                </Paper>
                            </div>
                          )
                        )
                    }
                </div>   
            )
        }
        return(view)
    }
}

class Ordenes extends React.Component {
    constructor(props) {
        super(props);
        this.handleObservacionChange = this.handleObservacionChange.bind(this)
        this.new_orden = this.new_orden.bind(this)
        this.save_orden = this.save_orden.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)

        this.state = {
            show_new_orden: true,
            ordenes_list: [],
            feedback: "",
            observacion: ""
        }    
    }

    componentDidMount(){
        if (isNotLoggedIn()){
            browserHistory.push('/');
        } else {
            this.get_ordenes_list();
        }
    }

    save_orden(){
        post('/ordenes_medicas', {'observacion':this.state.observacion, 'idEnte': this.props.paciente.IdEnte}).then(
            this.new_orden
        ).catch(
            this.setState({feedback: error, error: true})
        )     
    }

    handleObservacionChange(event){
        this.setState({Observacion: event.target.value});
    }

    new_orden(){
        this.setState({
          show_new_orden: !this.state.show_new_orden,
          Observacion: '',
        })
    }
        
    get_ordenes_list(){ 
        get('/ordenes_medicas/' + this.props.paciente.IDPrestacionPrestador).then(function(response){
            if (response.success){
                this.setState({ordenes_list: response.data});
            } else {
                this.setState({feedback: response.data});
            }
        }.bind(this))
    }

    render(){
        var view = (<span>Cargando vista...</span>)
        
        if (this.state.show_new_orden){
            view = (
                <div>
                   <RaisedButton label="Nueva Orden" onTouchTap={this.new_orden} fullWidth={true}/>    
                    {
                        this.state.ordenes_list.map((v, i) => (
                            <div key={i}>
                                <Paper style={form_style} zDepth={2}>
                                    <Card>
                                        <CardText>
                                            <div>
                                               <b> {v.BuscarComo} </b> ( {v.FecEmision} ) 
                                            </div>
                                            <div>
                                                <i> {v.OBSOrdenMedica} </i>
                                            </div>
                                        </CardText>
                                    </Card>
                                </Paper>
                            </div>
                          )
                        )
                    }
                </div>    
            )
        } else {
            view = (
                <div>
                    <CardText>
                        <TextField
                            id="id_Observacion" 
                            hintText="Nueva orden medica"
                            errorText="Campo Obligatorio."
                            floatingLabelText="Nueva orden medica"
                            value={this.state.Observacion} 
                            onChange={this.handleObservacionChange} 
                            fullWidth={true}
                            multiLine={true}
                            rows={2}
                        />
                    </CardText>
                    <CardActions>
                        <RaisedButton label="Guardar" onTouchTap={this.save_orden} />
                        <RaisedButton label="Cancelar" onTouchTap={this.new_orden} />
                    </CardActions>
                </div>
            )
        }

        return (view)
    }
}

class HojaAdmision extends React.Component {
    constructor(props){
        super(props);
        this.get_hoja_admision = this.get_hoja_admision.bind(this)     
        this.state = {
            hoja_admision:{}
        }    
    }

    componentDidMount(){
        if (isNotLoggedIn()){
            browserHistory.push('/');
        } else {
            this.get_hoja_admision();
        }
    }

    get_hoja_admision(){
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
                    <h2 style={styles.headline}> <b> Hoja de admisión </b> </h2>      
                    <Divider/>      
                    <div>
                        <b>Fecha:</b> {this.state.hoja_admision.FecEmision}
                    </div><div>
                        <b>Nro de Revision:</b> {this.state.hoja_admision.NroRevision}
                    </div><div>
                        <b>Medicamentos:</b> {this.state.hoja_admision.DescReaccionesAdvMedicamentos}
                    </div><div>
                        <b>Motivo de Internacion:</b> {this.state.hoja_admision.DescMotivoInternacion}
                    </div><div>
                        <b>Enfermedad Actual:</b> {this.state.hoja_admision.DescEnfermedadActual}
                    </div><div>
                        <b>Diagnostico de Ingreso:</b> {this.state.hoja_admision.DescDiagnosticoIngreso}
                    </div>   
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
        this.componentDidMount = this.componentDidMount.bind(this)
        this.showAccion = this.showAccion.bind(this)

        this.state = {
            value:'prestaciones',
            show_accion: '',
            paciente:{},
            }
        }

    componentDidMount(){
        if (isNotLoggedIn()){
            browserHistory.push('/');
        } else {
            this.setState({paciente: JSON.parse(sessionStorage.shows)[this.props.params.id]});
            this.showAccion(JSON.parse(sessionStorage.shows)[this.props.params.id])
        }
    }

    marcar_entrada(){
        post('/marcar/entrada', this.state.paciente ).then(function(response){
            if (response.success){
                console.info('marco Entrada')
                sessionStorage.loggedBusy = JSON.stringify(this.state.paciente)
                this.showAccion(this.state.paciente)
            } else {
                console.info('error Entrada')
                this.setState({feedback: response.data} );
            }
        }.bind(this))

    }

    marcar_salida(){
        var busy = JSON.parse(sessionStorage.loggedBusy)
        post('/marcar/salida',{IDPrestacionPrestador: busy.IDPrestacionPrestador}).then(function(response){
            if (response.success){
                sessionStorage.loggedBusy = null;
                this.state.show_accion = ''
                browserHistory.push('/home');
            } else {
                this.setState({feedback: response.data} );
            }
        }.bind(this))
    }

    handleChange(value){
        this.setState({
          value: value,
          show_new_prestacion:true,
          show_new_orden:true,
          Observacion:'',
        })
    }

    goBussy(){

    }

    showAccion(props){
        var show_accion = ""
        var busy = JSON.parse(sessionStorage.loggedBusy)

        if(busy != null && 
            busy.IDPrestacionPrestador != props.IDPrestacionPrestador){
            show_accion = 'bussy'
        }

        if(busy != null && 
            busy.IDPrestacionPrestador == props.IDPrestacionPrestador){                    
            show_accion = 'marcar_salida'
        }
        if(busy == null){
            show_accion = 'marcar_entrada'
        }

        this.setState({show_accion: show_accion})
    }


    render(){
        return(
            <div>
                { this.state.show_accion == 'bussy' && (
                    (<RaisedButton 
                        label = {<b>En: {JSON.parse(sessionStorage.loggedBusy).BuscarComo}</b>}
                        onTouchTap={this.goPatients} 
                        fullWidth={true}
                    />)
                )}
                { this.state.show_accion == 'marcar_salida' && (
                    (<RaisedButton 
                        label="Marcar Salida" 
                        onTouchTap={this.marcar_salida} 
                        fullWidth={true}
                    />)        
                )}
                { this.state.show_accion == 'marcar_entrada' && (
                    (<RaisedButton 
                        label="Marcar Entrada" 
                        onTouchTap={this.marcar_entrada} 
                        fullWidth={true}
                    />)
                )}
                
                <Card>
                    <CardHeader
                        title= {this.state.paciente.BuscarComo} 
                        subtitle= {<div>{this.state.paciente.DescProducto} ({this.state.paciente.HoraDesde} - {this.state.paciente.HoraHasta})</div>}
                        actAsExpander={true}
                        showExpandableButton={true}
                    />
                    <CardText expandable={true}>
                        <div>
                            <b> Horario: </b> {this.state.paciente.HoraDesde} - {this.state.paciente.HoraHasta}.
                        </div><div>
                            <b> Telefono: </b> {this.state.paciente.Telefono1}.
                        </div><div>
                            <b> Direccion: </b> {this.state.paciente.Domicilio}.
                        </div>   
                    </CardText>
                </Card>
                <Tabs value={this.state.value} onChange={this.handleChange} >
                    <Tab label="Prestaciones" value="prestaciones" >
                        <Prestaciones paciente= {(this.state.paciente)} />
                    </Tab>

                    <Tab label="Órdenes" value="ordenes_medicas">
                        <Ordenes paciente= {this.state.paciente} />
                    </Tab>

                    <Tab label="Insumos" value="insumos">
                      <div>
                            <RaisedButton label="Cargar Insumos" onTouchTap={this.goPatients} fullWidth={true}/>
                            <h2 style={styles.headline}> <b> UPSS </b> </h2>      
                      </div>
                    </Tab>

                    <Tab label="Admisión" value="tab_hoja_admision">
                        <Paper style={form_style} zDepth={2}>
                            {
                                <div>
                                    <HojaAdmision paciente={this.state.paciente} />
                                    <Divider/>
                                </div>
                            }
                        </Paper>
                    </Tab>

                  </Tabs>                 
            </div>
       )
    }
}

