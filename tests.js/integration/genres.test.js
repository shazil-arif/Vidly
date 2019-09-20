const request = require("supertest");
const {genres} = require("../../models/genres")
const jwt = require("jsonwebtoken");
const {users} = require("../models/users");
let server;

describe('/api/genres',()=>{
    beforeEach(()=>{server = require("../../index")});
    afterEach(async()=>{
        server.close()
        await genres.remove({})
    });

    describe('GET / getting all genres',()=>{
        it("should return all genres",async()=>{

            genres.collection.insertMany([
                {name:"Genre1"},
                {name:"Genre2"}
            ]);

            const res = await request(server).get('/api/genres');

            expect(res.status).toBe(200);

            expect(res.body.some(g => g.name==='Genre1')).toBeTruthy();
        })
    })

    describe('GET /:id - get a single genre given its id',()=>{
        it("should return a single genre matching the given id",async()=>{
            const genre = new genres({
                name:'Genre1'
            });
           
            await genre.save();

            const res = await request(server).get(`/api/genres/${genre._id}`);

            expect(res.status).toBe(200);
            expect(res.body.name).toBe(genre.name);

        })    
        it("should return 404 error if invalid object id is passed",async()=>{
            const res = await request(server).get(`/api/genres/1`);
            

            expect(res.status).toBe(404);

        })  
    })

    describe('POST / - create a new genre',()=>{
        it('should return 401 forbidden error if no access token is provided',async()=>{
            const res = await request(server).post('/api/genres').send({name:'new Genre'})
            expect(res.status).toBe(401);
        })

        it('should return 400 bad request if a invalid token is given',()=>{


        })

        it('should return 400 bad request if no name property is given in the body of the request',()=>{

        })

        it('should return 200 ok status and a genre object with name equal to the specified name',()=>{
            
        })
    })
})