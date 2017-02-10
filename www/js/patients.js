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

var RaisedButton = require('material-ui').RaisedButton
var styles = require('../js/config').styles_tabs 
var Divider = require('material-ui').Divider
var {Tabs, Tab} = require('material-ui/Tabs')
var closeActiveSession = require('../js/utils').closeActiveSession
var get = require('../js/utils').get


function Hoja_Admision(hoja){
    console.info(hoja)
    return (          
        <Card>
            <CardText>
                <h2 style={styles.headline}> <b> Hoja de admisión </b> </h2>      
                <Divider/>      
                <div>
                    <b>Fecha:</b> data_admision-----FecEmision
                </div><div>
                    <b>Nro de Revision:</b> data_admision-----NroRevision
                </div><div>
                    <b>Medicamentos:</b> data_admision-----DescReaccionesAdvMedicamentos
                </div><div>
                    <b>Motivo de Internacion:</b> data_admision-----DescMotivoInternacion
                </div><div>
                    <b>Enfermedad Actual:</b> data_admision-----DescEnfermedadActual
                </div><div>
                    <b>Diagnostico de Ingreso:</b> data_admision-----DescDiagnosticoIngreso
                </div>   
            </CardText>
        </Card>
    )
}

module.exports = class Patients extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.get_hoja_admision = this.get_hoja_admision.bind(this);
        this.state = {
            paciente: JSON.parse(sessionStorage.Atendiendo),
            'value':'',
            'data_admision':{}}
        }

    get_hoja_admision(IDPrestacionPrestador){
        console.info("tvari")
        fetch(api_base_url + '/hoja_admision/' + IDPrestacionPrestador,{
            method: 'GET',
            headers: {  "Content-Type": "application/json", 
                        "Authorization": sessionStorage.loggedToken}}
            ).then(response => response.json()).then(function(response){
                console.info(response.data)
                console.info(response.success)
                if (response.success){
                    console.info('suka ')
                    console.info(this.state.data_admision);
                    this.setState({data_admision:response.data});
                    console.info(this.state.data_admision);
                } else {
                    this.setState({feedback: response.data});
                }
        }.bind(this))
        console.info(this.state.data_admision)
    }       


    handleChange(value){
        this.setState({
          value: value,
        })
        if (value=='hoja_admision')
            console.info("value=='hoja_admision'")
            this.get_hoja_admision(this.state.paciente.IDPrestacionPrestador)
        console.info("fin value ")
    }



    render(){
        console.info(this.state.data_admision)
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
                      <div>
                        <RaisedButton label="Nueva Prestacion" onTouchTap={this.goPatients} fullWidth={true}/>
                        <p>
                          Tabs are also controllable if you want to programmatically pass them their values.
                          This allows for more functionality in Tabs such as not
                          having any Tab selected or assigning them different values.
                        </p>
                      </div>
                    </Tab>
                    <Tab label="Órdenes" value="ordenes_medicas">
                      <div>
                        <RaisedButton label="Nueva Orden" onTouchTap={this.goPatients} fullWidth={true}/>    
                        <p>
                          This is another example of a controllable tab. Remember, if you
                          use controllable Tabs, you need to give all of your tabs values or else
                          you wont be able to select them.
                        </p>
                      </div>
                    </Tab>

                    <Tab label="Insumos" value="insumos">
                      <div>
                        <RaisedButton label="Cargar Insumos" onTouchTap={this.goPatients} fullWidth={true}/>
                        <p>
                          This is another example of a controllable tab. Remember, if you
                          use controllable Tabs, you need to give all of your tabs values or else
                          you wont be able to select them.
                        </p>
                      </div>
                    </Tab>



                    <Tab label="Admisión" value="hoja_admision">
                                <Paper style={form_style} zDepth={2}>
                                    {
                                        <div>
                                            <Hoja_Admision hoja = {this.state.data_admision}  />
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

