import { GraphQLServer } from 'graphql-yoga'

//scalar types - String, integer, float, boolean, ID
//Demo user data
const users = [{
    id : '1',
    name : 'Santiago',
    email : 'santiago@mail.com',
    age : 26
},{
    id : '2',
    name : 'Sarah',
    email : 'sarah@mail.com',
    age : 22
},{
    id : '3',
    name : 'Pat',
    email : 'pat@mail.com'
}]
const posts = [{
    id : '1',
    title : 'título 1',
    body : 'Body 1',
    published : false,
    author : '1'
},{
    id : '2',
    title : 'título 2',
    body : 'Body 2',
    published : false,
    author : '1'
},{
    id : '3',
    title : 'título 3',
    body : 'Body 3',
    published : true,
    author : '2'
}]
//type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String) : [User!]!
        posts(query: String) : [Post!]!
        post : Post!
        me : User!
    }
    type User {
        id : ID!
        name : String!
        email : String!
        age : Int
        posts : [Post!]!
    }
    type Post {
        id : ID!
        title : String!
        body : String!
        published : Boolean!
        author : User!
    }
` 
//Resolvers
const resolvers = {
    Query: {
        posts(parent, args, ctx, info){
            if(!args.query){
                return posts
            }
            return posts.filter(post=>{
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch
            })
        },
        users(parent, args, ctx, info){
            if(!args.query){
                return users
            }
            return users.filter(user=>{
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        post() {
           return {
               id : '123098',
               title : 'A post title',
               body : 'This is a post body, here we need to put some content',
               published : false
           }
        },
        me() {
            return {
               id : '123098',
               name : 'Santiago',
               email : 'santiago@htoma.com'
            }
        }
    },
    Post : {
        author(parent, args, ctx, info){
            return users.find( user => {
                return user.id === parent.author
            })
        }
    },
    User : {
        posts(parent, args, ctx, info) {
            return posts.filter(post => {
                return post.author === parent.id
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})
server.start(()=>{
    console.log('The server is up!')
})