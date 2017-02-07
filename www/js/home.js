var React = require('react')
var browserHistory = require('react-router').hashHistory
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var Paper = require('material-ui').Paper
var FlatButton = require('material-ui').FlatButton
var api_base_url = require('../js/config').api_base_url
var form_style = require('../js/config').form_style
var locateFunction = require ('../js/utils').locateFunction 
var isNotLoggedIn = require('../js/utils').isNotLoggedIn

var RaisedButton = require('material-ui').RaisedButton
var TextField = require('material-ui').TextField
var Divider = require('material-ui').Divider
// var Notification = require('../js/common').Notification


function ShowCard(props){
    var avatar_path = ""

    if (props.show.status == 1){
        avatar_path = "img/danger.png"
    }             
    if (props.show.status == 2){
        avatar_path = "img/ok.png"
    }             
    if (props.show.status == 3){
        avatar_path = "img/alert.png"
    }   

    return (          
        <Card>
            <CardHeader
                avatar = {avatar_path}
                title= {props.show.BuscarComo} 
                subtitle= {<div>{props.show.DescProducto} ({props.show.HoraDesde} - {props.show.HoraHasta})</div>}
                actAsExpander={true}
                showExpandableButton={true}
            />
            <CardText expandable={true}>
                <div>
                    <b> Horario: </b> {props.show.HoraDesde} - {props.show.HoraHasta}.
                </div><div>
                    <b> Telefono: </b> {props.show.Telefono1}.
                </div><div>
                    <b> Direccion: </b> {props.show.Domicilio}.
                </div>   
            </CardText>
            <CardActions>
                <FlatButton label="Detalle" />
            </CardActions>
        </Card>
    )
}

module.exports = class Home extends React.Component {
    constructor(props) {
        super(props);
        this.goPatients = this.goPatients.bind(this);
        this.refresh = this.refresh.bind(this);
        this.state = {
            shows: [],
            expanded: false,
        };
    }
    
    goPatients(event){
        sessionStorage.Atendiendo = JSON.stringify(this.state.shows[0])
        browserHistory.push("/patients");
    };
    
    refresh(event){
        sessionStorage.shows = "";
        this.loadFunctions()
        // browserHistory.push("/home");
    }

    componentDidMount(){
        if (isNotLoggedIn()){
            browserHistory.push('/');
        } else {
            if (sessionStorage.shows.length > 0){
                this.setState({shows: JSON.parse(sessionStorage.shows)});
            } else {
                this.loadFunctions()
            }
        }
    }

    loadFunctions(){ 
        fetch(api_base_url + '/home',{
                method: 'GET',
                headers: {  "Content-Type": "application/json", 
                            "Authorization": sessionStorage.loggedToken}}
                ).then(response => response.json()).then(function(response){
            if (response.success){
                this.setState({shows: response.data});
                sessionStorage.shows = JSON.stringify(response.data);
            } else {
               this.setState({feedback: response.data});
            }
        }.bind(this))
    }

    render(){
        return(
            <div>
                <RaisedButton label="Actualizar Listado" onTouchTap={this.refresh} fullWidth={true}/>

                <RaisedButton label="MOC Seleccionar Paciente !!!!!!! " onTouchTap={this.goPatients} fullWidth={true}/>

                <Paper style={form_style} zDepth={2}>
                    {
                        this.state.shows.map((v, i) => (
                            <div key={i}>
                                <ShowCard show={v} />
                                <br/>
                                <Divider/>
                            </div>
                          )
                        )
                    }
                </Paper>
            </div>
       )
    }
}

