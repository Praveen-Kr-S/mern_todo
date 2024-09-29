// using express
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require("mongoose")

//create an instance of express
app = express();

app.use(express.json())
app.use(cors())

//sample in-menory storage for todo items
//let todos = [];

//Connecting Database
mongoose.connect('mongodb://127.0.0.1:27017/mern-app')
.then(() => {
    console.log(`Database Connected!`)
})
.catch((err) => {
    console.log(err)
})

//Creating  Schema
const todoSchema = new mongoose.Schema({
    title : {
        required : true,
        type : String
    },
    description : {
        required : true,
        type : String
    }
})

//creating Model

const todoModel = mongoose.model('Todo', todoSchema);

//Create a new todo item API
app.post("/todos", async(req, res) => {
    const {title, description} = req.body
    /* const newTodo = {
        id : todos.length + 1,
        title,
        description
    };
    todos.push(newTodo);
    console.log(todos) */
    try{
        const newTodo = new todoModel({title, description})
        await newTodo.save();
        res.status(201).json(newTodo); 
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message});
    }

    
})

//get all items from database API

app.get("/todos", async (req, res) => {
    try{
        const todos = await todoModel.find();
        res.json(todos)
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message});
    }
})

//Update a todo item

app.put("/todos/:id", async (req, res) => {

    try{
        const {title, description} = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title, description},
            { new : true }
        )
        
        if(!updatedTodo) {
            return res.status(404).json({message : "Todo not found"})
        }
        res.json(updatedTodo)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message})
    }

    
})

// Delete a todo item
app.use("/todos/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const deletedTodo = await todoModel.findByIdAndDelete(id)
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message})
    }
})

//start the server
port = 8000;
app.listen(port, () => {
    console.log(`Server is listening to port ${port}`)
})