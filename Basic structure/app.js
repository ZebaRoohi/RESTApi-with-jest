// index.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 4000;

app.use(express.json());

const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number
});

const Item = mongoose.model('Item', itemSchema);

app.get('/details', async (req, res) => {
    try {
        const items = await Item.find({});
        res.status(200).json(items);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.get('/details/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).send('Item not found');
        }
        res.status(200).json(item);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.post('/details', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const newItem = new Item({ name, description, price });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.put('/details/:id', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, { name, description, price }, { new: true });
        if (!updatedItem) {
            return res.status(404).send('Item not found');
        }
        res.status(200).json(updatedItem);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.delete('/details/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).send('Item not found');
        }
        res.status(200).json(deletedItem);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

mongoose.connect('mongodb://localhost:27017/batch35Items')
    .then(() => console.log('Database connected'))
    .catch(err => console.log('Error connecting to database', err));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

module.exports = { app, Item }; // Ensure these are exported
