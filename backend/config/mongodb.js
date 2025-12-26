// import mongoose from "mongoose";

// const connectDB = async () => {

//     mongoose.connection.on('connected', () => console.log("Database Connected"))

//     await mongoose.connect(`${process.env.MONGODB_URI}/ira`)
// }


// export default connectDB

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("✅ Database Connected")
    );

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "ira"   // 👈 explicit database name
    });

  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
  }
};

export default connectDB;
