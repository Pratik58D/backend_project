import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from "./schema/schema.js"

const app = express();

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true,
    
}))
    

app.listen(5555 , ()=>{
    console.log("server is running....")
});