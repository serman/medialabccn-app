/*run in renderer */

//variables que se usan en todo el archivo
var cfg={}
cfg.playlistFilePath=""; // ruta archivo .json con la playlist
cfg.folderPath="" //carpeta del archivo.json de la playlis
cfg.playlistContentFolder="" //carpeta donde están el resto de
cfg.current_project_data={}; //contanido del proyecto.json actual
cfg.current_project_index=0;
cfg.proyectos_local=[ //volcado del archivo en cfg.playlistFilePath
 /* {'nombre':'tes','tipo':'web','url':'tes.html', 'duracion':5*1000},
  {'nombre':'otro','tipo':'external','url':'pixelVisualizer.html','duracion':15*1000},
  {'nombre':'skate','tipo':'web','url':'skate.html', 'duracion':10*1000},*/
];

$(function() {  
  initSettings();
  init();
  /*listener*/
  

  $('#play').on('click', function(event){
    play();
  });

  $('#stop').on('click', function(event){
    stop();
  });

  

  $(".app").on('click',function(event){
        event.preventDefault();
  /*      console.log("tiriri click external");
        var remote = require('remote');
        var exec = require("child_process").exec, child;
        child=exec('open /Users/sergiogalan/Proyectos/medialabCCN/medialabccn-app/web/projects/apps/pixelVisualizer.app',
          function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
              console.log('exec error: ' + error);
            }
        });*/
  });

  $('.prj-link').on('click', function(event){
    event.preventDefault();
  //  console.log('file://' + __dirname +"/"+ $(this).attr('href'))
   // loadNewContent('file://' + __dirname +"/"+ $(this).attr('href'));

  });
  $('.prj-link').on('click', function(event){
    event.preventDefault();
  //  console.log('file://' + __dirname +"/"+ $(this).attr('href'))
   // loadNewContent('file://' + __dirname +"/"+ $(this).attr('href'));
  });
  
   $('#singleFile').on('change' , function(e) { 
     /* file1=$(this)[0].files[0];
      cfg.playlistFilePath=file1.path;      */
      
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
    var murl=folderPath+"/projects/"+cfg.proyectos_local[project_index].url;
    console.log(murl);
    current_project=require(murl);
    loadNewContent(current_project,cfg.proyectos_local[project_index]);
}*/
function loadNewContent(project_index){
  var murl=cfg.folderPath+"/"+cfg.playlistContentFolder+"/"+cfg.proyectos_local[project_index].url;
  console.log("loadNewContent: " + murl);
  try {
    current_project=require(murl);
  }
  catch(err) {
    console.log("File not found" + err)
      return;
  }
  var jsonProjectFile=current_project
  var projectInfo=cfg.proyectos_local[project_index]
  var type=projectInfo.tipo
  //carga texto
  $('#proyecto-actual').empty().html(projectInfo.nombre)
  $( "#content-container #text-container div" ).empty().html(jsonProjectFile.text ) 


//////////TEXTILATE OPTIONS  ///////
  if(typeof jsonProjectFile.options === "undefined" )
    $( "#content-container #text-container div" ).textillate({ in: { effect: 'rollIn' } });
  else
    $( "#content-container #text-container div" ).textillate(jsonProjectFile.options);

  $("#text-container").fadeIn();

  if(type=="video"){    
    //carga video o app
      setTimeout(function(){
        console.log("Es video")
        $('#sourceVideo').attr("src","file://"+ cfg.folderPath+"/"+cfg.playlistContentFolder+"/resources/"+jsonProjectFile.resource);
        if(jsonProjectFile.fullfacade==true){
          $('.videoproyecto').css('top','40px');
          $('.videoproyecto').css('height','157px');
        }
        else{
          $('.videoproyecto').css('top','72px');
          $('.videoproyecto').css('height','125px');
        }
        $('#content-video').get(0).load()
        $('#content-video').get(0).play()
        $("#text-container").fadeOut();
        $('#content-video').fadeIn();
      }, jsonProjectFile.text_timeout);
  }else if(type=="app"){
      setTimeout(function(){
        var exec = require("child_process").exec, child;
        child=exec('open '+ cfg.folderPath +"/"+cfg.playlistContentFolder+"/resources/"+jsonProjectFile.resource,
        function (error, stdout, stderr) {}
        )
      }, jsonProjectFile.text_timeout);
  }
}

function saveFileSettings(){
        localStorage.setItem("singleFile", cfg.playlistFilePath);
        p=require('path');
        cfg.folderPath=p.dirname(cfg.playlistFilePath);
        localStorage.setItem("singleFileFolderPath", cfg.folderPath);
}

function loadPlaylistFile(path){
      $('#playlist-name').empty().html(path)
      try{
        var localfile=require(path);   
      }catch(err){
        console.log("playlist File not found");
        return;
      }
      reloadPlaylist(localfile.playlist)
      //checkPlaylist(localFile) TODO
      cfg.proyectos_local=localfile.playlist;
      cfg.playlistContentFolder=localfile.folder;
      projecy_folder=localfile.playlist;
      cfg.playlistFilePath=path;
      p=require('path')
      cfg.folderPath=p.dirname(path);      
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
   //1.1º por si acaso vengo de un reload de la ventana, paro el timer
  var tempo=remote.require('./timers.js');
  tempo.stop();

  var util=remote.require('./util.js');
   //envio lista de proyectos al hilo principal
  util.setProyectList(cfg.proyectos_local)

  var ipc =  require("electron").ipcRenderer;

//on each "update web msg" coming from the timer.js:
  ipc.on('updateWeb', function(event,message) { 
    //loadNewContent('file://' + __dirname +"/projects/"+ message);
    console.log(message)

    var path= localStorage.getItem("singleFileFolderPath")
    cfg.current_project_index=message
    loadNewContent(cfg.current_project_index);
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

function play(){
  event.preventDefault();
    var remote = require('remote');
    var tempo=remote.require('./timers.js');
    tempo.start();
}
function stop(){
  event.preventDefault();
    var remote = require('remote');
    var tempo=remote.require('./timers.js');
    tempo.stop();
}