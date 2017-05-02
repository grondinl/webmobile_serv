/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var pgp = require('pg-promise')(/*options*/);
var dbconfig = require('./settings.js').settings;


var db = pgp(dbconfig);
var exports= module.exports ={};

exports.utilisateurExistant = function (tel, callback){
    db.any("SELECT COUNT(*) FROM public.utilisateur u WHERE u.numerotel='"+ tel +"';")
        .then(function (data) {
            //console.log("trouve "+ data[0].count +" utilisateurs ayant pour tel "+tel);
            callback(data, null);
        })

        .catch(function (error) {

            callback(null ,error);

        });      
    
};
exports.addUser = function (tel, callback){
    db.any("INSERT INTO public.utilisateur(numerotel) VALUES ('"+ tel +"');")
        .then(function(){
            callback(null);
        })
        .catch(function(error) {                    
            callback(error);
        });
};

exports.addContact = function(tel1, tel2, callback) {
    console.log("ajout du lien " + tel1 + " - " + tel2);
    db.any("INSERT INTO public.contact(numerotel1, numerotel2) VALUES ('"+tel1+"', '"+tel2+"');")
            .then(function(){
                callback(data, null);
            })
            
            .catch(function (error) {
                callback(null, error);
            });
};
exports.getContactUtilisateur = function (tel, callback) {
    
    db.any("Select case when c.numerotel1='"+tel+"' then c.numerotel2 when c.numerotel2='"+tel+"' then c.numerotel1 end as numerotel from public.contact c;")
        .then(function (data) {
            callback(data ,null);
        })
        .catch(function (error) {

            callback(null, error);

        });        
};

exports.nouveauMessage = function (message, callback) {

    db.any('SELECT distinct u.idPerson u.numeroTel FROM public.contact c, public.utilisateur u WHERE c.idPerson1 = '+id.toString()+';', null)

        .then(function (data) {
            callback(null ,data);
        })

        .catch(function (error) {

            callback(error ,null);

        });        
};

exports.getPosition = function (idPerson, callback){
    
    db.any('SELECT position FROM utilisateur;')
        .then(function (data) {
            callback(null ,data);
        })

        .catch(function (error) {

            callback(error ,null);

        }); 
    
};