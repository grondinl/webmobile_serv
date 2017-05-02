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
var date = new Date();
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
    socket.emit('text', "Connecté");
    
    socket.on('identification', function(tel){
        console.log("identification avec tel : " + tel);
        socket.tel=tel;
        dU.utilisateurExistant(tel, function(data,error) {
            if (error === null) {
                socket.emit('identification ok', 'identification ok');
                if (data[0].count === "1") {
                    console.log("utilisateur existant");
                    socket.emit('text',"utilisateur existant : " + tel);
                }
                else {
                    console.log("ajout utilisateur : " + tel);
                    dU.addUser(tel,function(error){
                        if(error === null) {
                            console.log("utilisateur ajouté");
                            socket.emit('text',"utilisateur ajouté");
                        } else {
                            console.log("erreur ajout");
                            socket.emit('text', "erreur");
                        }
                    });
                }
            }
            else {
                socket.emit('text', "erreur existant");
            }
        });
    });
    
    socket.on('liste contacts', function() {
        dU.getContactUtilisateur(socket.tel, function(data, error) {
            if (error === null) {
                socket.emit('liste contacts', data);
            } else {
                console.log("erreur getContactUtilisateur dans  liste");
            }
        });
    });
    
    socket.on('update contact', function(num) {
        console.log("update contact" + num);
        dU.getContactUtilisateur(socket.tel, function(data, error) {
           if (error === null) {
                dU.utilisateurExistant(num, function(data2, error) {
                    if (error === null) {
                        if (data2[0].count == 1) {
                            var trouve = 0;
                            for (j=0; j < data.length; j++) {
                                if (data[j].numerotel == num) {
                                    trouve = 1;
                                    console.log(num + " est déjà en contact avec"+socket.tel);
                                }
                            }
                            if (trouve === 0) {
                                dU.addContact(socket.tel, num, function(data3, error) {
                                    if (error !== null) {
                                        console.log("erreur ajout contact");
                                    }
                                });
                            }
                        }
                    }/* else {
                        console.log("erreur existant update");
                    }*/
                });

           } else {
               console.log("erreur getContactUtilisateur dans update :" + error);
           }
       }); 
    });
   
    socket.on('newMessage', function(messageEtOption){
        var message = messageEtOption.message;
        var lat = messageEtOption.lat;
        var lon = messageEtOption.lon;
        
        dU.newMessage(message, socket.tel, lat, lon, function(data, error){
            if (error == null){
                console.log("nouveau message ajouté");
            } else {
                console.log("erreur nouveau message");
            }
        });
    });
    
    socket.on('recuperation message', function(tel){
        console.log(tel + " veut recupérer ses messages")
        dU.recupMessage( function(data,error){
            if (error == null){
                socket.emit("envoie message", data);
            } else {
                console.log("erreur recuperation des messages");
            }
        })
    })
   
   
    socket.on('disconnect', function(){
        console.log("Un utilisateur s'est déconnecté.");
    });
});

server.listen(3000);
console.log("listening on 3000");