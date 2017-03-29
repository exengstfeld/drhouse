var api_base_url = require('../js/config').api_base_url
var fetch = require('isomorphic-fetch')


var call = function(url, options){
    return fetch(api_base_url + url, options).then((response) => {
        if (response.status == 200) {
            return response.json()
        }
        if (response.status == 401) {
            alert("sesion invalida");
        }
        throw Error("Ha ocurrido un error grave: "+ response.statusText)
    })
}

module.exports = {
    isNotLoggedIn: function(){
        return (sessionStorage.loggedIn == "") || (sessionStorage.loggedIn == undefined)
    },

    closeActiveSession: function(){
        sessionStorage.loggedIn = "";
        sessionStorage.shows = "";
        sessionStorage.user = "";
    },

    getPriorizationIcon: function(_status){
        var avatar_path = ""
        if (_status == 1){
            avatar_path = "img/danger.png"
        }             
        if (_status == 2){
            avatar_path = "img/ok.png"
        }             
        if (_status == 3){
            avatar_path = "img/alert.png"
        }   
        return avatar_path
    },

    locatePatient: function(id_paciente){
        var pacientes = JSON.parse(sessionStorage.shows);
        for (i = 0; i < pacientes.length; i++) {  
            if (pacientes[i].id == id_paciente){
                return pacientes[i];
            }
        }
        throw Error("No se ha localizado la paciente "+ id_paciente);
    },
    post: function(url, body){
        var options = {
            "method": "POST",
            "headers":{
                "Content-Type": "application/json",
                "session-token": sessionStorage.loggedToken
            },
            "body": JSON.stringify(body)
        }
        return call(url, options);    
    },
    get: function(url){
        var options = {
            "method": "GET",
            "headers":{
                "session-token": sessionStorage.loggedToken
            }
        }
        return call(url, options);    
    }
}
