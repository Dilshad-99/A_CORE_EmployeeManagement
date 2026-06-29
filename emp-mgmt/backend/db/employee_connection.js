import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/emp_mgmt")
  .then(() => {
    console.log("db connected");
  })
  .catch((error) => {
    console.log("db not connected", error);
  });
