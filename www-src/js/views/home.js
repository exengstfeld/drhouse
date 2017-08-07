var React = require('react')
var browserHistory = require('react-router').hashHistory
var List = require('material-ui/List').List;
var ListItem = require('material-ui/List').ListItem;
var Subheader = require('material-ui').Subheader;
var IconButton = require('material-ui').IconButton
var Menu = require('material-ui/svg-icons/navigation/menu').default
var AppBar = require('material-ui').AppBar
var RaisedButton = require('material-ui').RaisedButton
var Divider = require('material-ui').Divider
var ReactPullToRefresh = require('react-pull-to-refresh')
var Person = require('material-ui/svg-icons/social/person').default
var PermIdentity = require('material-ui/svg-icons/action/perm-identity').default

// Utils
var isNotLoggedIn = require('../utils').isNotLoggedIn
var get = require('../utils').get

function TodayTask(param){
    return (
        <ListItem
            leftAvatar={
                (param.busy != null) && 
                    (param.busy.IDPrestacionPrestador == param.v.IDPrestacionPrestador) ? 
                        <Person/> : <PermIdentity/> }
            primaryText={param.v.BuscarComo} 
            secondaryText={<span>
                    {param.v.DescProducto} 
                    <span className={"pull-right"}>{param.v.HoraDesde}hs - {param.v.HoraHasta}hs</span>
                    </span>
            }
            secondaryTextLines={2}
            href={"index.html#/patients/" + param.v.IDPrestacionPrestador}
        />
    )
}


module.exports = class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.state = {
            tasks: [],
            busy: JSON.parse(sessionStorage.loggedBusy),
        };
    }
        
    handleRefresh(resolve, reject){
        get('/home').then(function(response){
            if (response.success){
                resolve();
                this.setState({tasks: response.data});
                sessionStorage.tasks = JSON.stringify(response.data);
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
            if (sessionStorage.tasks.length > 0){
                this.setState({tasks: JSON.parse(sessionStorage.tasks)});
            } else {
                this.loadFunctions()
            }
        }
    }

    loadFunctions(){ 
        get('/home').then(function(response){
            if (response.success){
                this.setState({tasks: response.data});
                sessionStorage.tasks = JSON.stringify(response.data);
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
                        this.state.tasks.map((v, i) => (
                            <span key={i}>
                                <TodayTask v={v} busy={this.state.busy}/>
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

