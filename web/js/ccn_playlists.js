$(function() {  
/********* GUARDAR Y MANIPULAR PLAYLISTS ****/

/* Actualiza las gui cuando se carga un archivo nuevo*/
   $('#singleFile').on('change' , function(e) { 
      file1=$(this)[0].files[0];
      var fullpath=$(this).val()   
      $(this).parent().children('label').children('.filename').html(fullpath.split(/(\\|\/)/g).pop())
    });

   $(".multipleFile").change(function() {
      console.log("multiplefile select")
      var fullpath=$(this).val()   
      $(this).parent().children('label').children('.filename').html(fullpath.split(/(\\|\/)/g).pop())
    });
/*******/

//guarda archivo  en la configuración  

   $('#playlist-panel-save').on('click', function(event){
    console.log("saveing")
      if(cfg.simpleplayList){ //solo un archivo
        localStorage.setItem("simpleplayList", true);
        var file1=$('#singleFile')[0].files[0]; //comando para cargar ruta completa:

        if(typeof file1 === "undefined"){

        }else{//si he seleccionado nuevo archivo lo cargo
          console.log("saveFileSettings" + file1.path);        
          localStorage.setItem("singleFile", file1.path);

        }
      }else{ //un archivo por dia
        localStorage.setItem("simpleplayList", false);
        var archivos=[]
        $('.multipleFile').each(function( index ) {
          var file1=$(this)[0].files[0]
          if(typeof file1 === "undefined"){ // Si no hay nada nuevo dejolo que había
              archivos.push(cfg.playlistDays[index])
          }else{//si he seleccionado nuevo archivo lo cargo
              archivos.push(file1.path)
          }
        });
          localStorage.setItem("multipleFiles", JSON.stringify(archivos) ); //nombre del archivo playlist .json
      }
   });

/*
   $('#loadFile').on('click', function(event){
      var file1=$('#singleFile')[0].files[0]; //comando para cargar ruta completa:
      if(typeof file1 === "undefined"){

      }else{//si he seleccionado nuevo archivo lo cargo
        console.log("loading..." + file1)        
        loadPlaylistFile(file1.path);
      }
    }); */

      $('a.load-playlist-btn').on('click', function(event){
        console.log("nmbr" + $(this).data("number"))
        event.preventDefault();
        var indx=$(this).data("number");

        $('.multipleFile').each(function( index ) {
          if(index===indx){
            var file1=$(this)[0].files[0]
            console.log(file1)
            if(typeof file1 === "undefined"){ // Si no hay nada nuevo dejolo que había
               
            }else{//si he seleccionado nuevo archivo lo cargo
               cfg.playlistDays[indx]=file1.path
            }
          }
        });

        cfg.playlistFile=cfg.playlistDays[indx];      
        loadPlaylistFile(cfg.playlistFile);

        $('.filename.active').removeClass("active")
        $(this).parent().find('.filename').addClass("active");

        var remote = require('remote');
        var util=remote.require('./util.js');
        util.setProyectList(cfg.proyectos_local)
      });

      $('a.load-playlist-btn-single').on('click', function(event){   
        event.preventDefault();
        var f1=$('#singleFile')[0].files[0].path;
        cfg.playlistFile= f1;
        loadPlaylistFile(cfg.playlistFile);

        $('.filename.active').removeClass("active")
        $(this).parent().find('.filename').addClass("active");
          var remote = require('remote');
        var util=remote.require('./util.js');
        util.setProyectList(cfg.proyectos_local)
      });

/* muestra oculta panel multiples dias **/
    $('#panel-days-playlist') .on('change' , function(e) { 
    if($(this).is(':checked')){
      cfg.simpleplayList=false
    }else{
      cfg.simpleplayList=true
    }
    populatePlaylistSection(false);
  });


/********* FIN GUARDAR Y MANIPULAR PLAYLISTS ****/   

});

function saveFileSettings(){
        localStorage.setItem("singleFile", cfg.playlistFilePath);
        //p=require('path');
        //cfg.folderPath=p.dirname(cfg.playlistFilePath);
        //localStorage.setItem("singleFileFolderPath", cfg.folderPath);
}

