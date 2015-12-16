/*run in renderer */

//variables que se usan en todo el archivo
var folderPath, playlistFilePath=""; //actual carpeta de trabajo y ruta archivo .json con la playlist
var current_project_data={}; //contanido del proyecto.json actual
var current_project_index=0;
var proyectos_local=[ //volcado del archivo en playlistFilePath
 /* {'nombre':'tes','tipo':'web','url':'tes.html', 'duracion':5*1000},
  {'nombre':'otro','tipo':'external','url':'pixelVisualizer.html','duracion':15*1000},
  {'nombre':'skate','tipo':'web','url':'skate.html', 'duracion':10*1000},*/
];

$(function() {  
  initSettings();
  init();
  /*listener*/
  

  $('#play').on('click', function(event){
    event.preventDefault();
    var remote = require('remote');
    var tempo=remote.require('./timers.js');
    tempo.start();
  });

  $('#stop').on('click', function(event){
    event.preventDefault();
    var remote = require('remote');
    var tempo=remote.require('./timers.js');
    tempo.stop();
  });

  /*

  $(".app").on('click',function(event){
        event.preventDefault();
        console.log("tiriri click external");
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

  $('.prj-link').on('click', function(event){
    event.preventDefault();
  //  console.log('file://' + __dirname +"/"+ $(this).attr('href'))
    loadNewContent('file://' + __dirname +"/"+ $(this).attr('href'));

  });
  $('.prj-link').on('click', function(event){
    event.preventDefault();
  //  console.log('file://' + __dirname +"/"+ $(this).attr('href'))
    loadNewContent('file://' + __dirname +"/"+ $(this).attr('href'));*/

  
   $('#singleFile').on('change' , function(e) { 
     /* file1=$(this)[0].files[0];
      playlistFilePath=file1.path;      */
      
    });
   
   $('#loadFile').on('click', function(event){
      var file1=$('#singleFile')[0].files[0]; //comando para cargar ruta completa:
      if(typeof file1 === "undefined"){

      }else{//si he seleccionado nuevo archivo lo cargo
        console.log("loading..." + file1)        
        loadPlaylistFile(file1.path);
        saveFileSettings();
      }
    });
});

/*function loadNewContent(project_index){
    var murl=folderPath+"/projects/"+proyectos_local[project_index].url;
    console.log(murl);
    current_project=require(murl);
    loadNewContent(current_project,proyectos_local[project_index]);
}*/
function loadNewContent(project_index){
  var murl=folderPath+"/projects/"+proyectos_local[project_index].url;
  console.log("loadNewContent: " + murl);
  current_project=require(murl);
  var jsonProjectFile=current_project
  var projectInfo=proyectos_local[project_index]
  var type=projectInfo.tipo
  $('#proyecto-actual').empty().html(projectInfo.nombre)
  $( "#content-container .text-container div" ).empty().html(jsonProjectFile.text ) 
  $( "#previo").show();
  if(type=="video"){    
      setTimeout(function(){
        console.log("Es video")
        $('#sourceVideo').attr("src","file://"+ folderPath+"/projects/resources/"+jsonProjectFile.resource);
        $('#content-video').get(0).load()
        $('#content-video').get(0).play()
        $("#previo").hide();
        $('#content-video').show();
      }, jsonProjectFile.text_timeout);
  }else if(type=="app"){
      setTimeout(function(){
        var exec = require("child_process").exec, child;
        child=exec('open '+ folderPath + "/projects/resources/"+jsonProjectFile.resource,
        function (error, stdout, stderr) {}
        )
      }, jsonProjectFile.text_timeout);
  }
}

function saveFileSettings(){
        localStorage.setItem("singleFile", playlistFilePath);
        p=require('path');
        folderPath=p.dirname(playlistFilePath);
        localStorage.setItem("singleFileFolderPath", folderPath);
}

function loadPlaylistFile(path){
      $('#playlist-name').empty().html(path)
      var localfile=require(path);   
      reloadPlaylist(localfile.playlist)
      //checkPlaylist(localFile) TODO
      proyectos_local=localfile.playlist;
      playlistFilePath=path;
      p=require('path')
      folderPath=p.dirname(path);
      return localfile.playlist;
}

function reloadPlaylist(listObject){

     $('#projects-wrapper').empty()
     $.each(listObject,function(index,value){
        $('#projects-wrapper').append('<li> \
                     <a href="projects/'+value.url+'" class="'+value.tipo+' prj-link" data-name="'+value.url+'"> <span class="name">'+value.nombre+'</span>' +  '<span class="tipo">'+value.tipo+'</span>' +  '<span class="duracion">'+Math.round(value.duracion/1000)+'</span>'+ '</a> </li>');
      });
}

function init(){
  //1º cargo lista actual
  loadPlaylistFile(localStorage.getItem("singleFile"))
  var remote = require('remote');
  var util=remote.require('./util.js');
   //envio lista de proyectos al hilo principal
  util.setProyectList(proyectos_local)

  var ipc =  require("electron").ipcRenderer;
  ipc.on('updateWeb', function(event,message) {
    //loadNewContent('file://' + __dirname +"/projects/"+ message);
    console.log(message)

    var path= localStorage.getItem("singleFileFolderPath")
    current_project_index=message
    loadNewContent(current_project_index);
  });  
}

//first time 
function initSettings(){
  if(localStorage.getItem("simpleplayList")===null)
    localStorage.setItem("simpleplayList", true);
  if(localStorage.getItem("singleFile")===null)
    localStorage.setItem("singleFile", "");
  if(localStorage.getItem("singleFileFolderPath")===null)
    localStorage.setItem("singleFileFolderPath", "");
  if(localStorage.getItem("random")===null)
    localStorage.setItem("random", false);
  
  
}
