
$(function() {

  var ipc = require('ipc');
  ipc.on('updateWeb', function(message) {
    console.log(message);  // prints "ping"
    loadNewWeb('file://' + __dirname +"/projects/"+ message);
  });


  var projects=require('remote').getGlobal('proyectos');
  $.each(projects,function(index,value){
    $('#projects-wrapper').append('<li> <a href="projects/'+value.url+'" class="'+value.tipo+' prj-link" data-name="'+value.url+'">"'+value.nombre+'" </a> </li>')
  });

  $(".external").on('click',function(event){
                  event.preventDefault();
                  console.log("tiriri click external")
                  var remote = require('remote');
                  var exec = require("child_process").exec, child;
                  child=exec('open /Users/sergiogalan/Proyectos/medialabCCN/medialabccn-app/web/projects/apps/pixelVisualizer.app',
                  function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                      console.log('exec error: ' + error);
                    }
                  });

  });
  $('#play').on('click', function(event){
    event.preventDefault();
    var remote = require('remote');
    var tempo=remote.require('./timers.js')

    tempo.start();
  })
  $('#stop').on('click', function(event){
    event.preventDefault();
    var remote = require('remote');
    var tempo=remote.require('./timers.js')
    tempo.stop();
  })

  $('.prj-link').on('click', function(event){
    event.preventDefault();
  //  console.log('file://' + __dirname +"/"+ $(this).attr('href'))
    loadNewWeb('file://' + __dirname +"/"+ $(this).attr('href'));

  })

});

function loadNewWeb(murl){
  $( "#content-container" ).empty().load(murl,function() {
    //alert( "Load was performed." );
    loadNewContent();
  });
}
