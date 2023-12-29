import express from "express"
const app = express();
import {ApolloServer} from "apollo-server"
import mongoose from "mongoose"
import {vendorSeed} from "./seed.js"
import {
  vendor,
  leadGenerator
} from "./common-dbSchema.js";


const seedToInsert = [
  {key: vendor, value: vendorSeed}
]

mongoose.connect("mongodb://localhost:27017/orcaTest2")
.then(async () => {
  for(var i=0; i<seedToInsert.length; i++) {
    var found = await seedToInsert[i].key.find();
    if (!found.length) {
        seedToInsert[i].key.create(seedToInsert[i].value);
    }
  };
  console.log('Connection established with MongoDB');
}).catch(err => {
  throw new Error(err); 
});

import schema from "./graphqlHelper.js";

const server = new ApolloServer({ 
    schema,
    context: ({req}) => {
      if (req) {
        return {
          auth: req,
          vendor,
          leadGenerator
        }
      }
  },
 });

  server.listen({ port: 9000 }, () => {
  console.log(`server listening port`)

});
