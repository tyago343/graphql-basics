import { GraphQLServer } from 'graphql-yoga'
import uuid4 from 'uuid/v4'

//scalar types - String, integer, float, boolean, ID
//Demo user data
var users = [{
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
var posts = [{
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
var comments = [
    {
        id : '14',
        text : 'Ex pariatur adipisicing in adipisicing labore aute tempor deserunt.',
        author : '1',
        post : '3'
    },
    {
        id : '122',
        text : 'Laborum adipisicing consectetur quis est pariatur reprehenderit in eu esse exercitation culpa.',
        author : '1',
        post : '3'
    },
    {
        id : '343',
        text : 'Est laboris magna reprehenderit exercitation labore aute eu dolor.',
        author : '3',
        post : '2'
    },
    {
        id : '64',
        text : 'Ullamco ea commodo quis sit sunt et dolor nisi elit laborum minim anim laborum dolor.',
        author : '2',
        post : '1'
    }
]
//type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String) : [User!]!
        posts(query: String) : [Post!]!
        comments: [Comment!]!
        post : Post!
        me : User!
    }
    type Mutation {
        createUser(data : CreateUserInput) : User!
        createPost(data : CreatePostInput) : Post!
        createComment(data: CreateCommentInput) : Comment!
        deleteUser(id: ID!) : User!
        deletePost(id : ID!) : Post!
        deleteComment(id :ID!) : Comment!
    }

    input CreateUserInput {
        name : String!,
        email : String!
        age : Int
    }
    input CreatePostInput {
        title : String!,
        body : String!,
        published : Boolean!,
        author : ID!
    }
    input CreateCommentInput {
        text : String!,
        author : ID!,
        post : ID!
    }
    type User {
        id : ID!
        name : String!
        email : String!
        age : Int
        posts : [Post!]!
        comments : [Comment!]!
    }
    type Post {
        id : ID!
        title : String!
        body : String!
        published : Boolean!
        author : User!
        comments : [Comment!]!
    }
    type Comment {
        id : ID!
        text : String!
        author : User!
        post : Post!

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
        comments(parent, args, ctx, info){
            return comments
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
        },
        comments(parent, args, ctx, info){
            return comments.filter(comment=>{
                return comment.post === parent.id
            })
        }
    },
    User : {
        posts(parent, args, ctx, info) {
            return posts.filter(post => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info){
            return comments.filter(comment=>{
                return comment.author === parent.id
            })
        }
    },
    Comment : {
        author(parent, args, ctx, info){
            return users.find(user=>{
                return user.id === parent.author
            })
        },
        post(parent, args, ctx, info){
            return posts.find(post=>{
                return post.id == parent.post
            })
        }
    },
    Mutation : {
        createUser(parent, args, ctx, info){
            const emailTaken = users.some(user=>{
                return user.email === args.data.email
            })
            if(emailTaken){
                throw new Error('This email is taken')
            }
            const user = {
                id : uuid4(), 
                ...args.data
            }
            users.push(user)
            return user
        },
        deleteUser(parent, args,ctx, info){
            const userIndex = users.findIndex(user=>user.id === args.id)
            if(userIndex == -1){
                throw new Error('User not found!!')
            }
            const deletedUsers = users.splice(userIndex, 1)
            posts = posts.filter(post=>{
                const match = post.author === args.id
                if(match){
                    comments = comments.filter(comment=>comment.post != post.id)
                }
                return !match
            })
            comments = comments.filter(comment=>comment.author === args.id)
            return deletedUsers[0]
        },
        deletePost(oarent, args, ctx, info){
            const postIndex = posts.findIndex(post=>post.id === args.id)
            if(postIndex === -1){
                throw new Error('Post not found!!')
            }
            const deletedPost = posts.splice(postIndex, 1)
            comments = comments.filter(comment=>comment.post !== args.id)
            return deletedPost[0]
        },
        deleteComment(parent, args, ctx, info){
            const commentIndex = comments.findIndex(comment=>comment.id === args.id)
            if(commentIndex === -1){
                throw new Error('Comment not found!')
            }
            return comments.splice(commentIndex, 1)[0]
            
        },
        createPost(parent, args, ctx, info){
            const userExist = users.some(user=>user.id === args.data.author)
            if(!userExist){
                throw new Error('That user doenst exist.')
            }
            const post = {
                id : uuid4(),
                ...args.data,
            }
            posts.push(post)
            return post
        },
        createComment(parent, args, ctx, info){
            const userExist = users.some(user=>user.id === args.data.author)
            const postExist = posts.some(post=>post.id === args.data.post && post.published)
            if(!postExist || !userExist){
                throw new Error('You cant comment this shit')
            }
            const comment = {
                id : uuid4(),
                ...args.data
            }
            comments.push(comment)
            return comment

        }
    },
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})
server.start(()=>{
    console.log('The server is up!')
})