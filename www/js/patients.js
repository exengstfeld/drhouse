var React = require('react')
var browserHistory = require('react-router').hashHistory
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var Paper = require('material-ui').Paper
var FlatButton = require('material-ui').FlatButton
var api_base_url = require('../js/config').api_base_url
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
var get = require('../js/utils').get


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

function ShowOrdenes(props){
    return (          
        <Card>
            <CardText>
                <div>
                   <b> {props.orden.BuscarComo} </b> ( {props.orden.FecEmision} ) 
                </div>
                <div>
                    <i> {props.orden.OBSOrdenMedica} </i>
                </div>
            </CardText>
        </Card>
    )
}
module.exports = class Patients extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleComentarioChange = this.handleComentarioChange.bind(this)
        this.new_prestacion = this.new_prestacion.bind(this);
        this.new_orden = this.new_orden.bind(this)
        this.state = {
            paciente: JSON.parse(sessionStorage.Atendiendo),
            value:'prestaciones',
            show_new_prestacion:true,
            show_new_orden:true,
            'comentario':'',
            data_admision:{
                "FecEmision":"19/10/2016",
                "NroRevision":"ASD9862",
                "DescEnfermedadActual":"Incapacidad total por accidente Laboral",  
                "DescDiagnosticoIngreso":"Discapacidad Motora",
                "DescMotivoInternacion":"Accidente Laboral 007",
                "DescReaccionesAdvMedicamentos":"Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. "
                },
            ordenes_list:[{
                "FecEmision":"01/01/2015",
                "BuscarComo":"Dr. Pirulo Ortega",
                "OBSOrdenMedica":"Hacer radiografia de torax, y no se que mas escribir pero tengo que rellenar esto "
                },{
                "FecEmision":"05/10/1993",
                "BuscarComo":"Un NOmbre Bien Largo para Romper las BOlas ",
                "OBSOrdenMedica":"Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. " 
                },{
                "FecEmision":"21/05/2015",
                "BuscarComo":"Dr. Dos del Tres",
                "OBSOrdenMedica":"Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. "
                },{
                "FecEmision":"21/05/2017",
                "BuscarComo":"Dr. Nose Cuanto",
                "OBSOrdenMedica":"Control general de todo"
                }],
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

    handleChange(value){
        this.setState({
          value: value,
          show_new_prestacion:true,
          show_new_orden:true,
          comentario:'',
        })
    }

    get_prestaciones_list(){ 
        get(api_base_url + '/prestaciones_paciente/'+this.state.paciente.IDPrestacionPrestador).then(function(response){
            if (response.success){
                this.setState({prestaciones_list: response.data});
            } else {
               this.setState({feedback: response.data});
            }
        }.bind(this))
    }

    handleComentarioChange(event){
        this.setState({comentario: event.target.value});
    }

    new_prestacion(){
        this.setState({
          show_new_prestacion: !this.state.show_new_prestacion,
        })
    }
    
    show_new_prestacion(){
        return this.state.show_new_prestacion
    }


    new_orden(){
        this.setState({
          show_new_orden: !this.state.show_new_orden,
        })
    }
    
    show_new_orden(){
        return this.state.show_new_orden
    }
    
    get_ordenes_list(){ 
        get(api_base_url + '/ordenes_medicas/'+this.state.paciente.IDPrestacionPrestador).then(function(response){
            if (response.success){
                this.setState({ordenes_list: response.data});
            } else {
               this.setState({feedback: response.data});
            }
        }.bind(this))
    }

    get_hoja_admision(){
        get(api_base_url + '/hoja_admision/' + this.state.paciente.IDPrestacionPrestador).then(function(response){
            if (response.success){
                this.setState({data_admision:response.data});
            } else {
                this.setState({feedback: response.data});
            }
        }.bind(this))
    }    



    render(){
        return(
            <div>
                <RaisedButton label="Marcar Entrada" onTouchTap={this.goPatients} fullWidth={true}/>
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
                        { this.show_new_prestacion() && (  
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
                        { !this.show_new_prestacion() && (
                            <div>
                                <CardText>
                                    <TextField
                                        id="id_comentario" 
                                        hintText="Prestacion realizada"
                                        errorText="Campo Obligatorio."
                                        floatingLabelText="Prestacion realizada"
                                        value={this.state.comentario} 
                                        onChange={this.handleComentarioChange} 
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
                        { this.show_new_orden() && (  
                            <div>
                               <RaisedButton label="Nueva Orden" onTouchTap={this.new_orden} fullWidth={true}/>    
                                {
                                    this.state.ordenes_list.map((v, i) => (
                                        <div key={i}>
                                            <Paper style={form_style} zDepth={2}>
                                                <ShowOrdenes orden={v} />
                                            </Paper>
                                        </div>
                                      )
                                    )
                                }
                            </div>    
                        )}
                        { !this.show_new_orden() && (
                            <div>
                                <CardText>
                                    <TextField
                                        id="id_comentario" 
                                        hintText="Nueva orden medica"
                                        errorText="Campo Obligatorio."
                                        floatingLabelText="Nueva orden medica"
                                        value={this.state.comentario} 
                                        onChange={this.handleComentarioChange} 
                                        fullWidth={true}
                                        multiLine={true}
                                        rows={2}
                                    />
                                </CardText>
                                <CardActions>
                                    <RaisedButton label="Guardar" onTouchTap={this.new_orden} />
                                    <RaisedButton label="Cancelar" onTouchTap={this.new_orden} />
                                </CardActions>
                            </div>
                        )}
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

