import { readdirSync } from 'fs';
import { join } from 'path';

// Import all mongoose static files in this directory.
// https://mongoosejs.com/docs/guide.html#statics

const fileExt = process.env.NODE_ENV === 'production' ? 'statics.js' : 'statics.ts';
const files = readdirSync(__dirname).filter(file => file.endsWith(fileExt));

files.forEach(file => import(join(__dirname, file)));
