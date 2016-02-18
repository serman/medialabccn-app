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

exports.stop = function() {
  clearTimeout(timer1);
  global.indiceLista=0;
};

exports.update = function() {
  var p=global.proyectos[global.indiceLista];
  console.log("fuera del timer "+ p.duracion + " " + p.url);
  timer1=setTimeout(function(){
      if(tipoProgramaActual!=null && tipoProgramaActual=="app"){
        var exec = require("child_process").exec, child;
        child=exec( "kill `pgrep "+nombreProcesoActual+"`",
        function (error, stdout, stderr) {
          if (error !== null) {
            console.log('exec error: ' + error);
          }
        });
      }
      global.indiceLista+=1; if(indiceLista>=global.proyectos.length) indiceLista=0;

      reproducir();
      exports.update();
  }, hmsToMilliSecondsOnly(p.duracion));
};

var reproducir=function(){
    var p1=global.proyectos[global.indiceLista];
    console.log("dentro del timer: "+ p1.duracion + " " + p1.url);

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
