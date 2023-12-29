import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

// db schema - vendor
const vendorSchema = new Schema({
    vendorName: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    profileLogoImage: {
        type: String
    },
    standoutFeatures: {
        type: Array
    },
    websiteUrl: {
        type: String
    },
    maxUrlClicks: {
        type: Number
    },
    clickPrice: {
        type: Number
    },
    updatedVisitWebsiteClicks: {
        type: Number,
        default: 0
    },
    updatedVisitWebsiteFormGen: {
        type: Number,
        default: 0
    },
    updatedVisitWebsiteClickPrice: {
        type: Number,
        default: 0
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

vendorSchema.pre("save", function(next) {
    if (!this.isModified("password")) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(this.password, salt, (err, hash) => {
            if(err) return next(err);
            this.password = hash;
            next()
        })
    })
})


export default mongoose.model("vendor", vendorSchema);