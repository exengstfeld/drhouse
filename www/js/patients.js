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




function Hoja_Admision(data){
    var data_admision = data.data_admision
    return (
        <Card>
            <CardText>
                <h2 style={styles.headline}> <b> Hoja de admisión </b> </h2>      
                <Divider/>      
                <div>
                    <b>Fecha:</b> {data_admision.FecEmision}
                </div><div>
                    <b>Nro de Revision:</b> {data_admision.NroRevision}
                </div><div>
                    <b>Medicamentos:</b> {data_admision.DescReaccionesAdvMedicamentos}
                </div><div>
                    <b>Motivo de Internacion:</b> {data_admision.DescMotivoInternacion}
                </div><div>
                    <b>Enfermedad Actual:</b> {data_admision.DescEnfermedadActual}
                </div><div>
                    <b>Diagnostico de Ingreso:</b> {data_admision.DescDiagnosticoIngreso}
                </div>   
            </CardText>
        </Card>
    )
}

function ShowPrestaciones(props){
    return (          
        <Card>
            <CardText>
                <div>
                   <b> {props.prestacion.Descproducto} </b> ( {props.prestacion.FecVisita} ) 
                </div>
                <div>
                    <i> {props.prestacion.DescNovedad} </i>
                </div>
            </CardText>
        </Card>
    )
}


class Ordenes extends React.Component {
    constructor(props) {
        super(props);
        this.handleObservacionChange = this.handleObservacionChange.bind(this)
        this.new_orden = this.new_orden.bind(this)
        this.save_orden = this.save_orden.bind(this)

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
        var view = (<span>Cargando vista...</span>);
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

module.exports = class Patients extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.new_prestacion = this.new_prestacion.bind(this);
        this.get_hoja_admision = this.get_hoja_admision.bind(this)
        this.marcar_salida = this.marcar_salida.bind(this)
        this.show_accion = this.show_accion.bind(this)

        this.state = {
            paciente: {},
            value:'prestaciones',
            data_admision:{},
            prestaciones_list:[{
                "FecVisita":"21/08/1990",
                "Descproducto":"Visita Tecnica",
                "DescNovedad":"Sin cambios notables"
                },{
                "FecVisita":"15/10/1992",
                "Descproducto":"Radiografia",
                "DescNovedad":"Todos los huesos rotos, no safo ni uno,"
                },{
                "FecVisita":"05/10/1993",
                "Descproducto":"No se como todavia sigue vivo, debe ser un milagro",
                "DescNovedad":"Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. " 
                },{
                "FecVisita":"05/10/1993",
                "Descproducto":"Visita de Control",
                "DescNovedad":"No se como todavia sigue vivo, debe ser un milagro"
                }]
            }
        }

    componentDidMount(){
        this.setState({paciente: JSON.parse(sessionStorage.shows)[this.props.params.id]})
    }

    marcar_salida(){
        post('/marcar/salida',{IDPrestacionPrestador: sessionStorage.loggedBusy.IDPrestacionPrestador}).then(function(response){
            if (response.success){
                sessionStorage.loggedBusy = null;
                browserHistory.push('/home');
            } else {
                this.setState({feedback: response.data});
            }
        }.bind(this))
    }

    handleObservacionChange(event){
        this.setState({Observacion: event.target.value});
    }

    get_prestaciones_list(){ 
        get('/prestaciones_paciente/'+this.state.paciente.IDPrestacionPrestador).then(function(response){
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


    get_hoja_admision(){
        get('/hoja_admision/' + this.state.paciente.IDPrestacionPrestador).then(function(response){
            if (response.success){
                this.setState({shows: response.data});
            } else {
               this.setState({feedback: response.data});
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

    show_accion(){
        console.info('show_accion')
        if(sessionStorage.loggedBusy != null && 
            sessionStorage.loggedBusy.IDPrestacionPrestador != sessionStorage.Atendiendo.IDPrestacionPrestador){
            console.info('bussy')
            return 'bussy'
        }

        if(sessionStorage.loggedBusy != null && 
            sessionStorage.loggedBusy.IDPrestacionPrestador == sessionStorage.Atendiendo.IDPrestacionPrestador){                    
            console.info('marcar_salida')
            return 'marcar_salida'
        }
        if(sessionStorage.loggedBusy == null){
            console.info('marcar_entrada')
            return 'marcar_entrada'
        }
    }


    render(){
        return(
            <div>
                { this.show_accion == 'bussy' && (
                    (<RaisedButton 
                        label = 'nombre_busy'
                        onTouchTap={this.goPatients} 
                        fullWidth={true}/>
                    )
                )}
                { this.show_accion == 'marcar_salida' && (
                    (<RaisedButton 
                        label="Marcar Salida" 
                        onTouchTap={this.marcar_salida} 
                        fullWidth={true}/>
                    )        
                )}
                { this.show_accion == 'marcar_entrada' && (
                    (<RaisedButton 
                        label="Marcar Entrada" 
                        onTouchTap={this.goPatients} 
                        fullWidth={true}/>
                    )
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
                <Tabs
                    value={this.state.value}                    
                    onChange={this.handleChange}
                  >
                    <Tab label="Prestaciones" value="prestaciones" >
                        { this.state.show_new_prestacion && (  
                            <div>   
                                <RaisedButton label="Nueva Prestacion" onTouchTap={this.new_prestacion} fullWidth={true}/>
                                {
                                    this.state.prestaciones_list.map((v, i) => (
                                        <div key={i}>
                                            <Paper style={form_style} zDepth={2}>
                                                <ShowPrestaciones prestacion={v} />
                                            </Paper>
                                        </div>
                                      )
                                    )
                                }
                            </div>    
                        )}
                        { !this.state.show_new_prestacion && (
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
                        )}

                    </Tab>

                    <Tab label="Órdenes" value="ordenes_medicas">
                        <Ordenes paciente={this.state.paciente} />
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
                                    <Hoja_Admision data_admision = {this.state.data_admision} />
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

