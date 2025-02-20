const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "your_mongodb_connection_string";

app.use(cors());
app.use(express.json());

let db;
MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db("employeeData"); // Database Name
    console.log("Connected to MongoDB");
  })
  .catch(error => console.error(error));

/* 
CRUD OPERATIONS
*/

// Get all employees
app.get("/employees", async (req, res) => {
  try {
    const employees = await db.collection("employees").find().toArray();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// Get specific employee by ID
app.get("/employees/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await db.collection("employees").findOne({ _id: new ObjectId(id) });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employee" });
  }
});

// Add new employee
app.post("/employees", async (req, res) => {
  try {
    const { id, ...newEmployee } = req.body; // `id` বাদ দিয়ে বাকি ফিল্ড নাও
    await db.collection("employees").insertOne(newEmployee);
    res.status(201).json({ message: "Employee added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add employee" });
  }
});

// Update specific employee by ID
app.put("/employees/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedEmployee = req.body;

    // ObjectId তৈরির জন্য চেক করবো
    const filter = { _id: new ObjectId(id) };

    // ডাটা আপডেট করবো
    const updateDoc = {
      $set: {
        id: updatedEmployee.id, // Numeric ID
        name: updatedEmployee.name,
        phone: updatedEmployee.phone,
        email: updatedEmployee.email,
        address: updatedEmployee.address,
        profilePic: updatedEmployee.profilePic,
      },
    };

    const result = await db.collection("employees").updateOne(filter, updateDoc);

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Employee not found or no changes made" });
    }

    res.json({ message: "Employee updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update employee" });
  }
});



// Delete specific employee by ID
app.delete("/employees/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection("employees").deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
