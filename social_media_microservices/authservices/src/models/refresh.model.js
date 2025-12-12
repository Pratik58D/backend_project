import mongoose from "mongoose";


const refreshTokenSchema = new mongoose.Schema({
     token: {
      type: String,
      required: true,
      unique: true,
    },
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true,
    },
     expiresAt: {
      type: Date,
      required: true,
    },
},
{timestamps : true});


// MongoDB will automatically delete documents once the value of expiresAt is reached.
// 0 means delete exactly when the date in expiresAt passes
//tells MongoDB to delete the document when the expiresAt date passes

refreshTokenSchema.index({expiresAt:1},{expireAfterSeconds:0});


const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;