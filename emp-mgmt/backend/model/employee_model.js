import mongoose from 'mongoose';

const EmployeeSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  salary: { type: Number, required: true },
  joiningDate: { type: String, required: true },
  status: { type: String, default: "Active" },
});

const EmployeeSchemaModel = mongoose.model("Employee", EmployeeSchema);

export default EmployeeSchemaModel;
