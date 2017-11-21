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
            selectItem("contact");
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
                $(".container").load("./tmp/resume.html", function() {
                    renderResume(logstate)
                });
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
                renderAbout(logstate);
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

    var renderAbout = function (state) {
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
            <input type="text" name="username" id="username" class="form-control signin_form" placeholder="Username"/>
            <br>
            <input type="password" name="password" id="password" class="form-control signin_form" placeholder="Password"/>
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
                    view.checkState(renderAbout);
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
                    view.checkState(renderAbout);
                });
            };
        }
        innertext.append(content);
        doc.append(innertext);
        container.prepend(doc);
    };

    var renderBox = function (type) {
        var doc = document.createElement('form');
        switch (type) {
            case "education":
                var container = document.getElementById('education_add');
                doc.innerHTML = `Add Education:<div class="col-lg-11 subtext row">
    <textarea rows="5" name="details" id="education_details" class="col-lg-12 form-control form_element" placeholder="Details"></textarea>
</div>
<div class="col-lg-1 subtext">
    <input type="submit" value="" class="resume_btn add_btn"></input>
</div>`;
                doc.onsubmit = function (e) {
                    e.preventDefault();
                        var info = {};
                        info.details = document.getElementById("education_details").value;
                        if (info.details) {
                            model.addEducation(info, function(err) {
                                if (err) return console.log(err);
                                $("#skills,#job,#education").empty();
                                renderResume(logstate);
                            });
                        }
                };
                break;
            case "skills":
                var container = document.getElementById('skills_add');
                doc.innerHTML = `Add Skills:<div class="col-lg-11 subtext row">
    <textarea rows="5" name="details" id="skills_details" class="col-lg-12 form-control form_element" placeholder="Details"></textarea>
</div>
<div class="col-lg-1 subtext">
    <input type="submit" value="" class="resume_btn add_btn"></input>
</div>`;
                doc.onsubmit = function (e) {
                    e.preventDefault();
                        var info = {};
                        info.details = document.getElementById("skills_details").value;
                        if (info.details) {
                            model.addSkills(info, function(err) {
                                if (err) return console.log(err);
                                $("#skills,#job,#education").empty();
                                renderResume(logstate);
                            });
                        }
                };
                break;
            case "experience":
                var container = document.getElementById('job_add');
                doc.innerHTML = `Add Job Experience:<div class="col-lg-11 subtext row">
    <input type="text" name="date" id="date" class="col-lg-4 form-control form-group form_element" placeholder="Date"/>
    <input type="text" name="employer" id="employer" class="col-lg-4 form-control form-group form_element" placeholder="Employer"/>
    <input type="text" name="place" id="place" class="col-lg-4 form-control form-group form_element" placeholder="Place"/>
    <textarea rows="5" name="details" id="job_details" class="col-lg-12 form-control form_element" placeholder="Details"></textarea>
</div>
<div class="col-lg-1 subtext">
    <input type="submit" value="" class="resume_btn add_btn"></input>
</div>`;
                doc.onsubmit = function (e) {
                    e.preventDefault();
                        var info = {};
                        info.date = document.getElementById("date").value;
                        info.employer = document.getElementById("employer").value;
                        info.place = document.getElementById("place").value;
                        info.details = document.getElementById("job_details").value;
                        if (info.date && info.employer && info.place && info.details) {
                            model.addExperience(info, function(err) {
                                if (err) return console.log(err);
                                $("#skills,#job,#education").empty();
                                renderResume(logstate);
                            });
                        }
                };
                break;
        };
        doc.className = "col-lg-12 row";
        container.innerHTML = `<div class="row align-items-center mainrow">
        </div>`;
        container.prepend(doc);
    };

    var renderInfo = function (type, data, admin) {
        if (admin) {
            var doc = document.createElement('form');
            var checkbtn = document.createElement('button');
            checkbtn.className = "resume_btn check_btn";
            var crossbtn = document.createElement('button');
            crossbtn.className = "resume_btn cross_btn";
            var btnholder = document.createElement('div');
            btnholder.className = "col-lg-1 subtext";
        }
        else {
            var doc = document.createElement('div');
        }

        switch (type) {
            case "education":
                var container = document.getElementById('education');
                if (admin) {
                    doc.innerHTML = `<div class="col-lg-11 subtext row">
    <textarea rows="5" name="details" id='${data._id}' class="col-lg-12 form-control form_element" placeholder="Details">${data.details}</textarea>
</div>`;
                    checkbtn.onclick = function (e) {
                        e.preventDefault();
                            var info = {};
                            info.details = document.getElementById(data._id).value;
                            info._id = data._id;
                            if (info.details) {
                                model.updateEducation(info, function(err) {
                                    if (err) return console.log(err);
                                    $("#skills,#job,#education").empty();
                                    renderResume(logstate);
                                });
                            }
                            
                    };
                    crossbtn.onclick = function (e) {
                        e.preventDefault();
                            model.deleteEducation(data._id, function(err) {
                                if (err) return console.log(err);
                                $("#skills,#job,#education").empty();
                                renderResume(logstate);
                            });
                    };
                }
                else {
                    doc.innerHTML = `${data.details}`;
                }
                break;

            case "skills":
                var container = document.getElementById('skills');
                if (admin) {
                    doc.innerHTML = `<div class="col-lg-11 subtext row">
    <textarea rows="5" name="details" id='${data._id}' class="col-lg-12 form-control form_element" placeholder="Details">${data.details}</textarea>
</div>`;
                    checkbtn.onclick = function (e) {
                        e.preventDefault();
                            var info = {};
                            info.details = document.getElementById(data._id).value;
                            info._id = data._id;
                            if (info.details) {
                                model.updateSkills(info, function(err) {
                                    if (err) return console.log(err);
                                });
                                $("#skills,#job,#education").empty();
                                renderResume(logstate);
                            }
                    };
                    crossbtn.onclick = function (e) {
                        e.preventDefault();
                            model.deleteSkills(data._id, function(err) {
                                if (err) return console.log(err);
                                $("#skills,#job,#education").empty();
                                renderResume(logstate);
                            });
                    };
                }
                else {
                    doc.innerHTML = `${data.details}`;
                }
                break;

            case "experience":
                var container = document.getElementById('job');
                if (admin) {
                    var dateid = data._id + "_date";
                    var employerid = data._id + "_employer";
                    var placeid = data._id + "_place";
                    var detailsid = data._id + "_details";
                    doc.innerHTML = `<div class="col-lg-11 subtext row">
    <input type="text" name="date" id='${dateid}' class="col-lg-4 form-control form-group form_element" placeholder="Date" value='${data.date}'/>
    <input type="text" name="employer" id='${employerid}' class="col-lg-4 form-control form-group form_element" placeholder="Employer" value='${data.employer}'/>
    <input type="text" name="place" id='${placeid}' class="col-lg-4 form-control form-group form_element" placeholder="Place" value='${data.place}'/>
    <textarea rows="5" name="details" id='${detailsid}' class="col-lg-12 form-control form_element" placeholder="Details">${data.details}</textarea>
</div>`;
                    checkbtn.onclick = function (e) {
                        e.preventDefault();
                            var info = {};
                            info.date = document.getElementById(dateid).value;
                            info.employer = document.getElementById(employerid).value;
                            info.place = document.getElementById(placeid).value;
                            info.details = document.getElementById(detailsid).value;
                            info._id = data._id;
                            if (info.date && info.employer && info.place && info.details) {
                                model.updateExperience(info, function(err) {
                                    if (err) return console.log(err);
                                    $("#skills,#job,#education").empty();
                                    renderResume(logstate);
                                });
                            }
                    };
                    crossbtn.onclick = function (e) {
                        e.preventDefault();
                            model.deleteExperience(data._id, function(err) {
                                if (err) return console.log(err);
                                $("#skills,#job,#education").empty();
                                renderResume(logstate);
                            });
                    };
                }
                else {
                    doc.innerHTML = `<div class="col-lg-12 row experience_head">
    <div class="col-lg-4">
    ${data.date}
</div>
    <div class="col-lg-4">
    ${data.employer}
</div>
    <div class="col-lg-4">
    ${data.place}
</div>
</div>
<div class="col-lg-12 row experience_body">
    ${data.details}
</div>`;
                }
                break;

        };
        doc.className = "col-lg-12 subtext row";
        if (admin) {
            var inner = document.createElement('div');
            inner.className = "row align-items-center mainrow";
            btnholder.append(checkbtn);
            btnholder.append(crossbtn);
            doc.append(btnholder);
            inner.append(doc);
            container.prepend(inner);
        }
        else {
            container.prepend(doc);
        }
    };

    var renderResume = function (state) {
        if (state === "true") {
            renderBox("education");
            renderBox("skills");
            renderBox("experience");
            model.getExperience(function (err, data) {
                if (err) return console.log(err);
                for (var i = 0; i < data.length; i ++) {
                    renderInfo("experience", data[i], true);
                }
            });
            model.getEducation(function (err, data) {
                if (err) return console.log(err);
                for (var i = 0; i < data.length; i ++) {
                    renderInfo("education", data[i], true);
                }
            });
            model.getSkills(function (err, data) {
                if (err) return console.log(err);
                for (var i = 0; i < data.length; i ++) {
                    renderInfo("skills", data[i], true);
                }
            });
        }
        else {
            model.getExperience(function (err, data) {
                if (err) return console.log(err);
                for (var i = 0; i < data.length; i ++) {
                    renderInfo("experience", data[i], null);
                }
            });
            model.getEducation(function (err, data) {
                if (err) return console.log(err);
                for (var i = 0; i < data.length; i ++) {
                    renderInfo("education", data[i], null);
                }
            });
            model.getSkills(function (err, data) {
                if (err) return console.log(err);
                for (var i = 0; i < data.length; i ++) {
                    renderInfo("skills", data[i], null);
                }
            });
        }
    };
    
    return view;
    
}());