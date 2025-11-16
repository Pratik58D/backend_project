import {GraphQLSchema, GraphQLObjectType ,GraphQLString, GraphQLBoolean, GraphQLInt } from "graphql";


// define a user type
const UserType = new GraphQLObjectType({
    name : "User",
    fields : {
        fullName : {type : GraphQLString},
        age : {type : GraphQLInt}
    }
})

// have to provide name and fields
const RootQuery = new GraphQLObjectType({
    name : "RootQueryType",
    fields : {
        hello :{
            type : GraphQLString,
            resolve(){
                return "hello this is graphQl server..."
            }
        },
        user : {
            type: UserType,
            resolve(){
                return {fullName : "pratik devkota" , age: 23}
            }
        }
    }
})

const schema = new GraphQLSchema({
    query : RootQuery
})

export default schema;