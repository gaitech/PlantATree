/**


Copyright (c) 2014 torrmal:Jorge Torres, jorge-at-turned.mobi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/


try{
  var tmp = LocalFileSystem.PERSISTENT;
  var tmp = null;
}
catch(e){

  var LocalFileSystem= {PERSISTENT : window.PERSISTENT,
    TEMPORARY: window.TEMPORARY};
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

  }

  var DirManager = function(){

   this.cache = {};

   var current_object = this;
  // recursive create

  this.get_home_path = function(callback) {
    fileSystemSingleton.load(
      function(fileSystem){
        callback(fileSystem.root.nativeURL);
      });
  };

  this.create_r =function(path, callback, fail, position, customfilesystem)
  {
    position = (typeof position == 'undefined')? 0: position;
    var path_split    = path.split('/');
    var new_position  = position+1;

    var sub_path    = path_split.slice(0,new_position).join('/');
   console.log(sub_path);
    Log('DirManager','mesg')('path:'+sub_path,'DirManager');

    var inner_callback = function(obj){
      console.log(obj);
      return function(){
        Log('DirManager','mesg')('inner_callback:'+path);

        obj.create_r(path, callback, fail, new_position, customfilesystem);
      }
    }

    if(new_position == path_split.length){
      this.create(sub_path, callback, fail, customfilesystem);

    }
    else
    {
      this.create(sub_path, inner_callback(this), fail, customfilesystem);

    }

  };

  this.list = function(path, success, fail){

    fail = (typeof fail == 'undefined')? Log('DirManager','crete fail'): fail;

    var template_callback = function(success){
      return  function(entries) {
       var i;
       var ret = [];

       limit=entries.length;
       for (i=0; i<limit; i++) {
                  //console.log(entries[i].name);
                  ret.push(entries[i].name);

               }
              // console.log('LIST: '+ret);
              success(ret);
            }
          }

          if(current_object.cache[path]){

           current_object.cache[path].readEntries(
            template_callback(success)
            );
           return;
         }

         fileSystemSingleton.load(
           function(fileSystem){
            var entry=fileSystem.root;

            entry.getDirectory(path,

             {create: true, exclusive: false},
             function(entry){
              var directoryReader = entry.createReader();
              current_object.cache[path] = directoryReader;
              directoryReader.readEntries(
                template_callback(success)
                );
            },
            function(err){
              current_object.create_r(path,function(){success([]);},fail);
              Log('DirManager','crete fail')('error creating directory');
                //fail(err);
              }
              );
          }
        );
       }

       this.create = function(path, callback, fail, customfilesystem){
        fail = (typeof fail == 'undefined')? Log('DirManager','crete fail'): fail;
        if( typeof customfilesystem !== 'undefined') {
          storingDir = cordovaFS(customfilesystem);
          alert(storingDir);
          console.log(storingDir);
          window.resolveLocalFileSystemURL(storingDir,  function(dir) {
            var entry = dir;
               dir.getDirectory(path,
                {create: true, exclusive: false},
                  function(dir){
                  Log('FileSystem','msg')('Directory created successfuly');
                },
              function(err){
               Log('DirManager','crete fail')('error creating directory');
                fail(err);
              });
             });
          } else {
          fileSystemSingleton.load(
           function(fileSystem){
            var entry=fileSystem.root;

            entry.getDirectory(path,
             {create: true, exclusive: false},
             function(entry){
              Log('FileSystem','msg')('Directory created successfuly');
              callback(entry);
            },
            function(err){
              Log('DirManager','crete fail')('error creating directory');
              fail(err);
            });
          });
        }
      };
      this.remove = function(path, success, fail){
        fail = (typeof fail == 'undefined')? Log('DirManager','crete fail'): fail;
        success = (typeof success == 'undefined')? Log('DirManager','crete fail'): success;
        //console.log(current_object.cache);
        delete current_object.cache[path];
        //console.log(current_object.cache);
        this.create(
          path,
          function(entry){
            entry.removeRecursively(success, fail);
          });
      }
};

var Log = function(bucket, tag){
  return function(message){
    if(typeof bucket != 'undefined')
    {
      console.log(' '+bucket+':');
    }
    if(typeof tag != 'undefined')
    {
      console.log(' '+tag+':');
    }
    if(typeof message != 'object'){
      console.log('       '+message);
    }
    else
    {
      console.log(message);
    }
  };
}


var fileSystemSingleton = {
  fileSystem: false,

  load : function(callback, fail){
    fail = (typeof fail == 'undefined')? Log('FileSystem','load fail'): fail;
    if(fileSystemSingleton.fileSystem){
      callback(fileSystemSingleton.fileSystem);
      return;
    }

    if(!window.requestFileSystem){
      return fail();
    }

    window.requestFileSystem(
      LocalFileSystem.PERSISTENT,
      0,
      function(fileSystem){
        fileSystemSingleton.fileSystem = fileSystem;
        callback(fileSystemSingleton.fileSystem);
      },
      function(err){
        Log('FileSystem','load fail')('error loading file system');
        fail(err);
      }
    );
  }
};

var Log = function(bucket, tag){
  return function(message){
    if(typeof bucket != 'undefined')
    {
      console.log(' '+bucket+':');
    }
    if(typeof tag != 'undefined')
    {
      console.log(' '+tag+':');
    }
    if(typeof message != 'object'){
      console.log('       '+message);
    }
    else
    {
      console.log(message);
    }
  };
}


var fileSystemSingleton = {
  fileSystem: false,

  load : function(callback, fail){
    fail = (typeof fail == 'undefined')? Log('FileSystem','load fail'): fail;
    if(fileSystemSingleton.fileSystem){
      callback(fileSystemSingleton.fileSystem);
      return;
    }

    if(!window.requestFileSystem){
      return fail();
    }
    window.requestFileSystem(
      LocalFileSystem.PERSISTENT,
      0,
      function(fileSystem){
        fileSystemSingleton.fileSystem = fileSystem;
        callback(fileSystemSingleton.fileSystem);
      },
      function(err){
        Log('FileSystem','load fail')('error loading file system');
        fail(err);
      }
    );
  }
};

var FileManager = function(){
  this.get_path = function(todir,tofilename, success){
    fail = (typeof fail == 'undefined')? Log('FileManager','read file fail'): fail;
    this.load_file(
      todir,
      tofilename,
      function(fileEntry){

       var sPath = fileEntry.toURL();


       success(sPath);
     },
     Log('fail')
    );
  }

  this.fileList = function (dirName) {
    fileSystemSingleton.load(
      function(fileSystem){
        fileSystem.root.getDirectory(dirName, {
          create: true
        },
        function(directory) {
          var directoryReader = directory.createReader();
          directoryReader.readEntries(function(entries) {
            var i;
            for (i=0; i<entries.length; i++) {
              console.log(entries[i].toInternalURL());
              //var txtfileUrl = entries[1].toUrl();
              //uploadTxtFile(txtfileUrl)
              //console.log(entries[i]);
           }
         },
         function (error) {
          alert(error.code);
        });
        });
      }
    );
  }

  this.load_file = function(dir, file, success, fail, dont_repeat){
    if(!dir || dir =='')
    {
     Log('error','msg')('No file should be created, without a folder, to prevent a mess');
     fail();
     return;
   }
   fail = (typeof fail == 'undefined')? Log('FileManager','load file fail'): fail;
   var full_file_path = dir+'/'+file;
   var object = this;
    // well, here it will be a bit of diharrea code,
    // but, this requires to be this chain of crap, thanks to phonegap file creation asynch stuff
    // get fileSystem
    fileSystemSingleton.load(
      function(fs){
        var dont_repeat_inner = dont_repeat;
        // get file handler
        console.log(fs.root);
        fs.root.getFile(
          full_file_path,
          {create: true, exclusive: false},
          success,

          function(error){

            if(dont_repeat == true){
              Log('FileManager','error')('recurring error, gettingout of here!');
              return;
            }
            // if target folder does not exist, create it
            if(error.code == 3){
              Log('FileManager','msg')('folder does not exist, creating it');
              var a = new DirManager();
              a.create_r(
               dir,
               function(){
                Log('FileManager','mesg')('trying to create the file again: '+file);
                object.load_file(dir,file,success,fail,true);
              },
              fail
              );
              return;
            }
            fail(error);
          }
        );
      }
    );
  };

  this.download_file = function(url, todir, tofilename, success, fail){

    fail = (typeof fail == 'undefined')? Log('FileManager','read file fail'): fail;
    this.load_file(
      todir,
      tofilename,
      function(fileEntry){

       var sPath = fileEntry.toURL();

       var fileTransfer = new FileTransfer();
       fileEntry.remove();

       fileTransfer.download(
        encodeURI(url),
        sPath,
        function(theFile) {
          console.log("download complete: " + theFile.toURI());
          success(theFile);
        },
        function(error) {
          console.log("download error source " + error.source);
          console.log("download error target " + error.target);
          console.log("upload error code: " + error.code);
          fail(error);
        });
     },
     fail
    );
  };
   //internal file system read
  this.read_file = function(dir, filename, success, fail){
    // console.log(dir);
    fail = (typeof fail == 'undefined')? Log('FileManager','read file fail'): fail;
    this.load_file(
      dir,
      filename,
      function(fileEntry){
        fileEntry.file(
          function(file){
            var reader = new FileReader();

            reader.onloadend = function(evt) {

              success(evt.target.result);
            };

            reader.readAsText(file);
          },
          fail
          );

      },
      fail
    );
  };
  //cordova file read
  this.readFile = function(path, filename, success, fail, customfilesystem) {
    fail = (typeof fail == 'undefined')? Log('FileManager','write file fail'): fail;
     var storingDir = cordovaFS(customfilesystem);
     window.resolveLocalFileSystemURL(storingDir, function(dir) {
       dir.getDirectory(path,
         {create: true, exclusive: false},
          function(file){
            file.getFile(filename, {create:true}, function(fileEntry) {
              fileEntry.file(
          function(file){
            var reader = new FileReader();

            reader.onloadend = function(evt) {

              success(evt.target.result);
            };

            reader.readAsText(file);
          },
          fail
          );
            });
            Log('FileSystem','msg')('Directory created successfuly');
          },
          function(err){
            Log('DirManager','crete fail')('error creating directory');
            fail(err);
          }
        );
      }
    );
  };
//filesyatem file write
  this.write_file = function(dir, filename, data, success, fail){
    fail = (typeof fail == 'undefined')? Log('FileManager','write file fail'): fail;
    this.load_file(
      dir,
      filename,
      function(fileEntry){
        fileEntry.createWriter(
          function(writer){
            Log('FileManager','mesg')('writing to file: '+filename);
            writer.onwriteend = function(evt){
              Log('FileManager','mesg')('file write success!');
              success(evt);
            }
            writer.write(data);
          },
          fail
          );
      },
      fail
    );
  };
  //cordova file write
  this.writeFile = function(path, filename, data, success, fail, customfilesystem) {
    fail = (typeof fail == 'undefined')? Log('FileManager','write file fail'): fail;
     var storingDir = cordovaFS(customfilesystem);
     window.resolveLocalFileSystemURL(storingDir, function(dir) {
       dir.getDirectory(path,
         {create: true, exclusive: false},
          function(file){
            file.getFile(filename, {create:true}, function(fileEntry) {
              fileEntry.createWriter(
                function(writer){
                  Log('FileManager','mesg')('writing to file: '+filename);
                  writer.onwriteend = function(evt){
                    Log('FileManager','mesg')('file write success!');
                    success(evt);
                  }
                  writer.write(data);
                },
                fail
              );
            });
            Log('FileSystem','msg')('Directory created successfuly');
          },
          function(err){
            Log('DirManager','crete fail')('error creating directory');
            fail(err);
          }
        );
      }
    );
  };
  this.remove_file = function(dir, filename, success, fail){
    var full_file_path = dir+'/'+filename;
    fileSystemSingleton.load(
      function(fs){

        // get file handler
        fs.root.getFile(full_file_path, {create: false, exclusive: false}, function(fileEntry){fileEntry.remove(success, fail);}, fail);
      }
    );
  };
  this.uploadFile = function(fileurl,type,serverpath) {
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=fileurl.substr(fileurl.lastIndexOf('/')+1);
    options.mimeType=type;

    var params = new Object();
    params.value1 = "";
    params.value2 = "";

    options.params = params;
    options.chunkedMode = false;

    var ft = new FileTransfer();
    ft.upload(fileurl, encodeURI(serverpath), win, fail, options);
  }

  function win(r) {
    console.log("Code = " + r.responseCode.toString()+"\n");
    console.log("Response = " + r.response.toString()+"\n");
    console.log("Sent = " + r.bytesSent.toString()+"\n");
    alert("Code Slayer!!!");
  }

  function fail(error) {
    alert("An error has occurred: Code = " + error.code);
  }
};

var ParallelAgregator = function(count, success, fail, bucket) {
  ////System.log('success: aggregator count:'+count);
  var success_results = [];
  var fail_results = [];
  var success_results_labeled = {};
  var ini_count = 0;
  var log_func= function(the_data){
    //console.log(the_data)
  }
  var object = this;
  current_bucket = (typeof bucket == 'undefined')? 'aggregator' : bucket;
  var success_callback =  (typeof success == 'undefined')? log_func : success;
  var fail_callback = (typeof fail == 'undefined')? log_func: fail;

  this.success = function(label){
    return function(result){
      //System.log('one aggregator success!',current_bucket);
      ini_count++;
      success_results.push(result);
      if(!success_results_labeled[label]){
        success_results_labeled[label] = [];
      }
      success_results_labeled[label].push(result);
      //System.log('success: aggregator count:'+ini_count,current_bucket);
      object.call_success_or_fail();
    }
  };

  this.call_success_or_fail = function(){
    if(ini_count == count){
      //System.log('aggregator complete',current_bucket);
      if(success_results.length == count)
      {
        //System.log('aggregator success',current_bucket);
        success_callback(success_results_labeled);
      }
      else{
        //System.log('aggregator fail',current_bucket);
        fail_callback({success:success_results,fail:fail_results});
      }
    }
  };

  this.fail = function(result){
    //System.log('one aggregator fail!',current_bucket);
    ini_count++;
    fail_results.push(result);
    //System.log('fail: aggregator count:'+ini_count, current_bucket);
    this.call_success_or_fail();
  }
}






// created object of all cordava FS
function cordovaFS(dirName) {
  switch(dirName) {
      case "AppDir":
          return cordova.file.applicationDirectory;
          break;

      case "AppStorageDir":
          return cordova.file.applicationStorageDirectory;
          break;

      case "CacheDir":
          return cordova.file.cacheDirectory;
          break;

      case "DataDir":
          return cordova.file.dataDirectory;
          break;

      case "DocumentsDir":
           return cordova.file.documentsDirectory;
          break;

      case "ExternalAppStorageDir":
           return cordova.file.externalApplicationStorageDirectory;
          break;

      case "ExternalCacheDir":
            return cordova.file.externalCacheDirectory;
          break;

       case "ExternalDataDir":
            return cordova.file.externalDataDirectory;
          break;

      case "ExternalRootDir":
            return cordova.file.externalRootDirectory;
          break;

      case "SharedDir":
            return cordova.file.sharedDirectory;
          break;

      case "SyncedDataDir":
            return cordova.file.syncedDataDirectory;
          break;

      case "TempDir":
            return cordova.file.tempDirectory;
          break;

      default:
          return cordova.file;
  }
}
