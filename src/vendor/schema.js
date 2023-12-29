import { gql } from "apollo-server-express";

//graphql schema for vendor

export default gql`

scalar Upload

type allVendors {
    id: ID!
    vendorName: String
    standoutFeatures: [String]
    profileLogoImage: String
    description: String
    websiteUrl: String
    logoImage: String
}

type leadGeneratorData {
    firstName: String
    lastName: String
    email: String,
    phoneNumber: String
    websiteUrl: String
    companyName: String
}

type vendorDashboard {
    id: ID!
    vendorName: String
    visitWebsite_Clicks: Int
    visitWebsite_FormFilled: Int
    totalSpentAmount: Int
    leadGeneratorData: [leadGeneratorData]
}

 type Query {
    getAllVendors: [allVendors]
    getVendorbyId(id: ID!): allVendors
    getVendorDashboard: vendorDashboard
}


input vendorInput {
    email: String
    password: String
 }

input updateVendorInput {
    description: String
    profileLogoImage: Upload
    websiteUrl: String
    maxUrlClicks: Int
    clickPrice: Int
}

 type Mutation {
    login(data: vendorInput): String
    updateVendorProfile(id: ID, data: updateVendorInput): String
}`;
