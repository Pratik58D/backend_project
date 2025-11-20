import {GraphQLSchema, GraphQLObjectType ,GraphQLString, GraphQLInt } from "graphql";

const users = [
   {id :"1" , fullName :"ram"  , age:20},
   {id :"2" , fullName :"hari"  , age:23},
]

// define custom a user type
const UserType = new GraphQLObjectType({
    name : "User",
    fields : {
        id : {type :GraphQLString},
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
            args : {id :{type : GraphQLString}},
            resolve(parent , args){


                 const result = users.find(user => user.id === args.id);
                 console.log(result)
                 return result;

                }
        }
    }
})

// mutations
const userMutation = new GraphQLObjectType({
    name : "Mutation",
    fields : {
        addUser :{
            type : UserType,
            args :{
                fullName:{type : GraphQLString},
                age :{type : GraphQLInt}
            },
            resolve(parent , args){
                const user = {
                    id : (users.length + 1).toString(),
                    fullName : args.fullName,
                    age : args.age
                }
                users.push(user)


                return user;
            }
        },
        updateUser :{
            type : UserType,
            args :{
                id:{type : GraphQLString},
                fullName:{type : GraphQLString},
                age :{type : GraphQLInt}
            },
            resolve(parent , args){
               
                const user = users.find(u=> u.id === args.id);
                if(user){
                    user.fullName = args.fullName || user.fullName,
                    user.age = args.age || user.age
                    console.log(user)
                    return user;
                }
                throw new Error("user not found");

            }
        },
         deleteUser :{
            type : UserType,
            args :{
                id:{type : GraphQLString},
            },
            resolve(parent , args){
               
                // const userIndex = users.findIndex(u=> u.id === args.id);
                // console.log(userIndex);
                // if(userIndex === -1){
                // throw new Error("user not found");                   
                // }

                // return users.splice(userIndex,1)[0];

                const deleteUser = users.filter(u => u.id === args.id);

                console.log(deleteUser);
                if(!deleteUser){
                throw new Error("user not found");                   
                }

                return deleteUser[0];

            }
        }

    }
})


const schema = new GraphQLSchema({
    query : RootQuery,
    mutation : userMutation
})

export default schema;