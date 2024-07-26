const request=require('supertest')
const mongoose=require('mongoose')
const app=require('../app')
const Item = app.Item;
beforeAll(async () => {
    // Disconnect any existing connection
    await mongoose.disconnect();

    // Connect to the test database
    await mongoose.connect('mongodb://localhost:27017/batch35ItemsTest', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    await Item.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});
describe('GET/items',()=>{
    test('should fetch all items',async()=>{
        const items=[{name:'item1',description:'desc1',price:100}]
        await Item.insertMany(items)
        const res=await request(app).get('/items')
        expect(res.statusCode).toBe(200)
        // expect(res.body.length).toBe(1)
        expect(res.body[0].name).toBe('item1')
    })
})
describe('GET /items/:id',()=>{
    test('should fetch items by id',async()=>{
        const item=new Item({name:'item1',description:'desc1',price:100})
        await item.save()
        const res=await request(app).get(`/items/${item._id}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.name).toBe('item1')
    })
})
describe('POST/items', () => {
  test('should post the items',async()=>{
    const item={name:'item1',description:'desc1',price:100}
    const res = await request(app).post('/items').send(item);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('item1');
  })
})
describe('PUT/items/:id',()=>{
    test('should update an item',async()=>{
        const item=new Item({name:'item1',description:'desc1',price:100})
        await item.save()

        const updateData={name:'updatedItem',description:'updatedDesc',price:150};
        const res=await request(app).put(`/items/${item._id}`).send(updateData)

    })
})
describe('PUT /items/:id', () => {
  test('should update an item', async () => {
      const item = new Item({ name: 'item1', description: 'desc1', price: 100 });
      await item.save();  

      const updatedData = { name: 'updatedItem', description: 'updatedDesc', price: 150 };
      const res = await request(app).put(`/items/${item._id}`).send(updatedData);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('updatedItem');
      expect(res.body.description).toBe('updatedDesc');
      expect(res.body.price).toBe(150);
  });
});
describe('DELETE /items/:id',()=>{
  test('should delete an item',async()=>{
    const item=new Item({name:'item1',description:'desc1',price:100})
    await item.save()
    
    const res=await request(app).delete(`/items/${item._id}`);
    expect(res.statusCode).toBe(200)
    expect(res.body.name).toBe('item1');

  })
})