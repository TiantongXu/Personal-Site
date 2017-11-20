var model = (function(){
    "use strict";
    
    var model = {};
    
    window.onload = function () {
        view.checkState();
        view.initiatePage();
        view.renderPage("about");
    };

    // model.addExperience = function (data, callback) {

    // };

    var callApi = function (method, url, body, isjson, callback){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(e){
            switch(this.readyState) {
                 case (XMLHttpRequest.DONE):
                    if (this.status === 200) {
                        if(isjson) return callback(null, JSON.parse(this.responseText));
                        return callback(null, this.responseText);
                    } else {
                        return callback(this.responseText, null);
                    }
            }
        };
        xhttp.open(method, url, true);
        if (isjson && body){
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(JSON.stringify(body));
        } else {
            xhttp.send(body);
        }
    };

    model.signIn = function(data, callback) {
        callApi('POST', '/api/signin/', data, true, function (err, user) {
            if (err) return callback(err, user);
            callback(null, user);
        });
    };

    model.addExperience = function (data, callback) {
        callApi('POST', '/api/experience/', data, true, callback);
    };

    model.addSkills = function (data, callback) {
        callApi('POST', '/api/skills/', data, true, callback);
    };

    model.addEducation = function (data, callback) {
        callApi('POST', '/api/education/', data, true, callback);
    };

    model.getExperience = function (callback) {
        callApi('GET', '/api/experience/', null, true, callback);
    };

    model.getEducation = function (callback) {
        callApi('GET', '/api/education/', null, true, callback);
    };

    model.getSkills = function (callback) {
        callApi('GET', '/api/skills/', null, true, callback);
    };

    model.signOut = function (callback) {
        callApi('GET', '/api/signout/', null, false, callback);
    };

    model.sign = function (callback) {
        callApi('GET', '/api/sign/', null, false, callback);
    };

    return model;

}());