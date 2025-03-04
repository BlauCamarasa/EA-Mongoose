import mongoose, { ObjectId, Types } from 'mongoose';
import { AirlineModel, IAirline } from './airline.js';
import { AirportModel, IAirport } from './airport.js';

async function enlaces() {
  mongoose.set('strictQuery', true); // Mantiene el comportamiento actual

  await mongoose.connect('mongodb://127.0.0.1:27017/seminari4')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err:unknown) => console.error('Error al conectar:', err))

  const spanishAirlines: IAirline[] = await AirlineModel.find({nationality:"spanish"});
  const IDs: ObjectId[] = await AirlineModel.aggregate([{$match:{nationality:"irish"}},{$project: {_id: 1}}]);

  const airport1: IAirport = {
    name: 'Madrid-Barajas',
    city: 'Madrid',
    terminals: 4,
    capacity: 50000000,
    airlines: IDs, // IDs referenciados
    mainairlines: spanishAirlines, // Documentos embebidos
    handlingCompanies: 3
    };
    
  const newAirport= new AirportModel(airport1);
  await newAirport.save() // save de una aeroport
  .then(airport => console.log("Airport saved: ",airport))
  .catch(err => console.log(err));

  const GoodAirlines: IAirline[] = await AirlineModel.find({nationality:"qatar"});
  const ID: ObjectId[] = await AirlineModel.aggregate([{$match:{nationality:"spanish"}},{$project: {_id: 1}}]);

  const airport2: IAirport = {
    name: 'Josep Tarradelles',
    city: 'Barcelona',
    terminals: 2,
    capacity: 60000000,
    airlines: ID, // IDs referenciados
    mainairlines: GoodAirlines, // Documentos embebidos
    handlingCompanies: 2
    };

  const newAirport2= new AirportModel(airport2);
  await newAirport2.save() // save de una aeroport
  .then(airport => console.log("Airport saved: ",airport))
  .catch(err => console.log(err));

  //Con el populate puedes buscar aquellos documentos que se han referenciado con el ID
  await AirportModel.findOne({name:"Josep Tarradelles"}).populate("airlines")
  .then(airlines => console.log("Populate de las aerolineas de Josep Tarradelles: ",airlines))
  .catch(err => console.log(err));

  await AirportModel.findOne({name:"Madrid-Barajas"}).populate("airlines")
  .then(airlines => console.log("Populate de las aerolineas de Madrid-Barajas: ",airlines))
  .catch(err => console.log(err));
  

}
enlaces();