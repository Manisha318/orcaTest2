import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeResolvers } from "merge-graphql-schemas";

import vendorSchema from "./src/vendor/schema.js";
import vendorResolver from "./src/vendor/resolver.js";

import leadGeneratorSchema from "./src/leadGeneration/schema.js";
import leadGeneratorResolver from "./src/leadGeneration/resolver.js";


var schema = makeExecutableSchema({
    // combine graphql schemas
    typeDefs: [
        vendorSchema,
        leadGeneratorSchema
    ],
    // combine graphql resolver functions
    resolvers: mergeResolvers([
        vendorResolver,
        leadGeneratorResolver
    ])});
    
export default schema;