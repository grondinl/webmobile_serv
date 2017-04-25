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
var bodyParser = require('body-parser')  // envoie des paramètres en POST
//var mustacheExpress = require('mustache-express');
var ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
//routes et services à revoir
//var app_router = require('./routes/app_routes'); //eventuellement ( A VOIR PLUS TARD)
var messages_services = require('./services/messages')

// pour gérer les URL-encoded bodies (envoie formulaire en POST)
app.use(bodyParser.urlencoded({     
    extended: true
})); 

//chargement de socket.io
var io = require('socket.io')(server);

//quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
});

//le serveur veut envoyer un message à l'appli côté client
io.sockets.on('connection', function (socket) {
    //prend 2 paramètres: le type (ici message) et le contenu
    socket.emit('message', 'Vous êtes bien connecté !');
});

io.sockets.on('connection', function (socket, pseudo) {
    
    // a gerer avec les bdd
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('tel', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('tel', pseudo);
    });


    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    }); 

});

server.listen(8080);