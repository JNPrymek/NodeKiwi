#!/usr/bin/env node

import Kiwi from '../kiwi_connector/kiwi.js';
import KiwiBase from '../models/kiwiBase.js';

console.log('KiwiBase.getById(1)');
let objs = [
	{ id : 1, a : 'a', b : 'bee', c : 31 },
	{ id : 2, a : 'a2', b : 'bee2', c : 32 },
	{ id : 3, a : 'a3', b : 'bee3', c : 33 },
	{ id : 1, a : 'a2', b : 'bee2', c : 32 },
	{ id : 1, a : 'a3', b : 'bee3', c : 33 },
	{ id : 4, a : 'a2', b : 'bee2', c : 32 },
	{ id : 5, a : 'a3', b : 'bee3', c : 33 },
	{ id : 6, a : 'a4', b : 'bee4', c : 34 }
];

console.log('Before excluding properties:\n', objs);
// Delete property with key 'a', and key 'bee' (nonexistent, will do nothing)
KiwiBase.excludePropertiesFromList(objs, ['a', 'bee']); 
console.log('After excluding properties:\n', objs);
	
console.log('----------------------------');

console.log('Before removing duplicates:\n', objs);
objs = KiwiBase.excludeDuplicatesFromList(objs);
console.log('After removing duplicates:\n', objs);
	
console.log('----------------------------');