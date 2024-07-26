const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 4000;

// Connect to the database
mongoose.connect('mongodb://localhost:27017/batch35Items', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conn established successfully'))
.catch((err) => console.log('Error', err));

app.use(express.json());

const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
});

const Item = mongoose.model('Item', itemSchema);

// Mock Data
const insertData = async () => {
    const mockData = [
        { name: "item1", description: "item1", price: 100 },
        { name: "item2", description: "item2", price: 200 },
        { name: "item3", description: "item3", price: 300 }
    ];
    try {
        await Item.insertMany(mockData);
        console.log('Data is added successfully');
    } catch (err) {
        console.log('Error in adding data', err);
    }
};

// Routes
app.get('/details', async (req, res) => {
    try {
        const items = await Item.find({});
        res.status(200).json(items);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/details/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            res.status(404).send('Item not found');
        }
        res.status(200).json(item);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/details', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const newItem = new Item({ name, description, price });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/details/:id', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, { name, description, price }, { new: true });
        if (!updatedItem) {
            res.status(404).send('Item not found');
        }
        res.status(200).json(updatedItem);
    } catch(err){
        res.status(500).send(err)
    }
});

app.delete('/details/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            res.status(404).send('Item not found');
        }
        res.status(200).json(deletedItem);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    // Uncomment the following line to insert mock data when the server starts
    // insertData();
});

module.exports = { app, Item }; // Export app and Item
