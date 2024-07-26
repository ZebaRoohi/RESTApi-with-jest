const request = require('supertest');
const mongoose = require('mongoose');
const{app,Item}=require('../index')

// Set up the database connection before running any tests
beforeAll(async () => {
    // Disconnect any existing connections to avoid issues with multiple connection attempts
    await mongoose.disconnect();

    // Connect to the test database
    await mongoose.connect('mongodb://localhost:27017/batch35ItemsTest', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

// Clear the database before each test to ensure test isolation
beforeEach(async () => {
    await Item.deleteMany({});
});

// Close the database connection after all tests are completed
afterAll(async () => {
    await mongoose.connection.close();
});

describe('GET /details', () => {
    test('should fetch all items', async () => {
        const items = [
            { name: 'item1', description: 'desc1', price: 100 },
            { name: 'item2', description: 'desc2', price: 200 }
        ];
        await Item.insertMany(items);

        const res = await request(app).get('/details');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body[0].name).toBe('item1');
        expect(res.body[1].name).toBe('item2');
    });
});

describe('GET /details/:id',()=>{
    test('should fetch an item by id',async()=>{
        const item=new Item({name:'item1',description:'desc1',price:100})
        await item.save()
        const res=await request(app).get(`/details/${item._id}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.name).toBe('item1')
    })
    // test('should return 404 for a non-existence item',async()=>{
    //     const res=await request(app).get('/details/64b865fda66019b93f3bcb2d') //Example invalid id
    //     expect(res.statusCode).toBe(404)
    // })
})
describe('POST/details',()=>{
    test('should create a new item',async()=>{
        const item={name:'item1',description:'desc1',price:100}
        const res=await request(app).post('/details').send(item)

        expect(res.statusCode).toBe(201)
        expect(res.body.name).toBe('item1')

        //verify item in db
        const savedItem=await Item.findById(res.body._id)
        expect(savedItem).not.toBeNull()
        expect(savedItem.name).toBe('item1')
    })
})
describe('PUT /details/:id', () => {
    test('should update an item', async () => {
        const item = new Item({ name: 'item1', description: 'desc1', price: 100 });
        await item.save();

        const updatedData = { name: 'updatedItem', description: 'updatedDesc', price: 150 };
        const res = await request(app).put(`/details/${item._id}`).send(updatedData);

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('updatedItem');
        expect(res.body.description).toBe('updatedDesc');
        expect(res.body.price).toBe(150);
    })
    // test('should return 404 for updating a non-existent item', async () => {
    //     const res = await request(app).put('/details/64b865fda66019b93f3bcb2d').send({
    //         name: 'updatedItem', description: 'updatedDesc', price: 150
    //     });
    //     expect(res.statusCode).toBe(404);
    // });

})
describe('DELETE /details/:id', () => {
    test('should delete an item', async () => {
        const item = new Item({ name: 'item1', description: 'desc1', price: 100 });
        await item.save();

        const res = await request(app).delete(`/details/${item._id}`);
        expect(res.statusCode).toBe(200);

        // Verify that the item no longer exists in the database
        const deletedItem = await Item.findById(item._id);
        expect(deletedItem).toBeNull();
    })
})