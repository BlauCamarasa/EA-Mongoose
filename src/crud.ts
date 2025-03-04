import mongoose from 'mongoose';
import { AirlineModel, IAirline } from './airline.js';

async function crud() {
  mongoose.set('strictQuery', true); // Mantiene el comportamiento actual

  await mongoose.connect('mongodb://127.0.0.1:27017/seminari4')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err:unknown) => console.error('Error al conectar:', err));

  const ver = false, listar = true, editar = false,  eliminar = false; 

  const airline1:  IAirline = {
    "name": 'Vueling',
    "nationality": 'spanish',
    "anualOperations": 20000000,
    "airplanes": 110,
    "capital": 590000000,
  };
  
  const airlines: IAirline[] = [
  {
    "name": 'Iberia',
    "nationality": 'spanish',
    "anualOperations": 40000000,
    "airplanes": 90,
    "capital": 65000000,
  },
  {
    "name": 'Ryanair',
    "nationality": 'irish',
    "anualOperations": 900000000,
    "airplanes": 250,
    "capital": 750000000,
  },
  {
    "name": 'Qatar',
    "nationality": 'qatar',
    "anualOperations": 200000,
    "airplanes": 75,
    "capital": 5420000000,
  },
  {
    "name": 'Aer lingus',
    "nationality": 'irish',
    "anualOperations": 500000,
    "airplanes": 55,
    "capital": 999900000,
  },
  {
    "name": 'British airways',
    "nationality": 'british',
    "anualOperations": 784000000,
    "airplanes": 90,
    "capital": 32000000,
  }];

  //CRUD --> Crear
  //Insertar solo un documento
  console.log("airline1: ", airline1); 
  const newAirline= new AirlineModel(airline1);  //hay que crear una instancia si solo se entra un documento
  await newAirline.save() // save de una sola aerolinia
  .then(airline => console.log("Airline saved: ",airline))
  .catch(err => console.log(err));

  //Insertar varios documentos
  console.log("airlines to save: ", airlines);
  await AirlineModel.insertMany(airlines) // Inserta todas las aerolineas
  .then(airlins => console.log("Airlines saved: ",airlins))
  .catch(err => console.log(err));

  if (ver){
    //CRUD --> Ver ("GET") --- find
    //Busca en la db un documento que tenga el Id que se entra como parametro
    await AirlineModel.findById('67c4a896f3a0e4f795ecf204') //
    .then(airline => console.log("Airline matching the ID: ",airline))
    .catch(err => console.log(err));
  
    //Busca en la db los documentos que tengan el campo igual al que se entra por parametro
    await AirlineModel.find({airplanes:90}) 
    .then(airline => console.log("Airlines matching the airplanes : ",airline))
    .catch(err => console.log(err));
  
    //Busca en la db 1 documento que tenga el parametro que se entra
    await AirlineModel.findOne({name:"Iberia"}) 
    .then(airline => console.log("Airline matching the name : ",airline))
    .catch(err => console.log(err));
  
    //Busca en la db los documentos que tengan nacionality == spanish y operaciones anuales mas altas a 50000
    await AirlineModel.find({nationality:"spanish",anualOperations:{$gt:50000}}) 
    .then(airline => console.log("Airlines matching the nationality and having anualoperations greater than X : ",airline))
    .catch(err => console.log(err));
  }
  
  if (listar){
    //CRUD --> Listar
    await AirlineModel.find() 
    .then(airlines => console.log("All documents : ",airlines))
    .catch(err => console.log(err));
  }
  
  if (editar){
    //CRUD --> Editar
    //Actualiza a solo 1 documento (el primero) las operaciones de una nacionalidad en concreto, no te devuelve el documento actualizado
    await AirlineModel.updateOne({nationality:"irish"},{$set:{anualOperations:10}}) 
    .then(airline => console.log("Update anual operations of irish nationality : ",airline))
    .catch(err => console.log(err));

    //Actualiza a solo 1 documento (el primero) las operaciones de una nacionalidad en concreto, te devuelve el documento sin actualizar
    await AirlineModel.findOneAndUpdate({nationality:"spanish"},{$set:{anualOperations:10}}) 
    .then(airline => console.log("Update anual operations of spanish nationality : ",airline))
    .catch(err => console.log(err));

    //Actualiza el capital del documento con id especifico, devuelve el documento
    await AirlineModel.findByIdAndUpdate('67c4a896f3a0e4f795ecf204',{$set:{capital:500}}) 
    .then(airline => console.log("Update capital to the document with the Id: ",airline))
    .catch(err => console.log(err));

    //Actualiza el capital incrementando 100 a varios que coincidan con el numero de aviones
    await AirlineModel.updateMany({airplanes:90},{$inc:{capital:100}}) 
    .then(airline => console.log("Update capital to all with the same num planes: ",airline))
    .catch(err => console.log(err));

    //Actualiza a todos los documentos el numero de aviones incrementando 1
    await AirlineModel.updateMany({},{$inc:{airplanes:1}}) 
    .then(airline => console.log("Update num planes to all: ",airline))
    .catch(err => console.log(err));
  }

  if(eliminar){
    //CRUD --> Borrar
    //Elimina 1 doc que tenga la nacionalidad spanish
    await AirlineModel.deleteOne({nationality:"spanish"}) 
    .then(airline => console.log("Delete 1 with spanish nationality: ",airline))
    .catch(err => console.log(err));
    
    //Listar
    await AirlineModel.find() 
    .then(airlines => console.log("All documents : ",airlines))
    .catch(err => console.log(err));
    
    //Elimina todos los documentos con 91 aviones
    await AirlineModel.deleteMany({airplanes:91}) 
    .then(airline => console.log("Elimina los que tengan 91 aviones: ",airline))
    .catch(err => console.log(err));

    //Listar
    await AirlineModel.find() 
    .then(airlines => console.log("All documents : ",airlines))
    .catch(err => console.log(err));

    //Elimina todo
    await AirlineModel.deleteMany({}) 
    .then(airline => console.log("Delete all: ",airline))
    .catch(err => console.log(err));
  }
  

}
crud();
