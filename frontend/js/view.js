var view = (function(){
    "use strict";
    
    var view = {};

    var logstate;

    var selectItem = function(page) {
    	$(".active").removeClass('active');
    	$('.' + page).addClass('active');
    };

    view.initiatePage = function() {
        document.getElementById("about").onclick = function (e){
            e.preventDefault(e);
            selectItem("about");
            view.renderPage("about");
        };
        document.getElementById("resume").onclick = function (e){
            e.preventDefault(e);
            selectItem("resume");
            view.renderPage("resume");
        };
        document.getElementById("contact").onclick = function (e){
            e.preventDefault(e);
            view.renderPage("contact");
        };
        document.getElementById("admin").onclick = function (e){
            e.preventDefault(e);
            selectItem("admin");
            view.renderPage("admin");
        };
    };

    view.renderPage = function (page) {
        switch (page) {
            case "about":
                $(".container").load("./tmp/about.html");
                selectItem("about");
                $(".error").empty();
                break;
            case "resume":
                $(".container").load("./tmp/resume.html");
                selectItem("resume");
                $(".error").empty();
                break;
            case "contact":
                $(".container").load("./tmp/contact.html");
                selectItem("contact");
                $(".error").empty();
                break;
            case "admin":
                $(".container").empty();
                selectItem("admin");
                view.renderAbout(logstate);
                break;
        };
    };

    view.checkState = function (callback) {
        model.sign(function (err, state) {
            if (err) return console.log(err);
            logstate = state;
            if (callback) callback(logstate);
        });
    };

    var signinMessage = function (err) {
        if (err) {
            var e = document.getElementById("error");
            e.innerHTML = `<span class="alert alert-danger">${(err)}</span>`;
        }
        else {
            var e = document.getElementById("error");
            e.innerHTML = `<span class="alert alert-success">Signin success</span>`;
        }
    };

    view.renderAbout = function (state) {
        var container = document.getElementById('container');
        container.innerHTML = "";
        var doc = document.createElement('div');
        doc.className = "row align-items-center mainrow adminpage";
        doc.innerHTML = `<div class="col-lg-12 maintext">
    Admin Login
</div>`;
        var innertext = document.createElement('div');
        innertext.className = "col-lg-12 subtext";
        if (state === "false") {
            var content = document.createElement('form');
            content.id = "signin";
            content.innerHTML = `
            <input type="text" name="username" id="username" class="form-control form_element" placeholder="Username"/>
            <br>
            <input type="password" name="password" id="password" class="form-control form_element" placeholder="Password"/>
            <br>
            <button type="submit" class="btn">Login</button>`;
            content.onsubmit = function (e) {
                e.preventDefault();
                var info = {};
                info.username = document.getElementById("username").value;
                info.password = document.getElementById("password").value;
                model.signIn(info, function (err, user) {
                    if (err) return signinMessage(err);
                    signinMessage();
                    view.checkState(view.renderAbout);
                });
            }
        }
        if (state === "true") {
            var content = document.createElement('button');
            content.className = "btn";
            content.innerHTML = `Logout`;
            content.onclick = function (e) {
                e.preventDefault();
                model.signOut(function (err) {
                    if (err) console.log(err);
                    view.checkState(view.renderAbout);
                });
            };
        }
        innertext.append(content);
        doc.append(innertext);
        container.prepend(doc);
        // document.getElementById("test").onsubmit = function (e) {
        //     e.preventDefault();
        //     model.getMessages();
        // };
    };
    
    return view;
    
}());