const resolvers = {
    Mutation: {
        updatevisitWebsiteClicks: async (root, {websiteUrl, click}, {vendor}) => {
            const vendorData = await vendor.findOne({websiteUrl});
            if(vendorData && vendorData.clickPrice) {
                const result = await vendor.findOneAndUpdate({websiteUrl: websiteUrl}, { $inc: {'updatedVisitWebsiteClicks': click }, $inc: {'updatedVisitWebsiteClickPrice': vendorData.clickPrice } }).then((res) => {
                    if (res) {
                        return "Update Success";
                    } 
                })
                .catch((err) => {
                    throw new Error(`Update Error: ${err}`)
                });
                return result;
            }
        },

        addLeadGenerator: async (root, {websiteUrl, data}, {vendor, leadGenerator}) => { 
            const vendorData = await vendor.findOne({websiteUrl});
            if(vendorData && vendorData._id) {
                data.vendorId = vendorData._id
                const result = await new leadGenerator(data).save().then(async (res) => {
                    if (res) {
                        await vendor.findOneAndUpdate({websiteUrl: websiteUrl}, { $inc: {'updatedVisitWebsiteFormGen': 1 } })
                        return "Success";
                    } 
                })
                .catch((err) => {
                    throw new Error(`Add Error: ${err}`)
                });
                return result;
            }
        }
    }
}

export default resolvers;