$(function() {  
/********* GUARDAR Y MANIPULAR PLAYLISTS ****/
   $('#singleFile').on('change' , function(e) { 
     /* file1=$(this)[0].files[0];
      cfg.playlistFilePath=file1.path;      */      
    });

   $(".multipleFile").change(function() {
    console.log("multiplefile select")
      var fullpath=$(this).val()   
      $(this).parent().children('label').children('.filename').html(fullpath.split(/(\\|\/)/g).pop())
    });

//guarda archivo   

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
      }else{ //todos los archivos
        localStorage.setItem("simpleplayList", false);
        var archivos=[]
        $('.multipleFile').each(function( index ) {
          var file1=$(this)[0].files[0]
          if(typeof file1 === "undefined"){
              archivos.push(cfg.playlistDays[index])
          }else{//si he seleccionado nuevo archivo lo cargo
              archivos.push(file1.path)
          }
        });
          localStorage.setItem("multipleFiles", JSON.stringify(archivos) ); //nombre del archivo playlist .json
      }
   });

   $('#loadFile').on('click', function(event){
      var file1=$('#singleFile')[0].files[0]; //comando para cargar ruta completa:
      if(typeof file1 === "undefined"){
      }else{//si he seleccionado nuevo archivo lo cargo
        console.log("loading..." + file1)        
        loadPlaylistFile(file1.path);
      }
    });

      $('a.load-playlist-btn').on('click', function(event){
        console.log("boton")
        event.preventDefault();
        var indx=$(this).data("number");
        console.log(indx)
        cfg.playlistFile=cfg.playlistDays[indx];      
        loadPlaylistFile(cfg.playlistFile);
        $('.filename.active').removeClass("active")
        $(this).parent().find('.filename').addClass("active");
      });
      $('a.load-playlist-btn-single').on('click', function(event){   
        event.preventDefault();
        loadPlaylistFile(cfg.playlistFile);
        $('.filename.active').removeClass("active")
        $(this).parent().find('.filename').addClass("active");
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

