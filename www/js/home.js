var React = require('react')
var browserHistory = require('react-router').hashHistory
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var Paper = require('material-ui').Paper
var FlatButton = require('material-ui').FlatButton
var api_base_url = require('../js/config').api_base_url
var form_style = require('../js/config').form_style
var locateFunction = require ('../js/utils').locateFunction 
var isNotLoggedIn = require('../js/utils').isNotLoggedIn

function ShowCard(props){
    return (
        <Card>
          <CardHeader
            title={props.show.nombre}
            subtitle= {props.show.lugar}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
              Será en {props.show.lugar_domicilio} en la sala {props.show.sala} el día {props.show.fecha} a las {props.show.hora}hs. Se puede marcar entrada hasta el {props.show.fecha_baja} a las {props.show.hora_baja}hs
          </CardText>
          <CardActions>
            <FlatButton href={"index.html#/scan/"+props.show.id} label="Leer Ticket" />
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
        fetch(api_base_url + '/mobile/funciones/'+sessionStorage.loggedIn).then(response => response.json()).then(function(response){
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

