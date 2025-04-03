import Ajv from 'ajv';

import { Localitzacio } from "./objetos.ts";
import data from './download.json';
import schema from './schema.json' with {type: "json"};

export const endolls: Localitzacio[] = data.locations;

const ajv = new Ajv();
const validateProduct = ajv.compile(schema);

let h = validateProduct(endolls);

console.log(h);