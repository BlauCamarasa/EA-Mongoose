import mongoose, { ObjectId, Schema, model } from 'mongoose';
import { AirlineModel, IAirline } from './airline.js';

// 1. Create an interface representing a TS object.
export interface IAirport {
  name: string;
  city: string;
  terminals: number;
  capacity: number;
  airlines: ObjectId[];     //Utilizando los Id de los objetos como referencia, usar luego populate()!!! No es embedded document
  mainairlines: IAirline[];                //Es embedded document, ya que guarda el objeto airline directamente en el array
  handlingCompanies?: number;
  _id?: ObjectId;
}

// 2. Create a Schema corresponding to the document in MongoDB.
const airportSchema = new Schema<IAirport>({
    name: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    terminals: { type: Number, required: true },
    capacity: { type: Number, required: true },
    airlines: [{type: mongoose.Schema.Types.ObjectId, ref:'Airline'}],   
    mainairlines: [AirlineModel.schema],
    handlingCompanies: { type: Number }
});

// 3. Create a Model.
export const AirportModel = model('Airport', airportSchema);