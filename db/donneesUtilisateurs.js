/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var pgp = require('pg-promise')(/*options*/)
var dbconfig = require('./settings.js').settings


var db = pgp(dbconfig)

function utilisateurExistant(tel, callback){
    db.any("SELECT numeroTel FROM utilisateur WHERE numeroTel='"+ tel +"';")
        .then(function (data) {
            callback(null ,data);
        })

        .catch(function (error) {

            callback(error ,null)

        });      
    
}
function addUser(tel, callback){
    db.any("INSERT INTO utilisateur(numerotel) VALUES '"+ tel +"';")
        .then(function(){
            callback(null);
        })
        .catch(function(error) {                    
            callback(error);
        });
};

function  getContactUtilisateur(id, callback) {

    db.any('SELECT distinct u.idPerson u.numeroTel FROM public.contact c, public.utilisateur u WHERE c.idPerson1 = '+id.toString()+';', null)

        .then(function (data) {
            callback(null ,data);
        })

        .catch(function (error) {

            callback(error ,null)

        });        
}

function getPosition(idPerson, callback){
    
    db.any('SELECT position FROM utilisateur;')
        .then(function (data) {
            callback(null ,data);
        })

        .catch(function (error) {

            callback(error ,null)

        }); 
    
}

module.exports = {addUser };







