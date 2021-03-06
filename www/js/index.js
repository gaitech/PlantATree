/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var file = new FileManager();
 var dir = new DirManager();

 var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 2000);

        // debug
        app.CreateAppDir();
    },

    CreateAppDir: function()  {
       if (dir.dirExist('plantatree', 'ExternalAppStorageDir') == false)  {
           Log ("CreateAppDir: creating directory");
           dir.create('plantatree', Log('CreateAppDir: created successfully'), Log('CreateAppDir: something went wrong'), "ExternalAppStorageDir");
        } else {
            Log("CreateAppDir: dir exists, skipping create");
        }
    },

    // method to login into plant a tree
    Login: function () {
        var emailValue = document.getElementById("email").value;
        var emailId="testapp";
        url = "PlantATree.html";

        if(emailValue == emailId) {
            location.href = url;
        }
        else {
            alert("Please enter a valid email")
        }

    },
    // method for register into plant a tree
    RegisterMsg: function () {
        var msg = "Hi! Thanks for Registering.<br> Simply enter a unique name and email ID to store your Tree Planting Details. <br>"
        // window.plugins.toast.showLongTop("Welcome");
        Materialize.toast(msg);
    },

    Register: function()  {
        var arr = new Object();
        arr.name = document.getElementById("r_username").value
        arr.email = document.getElementById("r_email").value
        arr.dummy = 'dummy'

        if (file.fileExists('plantatree', 'registered_user.json'))
            Log ("file registered_user.json exists")
        else
            Log ("file registered_user.json does NOT exists")

        file.writeFile('plantatree', 'registered_user.json', JSON.stringify(arr), function(result) {
            alert(result);
        },Log("Register infor write error"), "ExternalAppStorageDir");
    },


    // method for saving tree information
    Save: function() {
        location.href = "TreeeProfile.html";
    },


    takePicture: function () {
        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URI });

        function onSuccess(imageURI) {
            var image = document.getElementById('myImage');
            var imageContainer = document.getElementById("c_container").style.display = "block";
            image.src = imageURI;
            image.style.height = '60px';
            image.style.width = '60px';
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    },

    pat_exit: function () {
        alert ("Exiting");
        if (navigator.app) {
            navigator.app.exitApp();
        } else if (navigator.device) {
            navigator.device.exitApp();
        } else {
            window.close();
        }
    },

    showDescription: function () {
        var test = document.getElementByTagName('select');
        conssole.log(test);
    }
};

app.initialize();
