/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var db = require('../db/donnesUtilisateurs.js');


function calculZoneGeographique(socket)
{
    // setInterval permet de mettre en place un appel cyclique toutes les <x> millisecondes
    timer = setInterval(function(){
        var res = getPoints(x_min, x_max, y_min, y_max, Math.sin(alpha));
        socket.send(res.points); // envoie des données sur la websocket
        alpha += 0.1;
      }, 100)  
}

function animationOff()
{
   // supprimer l'appel cyclique désigné par timer
    clearInterval(timer);
}

