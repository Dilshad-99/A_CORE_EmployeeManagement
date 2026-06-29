import '../db/employee_connection.js';

import EmployeeSchemaModel from '../model/employee_model.js';
import UserSchemaModel from '../model/user_model.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";


// ===================== AUTH =====================

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: false, message: "all fields are required" });
    }

    const existingUser = await UserSchemaModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ status: false, message: "email already exists" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    await UserSchemaModel.create({
      name,
      email,
      password: hashedpassword,
      status: 1,
      role: "user",
      info: Date.now().toString(),
    });

    res.status(201).json({ status: true, message: "register successful" });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: "email and password required" });
    }

    const user = await UserSchemaModel.findOne({ email, status: 1 });

    if (!user) {
      return res.status(400).json({ status: false, message: "user not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ status: false, message: "invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      status: true,
      message: "login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ status: false, message: "token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    res.status(401).json({ status: false, message: "invalid or expired token" });
  }
};


// ===================== EMPLOYEE CRUD =====================

export const save = async (req, res) => {
  try {
    const { name, email, mobile, department, designation, salary, joiningDate } = req.body;

    if (!name || !email || !mobile || !department || !designation || !salary || !joiningDate) {
      return res.status(400).json({ status: false, message: "all fields are required" });
    }

    const existingEmployee = await EmployeeSchemaModel.findOne({ email });

    if (existingEmployee) {
      return res.status(400).json({ status: false, message: "employee email already exists" });
    }

    await EmployeeSchemaModel.create(req.body);

    res.status(201).json({ status: true, message: "employee added" });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


export const fetch = async (req, res) => {
  try {
    const { search, department, status, page, limit } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
      ];
    }

    if (department) filter.department = department;
    if (status) filter.status = status;

    const total = await EmployeeSchemaModel.countDocuments(filter);

    const employees = await EmployeeSchemaModel.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ _id: -1 });

    res.status(200).json({
      status: true,
      data: employees,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


export const fetchOne = async (req, res) => {
  try {
    const { _id } = req.params;

    const employee = await EmployeeSchemaModel.findById(_id);

    if (employee) {
      res.status(200).json({ status: true, data: employee });
    } else {
      res.status(404).json({ status: false, message: "employee not found" });
    }

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


export const update = async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;

    if (!_id) {
      return res.status(400).json({ status: false, message: "employee id required" });
    }

    const result = await EmployeeSchemaModel.updateOne({ _id }, { $set: updateData });

    if (result.modifiedCount > 0) {
      res.status(200).json({ status: true, message: "employee updated" });
    } else {
      res.status(404).json({ status: false, message: "not updated" });
    }

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


export const deleteEmployee = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ status: false, message: "employee id required" });
    }

    const result = await EmployeeSchemaModel.deleteOne({ _id });

    if (result.deletedCount > 0) {
      res.status(200).json({ status: true, message: "employee deleted" });
    } else {
      res.status(404).json({ status: false, message: "employee not found" });
    }

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
