import { ObjectId, Schema, model } from 'mongoose';

// 1. Create an interface representing a TS object.
export interface IAirline {
  name: string;
  nationality: string;
  anualOperations: number;
  airplanes: number;
  capital?: number;
  _id?: ObjectId;
}

// 2. Create a Schema corresponding to the document in MongoDB.
const airlineSchema = new Schema<IAirline>({
  name: { type: String, required: true, unique: true },
  nationality: { type: String, required: true },
  anualOperations: { type: Number, required: true },
  airplanes: { type: Number, required: true },
  capital: { type: Number }
});

// 3. Create a Model.
export const AirlineModel = model('Airline', airlineSchema);