// load PouchDB with the optional node-websql adapter
var PouchDB = require('pouchdb').plugin(require('pouchdb-adapter-node-websql'));

// set up our databases - make sure the URL is correct!
var inputDB = new PouchDB('http://localhost:5984/si-rmncha');
var outputDB = new PouchDB('si-rmncha', {adapter: 'websql', revs_limit: 1, auto_compaction: true});

// replicate
inputDB.replicate.to(outputDB);