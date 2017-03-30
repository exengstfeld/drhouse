var React = require('react')
var browserHistory = require('react-router').hashHistory
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var Paper = require('material-ui').Paper
var FlatButton = require('material-ui').FlatButton
var form_style = require('../js/config').form_style
var locateFunction = require ('../js/utils').locateFunction 
var isNotLoggedIn = require('../js/utils').isNotLoggedIn
var get = require('../js/utils').get

var List = require('material-ui/List').List;
var ListItem = require('material-ui/List').ListItem;
var Subheader = require('material-ui').Subheader;
var Avatar = require('material-ui').Avatar;

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
                    title={"Bandeja de entrada"}
                />
                <ReactPullToRefresh onRefresh={this.handleRefresh}>
                    <List>
                        <Subheader>Hoy</Subheader>
                    {
                        this.state.shows.map((v, i) => (
                            <span key={i}>
                                <ListItem
                                  leftAvatar={<Avatar src={getPriorizationIcon(v.status)} />}
                                  primaryText={v.BuscarComo} 
                                  secondaryText={
                                      <p>{v.DescProducto}. Desde las {v.HoraDesde}hs hasta las {v.HoraHasta}hs</p>
                                  }
                                  secondaryTextLines={2}
                                  href={"index.html#/patients/" + i}
                                />
                                <Divider inset={true} />
                            </span>
                          )
                        )
                    }
                    </List>
                </ReactPullToRefresh>
            </div>
       )
    }
}

