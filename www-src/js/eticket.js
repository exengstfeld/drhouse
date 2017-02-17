var React = require('react')
var {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} = require('material-ui/Table')
var RaisedButton = require('material-ui').RaisedButton
var TextField = require('material-ui').TextField
var Paper = require('material-ui').Paper
var Divider = require('material-ui').Divider
var browserHistory = require('react-router').hashHistory
var Notification = require('../js/common').Notification
var input_style = require('../js/config').input_style
var form_style = require('../js/config').form_style
var isNotLoggedIn = require('../js/utils').isNotLoggedIn

module.exports = class ScanTicket extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.processFetchError = this.processFetchError.bind(this);
        this.processMarcarResponse = this.processMarcarResponse.bind(this);
        this.processValidationResponse = this.processValidationResponse.bind(this);
        this.state = {
            code: "",
            id_funcion: "",
            eticket: {
                "tipo_documento": "",
                "nombre": "",
                "importe_total": "", 
                "id_operacion": "",
                "nro_documento": "",
                "apellido": "",
                "tickets": []
            },
            all_marked: false,
            feedback: "",
            eticket_validated: false,
            eticket_error: false
        };
    }

    componentDidMount() {
        if (isNotLoggedIn()){
            browserHistory.push('/');
        } else {
            this.setState({id_funcion: this.props.params.id});
            cordova.plugins.barcodeScanner.scan(
                ((result) => this.setState({code: result.text})),
                ((error) => this.setState({eticket_error: true, feedback: error})),
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

    componentDidUpdate(){
        if ((this.state.code != "") && !(this.state.eticket_validated)){
            this.validateETicket();
        }
    }

    validateETicket(){
        fetch('/mobile/eticket/validar', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({"hash": this.state.code, "id_funcion": this.state.id_funcion})
        }).then((response) => {
            if (response.status == 200) {
                return response.json();
            }
            throw Error("Error de conexion, por favor, intente más tarde: "+ response.statusText);
        }).then(
            this.processValidationResponse 
        ).catch( 
            this.processFetchError 
        );     
    }

    processValidationResponse(response) {
        if (response.success){
            this.setState({eticket_validated: true, eticket: response.data, eticket_error: false, all_marked: response.data.tickets.map((ticket, i) => (ticket.ingreso != "" && ticket.ingreso != undefined)).reduce( (vAnt, vAct, i, vector) => (vAnt && vAct))});
        } else {
            this.setState({eticket_validated: true, feedback: response.data, eticket_error: true});
        }
    }

    processMarcarResponse(response){
        if (response.success){
            this.setState({feedback: "Se ha marcado la entrada con exito", eticket_error: true});
        } else {
            this.setState({feedback: response.data, eticket_error: true});
        }
    }

    processFetchError(error){
       this.setState({feedback: error, eticket_error: true});
    }

    handleSubmit() {
        fetch('/mobile/eticket/marcar', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({"hash": this.state.code, "id_funcion": this.state.id_funcion})
        }).then((response) => {
            if (response.status == 200) {
                return response.json();
            }
            throw Error("Error de conexion, por favor, intente más tarde: "+ response.statusText);
        }).then( 
            this.processMarcarResponse 
        ).catch(
            this.processFetchError 
        );     
    }
    
    handleClose(){
        this.setState({feedback: "", eticket_error: false});
        browserHistory.push('/home');
    }

    render(){
        return ( 
            <div>
              <Notification open={this.state.eticket_error} onRequestClose={this.handleClose}>{this.state.feedback}</Notification>
              <Paper style={form_style} zDepth={2}>
                  <TextField style={input_style} underlineShow={false} floatingLabelText="Operación" id="operacion-field" value={this.state.eticket.id_operacion} disabled />
                  <Divider />
                  <TextField style={input_style} underlineShow={false} floatingLabelText="Importe" id="importe-field" value={this.state.eticket.importe_total} disabled />
                  <Divider />
                  <TextField style={input_style} underlineShow={false} floatingLabelText="Nombre" id="nombre-field" value={this.state.eticket.nombre + " " + this.state.eticket.apellido} disabled />
                  <Divider />
                  <TextField style={input_style} underlineShow={false} floatingLabelText="Documento" id="documento-field" value={this.state.eticket.tipo_documento + " " + this.state.eticket.nro_documento} disabled />
                  <Divider />
                  { this.state.eticket_validated && (
                      <Table allRowsSelected={this.state.all_marked}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                          <TableRow>
                            <TableHeaderColumn>Nro Ticket</TableHeaderColumn>
                            <TableHeaderColumn>Categoria</TableHeaderColumn>
                            <TableHeaderColumn>Fila</TableHeaderColumn>
                            <TableHeaderColumn>Butaca</TableHeaderColumn>
                          </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                        { this.state.eticket.tickets.map((ticket, i) => (
                              <TableRow key={i} selectable={false}>
                                <TableRowColumn>{ticket.nro_ticket}</TableRowColumn>
                                <TableRowColumn>{ticket.categoria}</TableRowColumn>
                                <TableRowColumn>{ticket.fila == "0" ? "-": ticket.fila}</TableRowColumn>
                                <TableRowColumn>{ticket.butaca == "0" ? "-": ticket.butaca}</TableRowColumn>
                              </TableRow>
                            )
                        )}
                        </TableBody>
                      </Table>
                  )}
                  <Divider />
                  <RaisedButton label="Marcar Acceso" disabled={this.state.all_marked} onTouchTap={this.handleSubmit} fullWidth={true}/>
              </Paper>
            </div>
        )
    }
}

