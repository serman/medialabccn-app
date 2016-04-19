/*run in renderer */

//variables que se usan en todo el archivo

/* ejemplo Archivo
 playlistFilePath = /Users/sergiogalan/Proyectos/medialabCCN/medialabccn-app/external/ccn/ccn.json
folderPath = /Users/sergiogalan/Proyectos/medialabCCN/medialabccn-app/external/ccn/
current_project_data= contenido de /Users/sergiogalan/Proyectos/medialabCCN/medialabccn-app/external/ccn/archivo/archivo.json
 /Users/sergiogalan/Proyectos/medialabCCN/medialabccn-app/external/ccn/archivo/
 */

var cfg={}
cfg.playlistDays=[]
cfg.playlistFile=""// ruta archivo .json con la playlist

cfg.folderPath="" //carpeta contenedora del archivo.json con las playlists

//cfg.playlistContentFolder="" //carpeta donde están el resto de

cfg.current_project_data={}; //contanido del proyecto.json actual

cfg.simpleplayList = true;

cfg.proyectos_local=[ //volcado del archivo en cfg.playlistFilePath
 /* {'nombre':'tes','tipo':'web','url':'tes.html', 'duracion':5*1000},
  {'nombre':'otro','tipo':'external','url':'pixelVisualizer.html','duracion':15*1000},
  {'nombre':'skate','tipo':'web','url':'skate.html', 'duracion':10*1000},*/  
];


var runtimeState={}
runtimeState.currentTextTimeout=null; //temporizador que controla momento en el que el texto termina
runtimeState.imageSlideIndex=1; //si es un player de imagenes esta es la actual;
runtimeState.imageSlideTimeout=null;//si es un player de imagenes este es el timeout del control de tiempo;
runtimeState.current_project_index=0;
runtimeState.current_project_folder=""
runtimeState.firstTime=false;


/************************** fin variables *********/

//first time ever start "settings database"
function initSettings(){
  if(localStorage.getItem("simpleplayList")===null){
    runtimeState.firstTime=true;
    localStorage.setItem("simpleplayList", true);

  }

  if(localStorage.getItem("singleFile")===null)
    localStorage.setItem("singleFile", ""); //nombre del archivo playlist .json
  if(localStorage.getItem("multipleFiles")===null)
    localStorage.setItem("multipleFiles", JSON.stringify(["","","","","","",""]) ); //nombre del archivo playlist .json
  /*if(localStorage.getItem("singleFileFolderPath")===null) //nombre de la carpeta donde estan los demás archivos
    localStorage.setItem("singleFileFolderPath", ""); */
  if(localStorage.getItem("random")===null)
    localStorage.setItem("random", false); 
}

function emptySettings(){
  
    localStorage.removeItem("simpleplayList");  
    localStorage.removeItem("singleFile"); //nombre del archivo playlist .json
    localStorage.removeItem("multipleFiles"); //nombre del archivo playlist .json
  /*if(localStorage.getItem("singleFileFolderPath")===null) //nombre de la carpeta donde estan los demás archivos
    localStorage.setItem("singleFileFolderPath", ""); */
    localStorage.removeItem("random"); 
}

function init(){
   loadSettings()
  var remote = require('remote');
  //1º cargo lista actual
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
    runtimeState.current_project_index=message
    loadNewContent(runtimeState.current_project_index);
  });  
}


/*

*/
function loadSettings(){
//1 get all settings stored in database and put it in the right variables
  cfg.simpleplayList= localStorage.getItem("simpleplayList")=="true"?true:false;
  //1º comprobamos entrada de datos
  var remote = require('remote');
   var jsonFileCMDline= remote.getCurrentWindow().cmdParameterJSONFile;
    if(!(jsonFileCMDline===undefined)){
        //en lugar de cargar single file
          loadPlaylistFile(jsonFileCMDline)
    }
    else{ //NO se ha pasado el archivo por la linea de comandos
      populatePlaylistSection(true);    
    }    
}

/*
Obtiene la playlist del dia o la playlist unica desde localstorage y 
la carga con loadPlaylistFile. Muestra el bloque de playlist unica o playlist semanal
*/
function populatePlaylistSection(loadPlaylist){
  if(cfg.simpleplayList==true){
    cfg.playlistFile=localStorage.getItem("singleFile");
      if(loadPlaylist){        
        loadPlaylistFile(cfg.playlistFile);
      }
    }else{ //UNA PLAYLIST PARA CADA DIA
      var d = new Date();
      var n = d.getDay();
      if(n==0) n=7;  n--;// Sunday is 0, Monday is 1, and so on: I change it to monday==0
     
      cfg.playlistDays = JSON.parse(localStorage.getItem("multipleFiles"));
      cfg.playlistFile=cfg.playlistDays[n];
      if(loadPlaylist){        
        loadPlaylistFile(cfg.playlistFile);
      }
    }

  if(cfg.simpleplayList==true){
    $('#panel-days-playlist').prop('checked', false);
    $('#single-playlist-panel').fadeIn()
    $('#multiple-playlist-panel').fadeOut() 
    $('#single-playlist-panel .filename').text(cfg.playlistFile.split(/(\\|\/)/g).pop())
  }else{
    $('#panel-days-playlist').prop('checked', true);
    $('#single-playlist-panel').fadeOut()
    $('#multiple-playlist-panel').fadeIn() 
    $('#multiple-playlist-panel .filename').each(function( index ) {
      $(this).text(cfg.playlistDays[index].split(/(\\|\/)/g).pop())
      var d = new Date();
      var n = d.getDay();
      if(n==0) n=7;  n--;// Sunday is 0, Monday is 1, and so on: I change it to monday==0
      if(n==index)
        $(this).addClass('active')
    });
  }
}


function loadPlaylistFile(path){
  //if(runtimeState.firstTime==true && path=="") return; // si aun no se ha cargado playlist pq es la primera vez salimos sin mostrar errores
      $('#playlist-name').empty().html(path)
      try{
        var localfile=require(path);   
      }catch(err){
        alert("Playlist file not found or is not correct. \n  Path: "+path+"\n  Error:\n " + err );
        return;
      }
      preprocessPlaylist(localfile.playlist)
      populateHtmlPlaylist(localfile.playlist)
      //checkPlaylist(localFile) TODO
      cfg.proyectos_local=localfile.playlist;
      cfg.playlistContentFolder=localfile.folder;
      //project_folder=localfile.playlist;
      p=require('path')
      cfg.folderPath=p.dirname(path);      
      return localfile.playlist;
}

function preprocessPlaylist(listObject){


}

/*rellena playlist */
function populateHtmlPlaylist(listObject){
     $('#projects-wrapper').empty()
     $.each(listObject,function(index,value){
        $('#projects-wrapper').append('<li> \
                     <a href="#" data-index="'+index+'"+class="'+value.tipo+
                     ' prj-link" data-name="'+value.url+'"> <span class="name">'+
                     value.url+'</span>' +  '<span class="tipo">'+value.tipo+'</span>' +
                     '<span class="duracion">'+value.duracion+'</span>'+ '</a> </li>');
      });
}






$(function() {  
  emptySettings();
  initSettings();
  init();
  /*listener*/
  

  $('#play').on('click', function(event){
    play();
  });

  $('#stop').on('click', function(event){
    stop();
  });

  $('#pause').on('click', function(event){
    pause();
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

  $('#projects-wrapper').on('click','a', function(event){
      event.preventDefault();
    //  console.log('file://' + __dirname +"/"+ $(this).attr('href'))
     // loadNewContent('file://' + __dirname +"/"+ $(this).attr('href'));
     var indx=$(this).data("index")
     stop();
     var remote = require('remote');
     var tempo=remote.require('./timers.js');
     tempo.goto(indx);
  });
  

   


});

/*function loadNewContent(project_index){
    var murl=folderPath+"/projects/"+cfg.proyectos_local[project_index].url;
    console.log(murl);
    current_project=require(murl);
    loadNewContent(current_project,cfg.proyectos_local[project_index]);
}*/

/* loadNewContent 
  load a project.json file and play its content
*/
function loadNewContent(project_index){
  //carga json del proyecto
  runtimeState.current_project_folder=cfg.proyectos_local[project_index].url
  var murl=cfg.folderPath+"/"+runtimeState.current_project_folder+"/"+runtimeState.current_project_folder+".json";

  console.log("loadNewContent: " + murl);
  try {
    current_project=require(murl);
  }
  catch(err) {
      alert("Problem loading new resource file:\n " +murl+ " \n Error \n " + err );
      return;
  }
  clearTimeout(runtimeState.imageSlideTimeout);//porsiacaso

  var jsonProjectFile=current_project
  var projectInfo=cfg.proyectos_local[project_index]
  var type=projectInfo.tipo
  //carga texto
  $('#proyecto-actual').empty().html(jsonProjectFile.fulltitle)
  $('#projects-wrapper li.current').removeClass("current")
  $('#projects-wrapper li:eq('+project_index+')').addClass("current")
  $( "#content-container #text-container div#text-body" ).empty().html(jsonProjectFile.text ) 
  $("#content-container #text-container div#text-head1").empty().html(jsonProjectFile.year)
  $("#content-container #text-container #text-head2 div.ticker__item").empty().html(jsonProjectFile.fulltitle)
  console.log("json author"+jsonProjectFile.fulltitle)

//////////TEXTILATE OPTIONS  ///////
  if(typeof jsonProjectFile.options === "undefined" )
    $( "#content-container #text-container div#text-body" ).textillate({ in: { effect: 'rollIn' } });
  else
    $( "#content-container #text-container div#text-body" ).textillate(jsonProjectFile.options);

  
    $(".content-inner-container").fadeOut();
    $("#text-container").fadeIn();

  if(type=="video"){    
    //carga video o app
      runtimeState.currentTextTimeout=setTimeout(function(){
        console.log("Es video")
        $('#sourceVideo').attr("src","file://"+ cfg.folderPath+"/"+runtimeState.current_project_folder+"/"+jsonProjectFile.resource);
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
      }, hmsToMilliSecondsOnly(jsonProjectFile.text_timeout));
  }else if(type=="imagen"){
        runtimeState.currentTextTimeout=setTimeout(function(){
        runtimeState.imageSlideIndex=1;
        
        if(jsonProjectFile.fullfacade==true){
          $('#img-container').css('top','40px');
          $('#img-container').css('height','157px');
        }
        else{
          $('#img-container').css('top','72px');
          $('#img-container').css('height','125px');
        }
        playImages();
        $("#text-container").fadeOut();
        $('#img-container').fadeIn();
      }, hmsToMilliSecondsOnly(jsonProjectFile.text_timeout));
  }
  else if(type=="app"){
      runtimeState.currentTextTimeout=setTimeout(function(){
        var exec = require("child_process").exec, child;
        child=exec('open '+ cfg.folderPath +"/"+runtimeState.current_project_folder+"/"+jsonProjectFile.resource,
        function (error, stdout, stderr) {}
        )
      }, hmsToMilliSecondsOnly(jsonProjectFile.text_timeout));
  }
}



function play(){
  event.preventDefault();
    var remote = require('remote');
    var tempo=remote.require('./timers.js');
    tempo.start();
}
function stop(){
  var index=runtimeState.current_project_index;
  var type=cfg.proyectos_local[index].tipo;

  event.preventDefault();
    var remote = require('remote');
    var tempo=remote.require('./timers.js');
    tempo.stop();
    clearTimeout(runtimeState.currentTextTimeout)
    if(type=="video"){ 
      $('#content-video').get(0).pause()
      $("#text-container").fadeOut();
      $('#content-video').fadeOut();
    }
    else if(type=="imagen"){ 
      clearTimeout(runtimeState.imageSlideTimeout)
      $("#text-container").fadeOut();
      $('#img-container').fadeOut();
    }
    else if(type=="app"){ 
      //TODO
    }
}

function pause(){
/*Detiene el temporizador de proyectos pero deja el proyecto actual y continua después al pulsar play si se ha pulsado pause antes*/
//pause
}

function hmsToMilliSecondsOnly(str) {
    str=str.toString();
    if(str.length==1){
      str="0"+str;
    }
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s*1000;
}

function playImages(){
  var jsonProjectFile=current_project;
  var _url="file://"+ cfg.folderPath+"/"+runtimeState.current_project_folder+"/"+jsonProjectFile.resource+"/";
  var imgname=runtimeState.imageSlideIndex.toString();

  if(imgname.length==1){
      imgname="0"+imgname;
    }
  console.log(_url+jsonProjectFile.prefix+imgname+jsonProjectFile.extension)
  $('#img-container').attr('src',_url+jsonProjectFile.prefix+imgname+"."+jsonProjectFile.extension)
  runtimeState.imageSlideIndex++;
  runtimeState.imageSlideTimeout=setTimeout(playImages,jsonProjectFile.comic_timeout*1000);

}