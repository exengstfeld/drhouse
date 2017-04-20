var React = require('react')
var browserHistory = require('react-router').hashHistory
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var Paper = require('material-ui').Paper
var FlatButton = require('material-ui').FlatButton
var form_style = require('../js/config').form_style
var locatePatient = require ('../js/utils').locatePatient 
var isNotLoggedIn = require('../js/utils').isNotLoggedIn
var get = require('../js/utils').get

var List = require('material-ui/List').List;
var ListItem = require('material-ui/List').ListItem;
var Subheader = require('material-ui').Subheader;
var Avatar = require('material-ui').Avatar;
var IconButton = require('material-ui').IconButton
var Menu = require('material-ui/svg-icons/navigation/menu').default

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
                    iconElementLeft={<IconButton onTouchTap={window.toggleDrawer}><Menu /></IconButton>}
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
                                        <p>
                                            {v.DescProducto} ({v.HoraDesde} - {v.HoraHasta} hs)   
                                        </p>
                                  }
                                  secondaryTextLines={2}
                                  href={"index.html#/patients/" + v.IDPrestacionPrestador}
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

