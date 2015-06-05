// Constructor
  var timer1;
  var nombreProcesoActual;
  var tipoProgramaActual;

// class methods
exports.start = function() {
  nombreProcesoActual=null;
  tipoProgramaActual=null;
  this.update();
};

exports.stop = function() {
  clearTimeout(timer1);
};

exports.update = function() {
  //hago algo
  //vuelvo a temporizar la funcion

  var p=proyectos[indiceLista];
  console.log("fuera del timer "+ p.duracion + " " + p.url)
  timer1=setTimeout(function(){
    console.log("rulo: " + indiceLista);
    if(tipoProgramaActual!=null){
      var exec = require("child_process").exec, child;
      child=exec( "kill `pgrep "+nombreProcesoActual+"`",
      function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
        }
      });
    }

    var p1=proyectos[indiceLista];
    console.log("dentro del timer: "+ p1.duracion + " " + p1.url)
    if(p1.tipo=="external"){
      tipoProgramaActual="external";
      var exec = require("child_process").exec, child;
      child=exec('open /Users/sergiogalan/Proyectos/medialabCCN/medialabccn-app/web/projects/apps/'+p1.url+'.app',
      function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
      });
    }
    if(p1.tipo=="web"){
      console.log("load url"+ p1.url);
      mainWindow.webContents.send('updateWeb', p1.url); // prints "pong"
      //mainWindow.loadUrl('file://' + __dirname + '/web/projects/'+ p1.url);
    }
    nombreProcesoActual=p1.url;

    indiceLista+=1;
    if(indiceLista>=proyectos.length) indiceLista=0;
    exports.update();
  }, p.duracion);
};
