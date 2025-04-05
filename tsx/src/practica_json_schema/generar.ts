import Ajv from 'ajv';

//import { Localitzacio } from "./objetos.ts";
import data from './download.json';
import schema from './schema.json' with {type: "json"};
import { Localitzacio } from './objetos';

export const endolls: Localitzacio[] = Object.values(data.locations);

console.log("es array: " + Array.isArray(endolls) );

const ajv = new Ajv();
const validateProduct = ajv.compile(schema);

let h = validateProduct(endolls);

console.log(h);