import mongoose from 'mongoose';
import { AirlineModel, IAirline } from './airline.js';
import { AirportModel, IAirport } from './airport.js';

async function agregaciones() {
  mongoose.set('strictQuery', true); // Mantiene el comportamiento actual

  await mongoose.connect('mongodb://127.0.0.1:27017/seminari4')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err:unknown) => console.error('Error al conectar:', err));

  //Aggregaciones
  //$group -- da el numero medio de aviones por grupos de nacionalidades
  await AirlineModel.aggregate([
    {
        $group: {
            _id: "$nationality",
            averageAirplanes: {$avg:"$airplanes"}
        }
    }
  ]) 
  .then(result => console.log("result of agrupation by nationality: ",result))
  .catch(err => console.log(err));

  //$limit -- da un limite de 3 documentos
  await AirlineModel.aggregate([
    {$limit: 2}
  ]) 
  .then(result => console.log("result of limiting to 2: ",result))
  .catch(err => console.log(err));

  //$project -- permite incluir i/o excluir campos de los documentos
  //El id siempre va incluido por defecto, si se quiere quitar hay que marcarlo

  //Ejemplo de incluir solo los campos, y marcar con un 1
  await AirlineModel.aggregate([
    {
        $project: {
            _id: 0,
            name: 1,
            anualOperations: 1,
            airplanes: 1,
        }
    }
  ]) 
  .then(result => console.log("result of $project including name, operations and airplanes: ",result))
  .catch(err => console.log(err));

  //Ejemplo de excluir solo los campos, y marcar con un 0
  await AirlineModel.aggregate([
    {
        $project: {
            capital: 0,
            anualOperations: 0,
            airplanes: 0,
        }
    }
  ]) 
  .then(result => console.log("result of $project excluding capital, operations and airplanes: ",result))
  .catch(err => console.log(err));

  //$sort -- permite ordenar los documentos segun el campo deseado y orden deseado
  //Ejemplo de ordenar por capital ascendiente
  await AirlineModel.aggregate([
    {
        $sort: { capital: 1,}   //1 es ascendente y -1 es orden descendente
    }
  ]) 
  .then(result => console.log("result of $sort by ascendent capital: ",result))
  .catch(err => console.log(err));

  //Se ordena por airplanes descendente y en caso de empate for capital ascendente
  await AirlineModel.aggregate([
    {
        $sort: { airplanes: -1, capital: 1 }   //1 es ascendente y -1 es orden descendente
    }
  ]) 
  .then(result => console.log("result of $sort by descendent airplanes and in case of draw by ascending capital: ",result))
  .catch(err => console.log(err));

  //$match -- hace la funcion de find()
  //Ejemplo de buscar solo los que tengan mas de 600000000 en capital 
  await AirlineModel.aggregate([
    {
        $match: { capital: { $gt: 600000000} }
    }
  ]) 
  .then(result => console.log("result of $match (capital>600000000): ",result))
  .catch(err => console.log(err));

  //Ejemplo de buscar solo los de nacionalidad spanish y que tengan 90 aviones
  await AirlineModel.aggregate([
    {
        $match: { nationality: "spanish", airplanes: 90}  
    }
  ]) 
  .then(result => console.log("result of $match (spanish and 90 airplanes): ",result))
  .catch(err => console.log(err));

  //$addFields -- Permite crear un nuevo campo a partir de otros
  //Ejemplo de crear un campo a partir de la division de otros dos campos
  await AirlineModel.aggregate([
    {
        $addFields: { operationsPerAircraft: { $divide: ["$anualOperations","$airplanes"]}}  
    }
  ]) 
  .then(result => console.log("result of $addfields, create a new field operationsPerAircraft (anualOperations/aircrafts): ",result))
  .catch(err => console.log(err));

  //Ejemplo de crear un campo booleano mirando si otro campo es menor a X
  await AirlineModel.aggregate([
    {
        $addFields: { isPoorAirline: { $lt: ["$capital",10000000]}}  
    }
  ]) 
  .then(result => console.log("result of $addfields, create a new field isPoorCompany (capital<10000000): ",result))
  .catch(err => console.log(err));

  //$count -- Permite contar los documentos, cobra mas sentido cuando esta concatenado
  //Ejemplo para contar todos los documentos
  await AirlineModel.aggregate([
    {
        $count: "Total docs"  
    }
  ]) 
  .then(result => console.log("result of $count, counts all the documents",result))
  .catch(err => console.log(err));

  //Concatenaciones de aggregate
  await AirlineModel.aggregate([
    {$match: { nationality: "spanish"}},{$limit: 1}
  ]) 
  .then(result => console.log("result of $match spanish and $limit 1: ",result))
  .catch(err => console.log(err));

  await AirlineModel.aggregate([
    {$match: { capital: { $gt: 600000000} }},{$sort: { capital: -1,} }
  ]) 
  .then(result => console.log("result of $match (capital>600000000), then sort by capital descendent: ",result))
  .catch(err => console.log(err));

  await AirlineModel.aggregate([
    {$match: { capital: { $gt: 600000000} }},{$count: "total docs"}
  ]) 
  .then(result => console.log("result of $match (capital>600000000), then give the total docs: ",result))
  .catch(err => console.log(err));


}
agregaciones();
