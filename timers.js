// Constructor
  var timer1=null;
  var nombreProcesoActual=null;
  var tipoProgramaActual=null;

// class methods
exports.start = function() {
  nombreProcesoActual=null;
  tipoProgramaActual=null;
  reproducir();
  this.update();
};

exports.goto = function(indexProjectLoad) {
  this.stop();
  console.log(indexProjectLoad);
  updateAction(indexProjectLoad);
};

exports.stop = function() {
  clearTimeout(timer1);
  global.indiceLista=0;
};

exports.update = function() {

  var p=global.proyectos[global.indiceLista];
  console.log("fuera del timer "+ p.duracion + " " + p.url);
  timer1=setTimeout( updateAction, hmsToMilliSecondsOnly(p.duracion));
};

var updateAction = function(indexProjectLoad){
    if(tipoProgramaActual!=null && tipoProgramaActual=="app"){
      var exec = require("child_process").exec, child;
      child=exec( "kill `pgrep "+nombreProcesoActual+"`",
      function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
        }
      });
    }

    if(typeof indexProjectLoad==="undefined"){
      global.indiceLista+=1; if(indiceLista>=global.proyectos.length) {global.indiceLista=0;}
    }
    else{
        console.log("global "+ indexProjectLoad);
        global.indiceLista=indexProjectLoad; if(indiceLista>=global.proyectos.length) global.indiceLista=0;
      }

    reproducir();
    exports.update();
  }

var reproducir=function(){
    var p1=global.proyectos[global.indiceLista];
    console.log("dentro de reproducir: "+ p1.duracion + " " + p1.url);
    tipoProgramaActual=p1.tipo;
    mainWindow.webContents.send('updateWeb', global.indiceLista);
    nombreProcesoActual=p1.url.replace('.json','');
    
}

function hmsToMilliSecondsOnly(str) {
  str=str.toString();
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s*1000;
}
