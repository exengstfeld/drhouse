var React = require('react')
var browserHistory = require('react-router').hashHistory
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var Paper = require('material-ui').Paper
var FlatButton = require('material-ui').FlatButton
var form_style = require('../js/config').form_style
var locateFunction = require ('../js/utils').locateFunction 
var isNotLoggedIn = require('../js/utils').isNotLoggedIn
var get = require('../js/utils').get
var AppBar = require('material-ui').AppBar
var getPriorizationIcon = require('../js/utils').getPriorizationIcon
var RaisedButton = require('material-ui').RaisedButton
var TextField = require('material-ui').TextField
var Divider = require('material-ui').Divider
var ReactPullToRefresh = require('react-pull-to-refresh')
// var Notification = require('../js/common').Notification
module.exports = class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.state = {
            shows: []
        };
    }
        
    handleRefresh(resolve, reject){
        get('/home').then(function(response){
            if (response.success){
                resolve();
                this.setState({shows: response.data});
                sessionStorage.shows = JSON.stringify(response.data);
            } else {
                reject();
                this.setState({feedback: response.data});
            }
        }.bind(this))
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
        get('/home').then(function(response){
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
                <AppBar
                    title={"Orden del día"}
                />
                <ReactPullToRefresh onRefresh={this.handleRefresh}>
                    {
                        this.state.shows.map((v, i) => (
                            <div key={i}>
                                <Card>
                                    <CardHeader
                                        avatar = {getPriorizationIcon(v.status)}
                                        title= {v.BuscarComo} 
                                        subtitle= {<div>{v.DescProducto} ({v.HoraDesde} - {v.HoraHasta})</div>}
                                    />
                                    <CardText>
                                        <p><b> Horario: </b> {v.HoraDesde} - {v.HoraHasta}.</p>
                                        <p><b> Telefono: </b> {v.Telefono1}.</p>
                                        <p><b> Direccion: </b> {v.Domicilio}.</p>
                                    </CardText>
                                    <CardActions>
                                        <FlatButton href={"index.html#/patients/" + i} label="Detalle" />
                                    </CardActions>
                                </Card>
                            </div>
                          )
                        )
                    }
                </ReactPullToRefresh>
            </div>
       )
    }
}

