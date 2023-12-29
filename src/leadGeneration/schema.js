import { gql } from "apollo-server-express";

//graphql schema for leadDenerator

export default gql`

input leadGeneratorInput {
    firstName: String
    lastName: String
    email: String,
    phoneNumber: String
    websiteUrl: String
    companyName: String
}

type Mutation {
    addLeadGenerator(websiteUrl: String, data: leadGeneratorInput): String
    updatevisitWebsiteClicks(websiteUrl: String, click: Int): String
}`;
