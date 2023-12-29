import mongoose from "mongoose";

const Schema = mongoose.Schema;
// db schema - leadGeneration
const leadGenerationSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String
    },
    websiteUrl: {
        type: String
    },
    companyName: {
        type: String
    },
    vendorId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


export default mongoose.model("leadGeneration", leadGenerationSchema);