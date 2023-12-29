import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import path from "path";
import {UserInputError } from "apollo-server";

const resolvers = {
    Query: {
        getAllVendors: async (root, args, {vendor}) => {
            const allVendors = await vendor.find({}, "-password");
            await allVendors.map((i) => {
                if(i.profileLogoImage) {
                    i.profileLogoImage = `http://localhost:9000/fileStorage/vendor/${i.id}/${i.profileLogoImage}`
                }
            })
            console.log(allVendors);
            return allVendors;
        },

        getVendorbyId: async (root, {id}, {auth, vendor}) => {
            console.log("auth", auth.headers.authorization);
            if (!auth.headers.authorization) {
                throw new Error('You are not authenticated!')
            }

            var verifiedVendor =  jwt.verify(auth.headers.authorization , 'secret' );
            if (verifiedVendor && verifiedVendor.id === id) {
                const vendorData = await vendor.findOne({_id: id});
                if (vendorData) {
                    vendorData.profileLogoImage = `http://localhost:9000/fileStorage/vendor/${id}/${vendorData.profileLogoImage}`
                }
                return vendorData;
            }
            else {
              throw new Error('Authentication Failed')
            }
        },

        getVendorDashboard: async (root, _, {auth, vendor, leadGenerator}) => {
            if (!auth.headers.authorization) {
                throw new Error('You are not authenticated!')
            }

            var verifiedVendor =  jwt.verify(auth.headers.authorization , 'secret' );
            if (verifiedVendor && verifiedVendor.id) {
                var vendorData = await vendor.findOne({_id: verifiedVendor.id});
                const leadGeneratorDetails = await leadGenerator.find({vendorId: verifiedVendor.id});
                const leadGeneratorData = await leadGeneratorDetails.map((i) => {
                    const res = {
                        firstName: i.firstName,
                        lastName: i.lastName,
                        email: i.email,
                        phoneNumber: i.phoneNumber,
                        websiteUrl: i.websiteUrl,
                        companyName: i.companyName
                    }
                    return res
                })
                const dashboardResult = {
                    id: vendorData._id,
                    vendorName: vendorData.vendorName,
                    visitWebsite_Clicks: vendorData.updatedVisitWebsiteClicks,
                    visitWebsite_FormFilled: vendorData.updatedVisitWebsiteFormGen,
                    totalSpentAmount: vendorData.updatedVisitWebsiteClickPrice,
                    leadGeneratorData: leadGeneratorData
                }
                return dashboardResult;
            }
            else {
              throw new Error('Authentication Failed')
            }
        },
    },
    
    Mutation: {
        login: async (root, {data}, {vendor}) => {            
            let response = await vendor.findOne({email: data.email});
            if (!response) {                    
                throw new UserInputError('Vendor not found')                          
            }

            const valid = await bcrypt.compare(data.password, response.password)
            if (!valid) {
              throw new Error('Incorrect password')
            }

            return jwt.sign(
              { id: response._id, email: response.email },
              "secret",
              { expiresIn: 600 }
            )            
        },

        updateVendorProfile: async (root, {id, data}, {auth, vendor}) => { 
            if (!auth.headers.authorization) {
                throw new Error('You are not authenticated!')
            }
            
            var verifiedVendor =  jwt.verify(auth.headers.authorization , 'secret' );
            if (verifiedVendor && verifiedVendor.id === id) {
                if (data.profileLogoImage) {
                    const { stream, filename } = await data.profileLogoImage;
                    let ext = filename.split('.')[1];
                    var fileName = `vendorLogo${new Date().getTime()}.${ext}`;

                    // reusable function to create non existing path
                    const createPath = (imagePath, name) => {
                        if(!fs.existsSync(imagePath)) {
                        fs.mkdirSync(imagePath);
                        }
                        return path.join(imagePath, name);
                    }

                    // store uploaded files in specified path
                    const storeUpload = ({ stream }, filename, id, type) => 
                    new Promise((resolve, reject) =>
                    stream
                    .pipe(fs.createWriteStream(createPath(path.join('fileStorage', 'vendor', String(id)), filename)))
                    .on("finish", () => resolve())
                    .on("error", reject)
                    );

                    await storeUpload({ stream }, fileName, 'images', 'site');
                    data.profileLogoImage = fileName;
                }   

                const result = await vendor.findOneAndUpdate({_id: id}, {$set: data}).then((res) => {
                    if (res) {
                        return "Update Success";
                    } 
                })
                .catch((err) => {
                    throw new Error(`Update Error: ${err}`)
                });
                return result;
            }
            else {
              throw new Error('Authentication Failed')
            }            
        },
    }
};

export default resolvers;