/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
//Reception d'un evenement utilisateur :
//socket_client.on('<event_name>', function(data) {...})

//Emission d'un message (evenement "message")
socket_client.send(obj);
//obj = n'importe quel objet serialisable
//Emission d'un evenement utilisateur :
socket_client.emit('<event>', obj)
//Envoie d'un message a l'ensemble des sockets ouvertes (evt broadcastpar exemple) :
io.sockets.emit('broadcast', obj)
//Envoie d'un message a l'ensemble des sockets sauf celle qui envoie le message (evt newclient par exemple) :
socket_client.broadcast.emit('newclient', obj)
*/

//chargement et création du serveur
var express = require('express');
var path = require('path');
var app = express(); // creation du serveur
var server = require('http').createServer(app);
var bodyParser = require('body-parser');  // envoie des paramètres en POST
//var mustacheExpress = require('mustache-express');
var ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
var dU = require('./db/donneesUtilisateurs.js');
//var app_router = require('./routes/app_routes'); //eventuellement ( A VOIR PLUS TARD)
var messages_services = require('./services/messages');

// pour gérer les URL-encoded bodies (envoie formulaire en POST)
app.use(bodyParser.urlencoded({     
    extended: true
})); 

//chargement de socket.io
var io = require('socket.io')(server, { pingTimeout: 60000});
/*
//quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
});

//le serveur veut envoyer un message à l'appli côté client
io.sockets.on('connection', function (socket) {
    //prend 2 paramètres: le type (ici message) et le contenu
    socket.emit('message', 'Vous êtes bien connecté !');
});
*/
io.sockets.on('connection', function (socket) {
    console.log("Connection");
    // a gerer avec les bdd
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    /*socket_client.on('nouveau_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket_client.pseudo = pseudo;//variable de session
        socket_client.broadcast.emit('nouveau_client', pseudo);
    });
    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket_client.on('message', function (message) {
        message = ent.encode(message);
        socket_client.broadcast.emit('message', {pseudo: socket_client.pseudo, message: message});
    });*/
    socket.emit('text', "Coucou");
    
    socket.on('identification', function(tel){
        console.log("identification avec tel : " + tel);
        dU.utilisateurExistant(tel, function(data,error) {
            if (error == null) {
                if (data == 1) {
                    console.log("utilisateur existant");
                    socket.emit('text',"utilisateur existant : " + data);
                }
                else {
                    console.log("ajout utilisateur");
                    dU.addUser(tel,function(error){
                        if(error == null) {
                            socket.emit('text',"utilisateur ajouté");
                        }
                    });
                }
            }
            else {
                socket.emit('text', "erreur")
            }
        });
    });
    
    socket.on('disconnect', function(){
        console.log("Un utilisateur s'est déconnecté.");
    });
});

server.listen(3000);
console.log("listening on 3000");