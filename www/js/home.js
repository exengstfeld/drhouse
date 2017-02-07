var React = require('react')
var browserHistory = require('react-router').hashHistory
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var Paper = require('material-ui').Paper
var FlatButton = require('material-ui').FlatButton
var api_base_url = require('../js/config').api_base_url
var form_style = require('../js/config').form_style
var locateFunction = require ('../js/utils').locateFunction 
var isNotLoggedIn = require('../js/utils').isNotLoggedIn
var get = require('../js/utils').get

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
                    <b> Horario </b> {props.show.HoraDesde} - {props.show.HoraHasta}.
                </div><div>
                    <b> Telefono </b> {props.show.Telefono1}.
                </div><div>
                    <b> Direccion </b> {props.show.Domicilio}.
                </div>   
            </CardText>
            <CardActions>
                <FlatButton href={"/patients"} label="Detalle" />
            </CardActions>
        </Card>
    )
}

module.exports = class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shows: []
        };
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
        get(api_base_url + '/home').then(function(response){
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
                <Paper style={form_style} zDepth={2}>
                    {
                        this.state.shows.map((v, i) => (
                            <div key={i}>
                                <ShowCard show={v} />
                                <br/>
                            </div>
                          )
                        )
                    }
                </Paper>
            </div>
       )
    }
}

