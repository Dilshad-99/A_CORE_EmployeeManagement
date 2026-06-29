import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  status: { type: Number, default: 0 },
  info: String,
});

const UserSchemaModel = mongoose.model("User", UserSchema);

export default UserSchemaModel;
