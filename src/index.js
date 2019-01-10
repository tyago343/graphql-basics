import { GraphQLServer } from 'graphql-yoga'
import uuid4 from 'uuid/v4'
import db from './db.js'

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
        author(parent, args, {db}, info){
            return db.users.find( user => user.id === parent.author)
        },
        comments(parent, args, {db}, info){
            return db.comments.filter(comment=>comment.post === parent.id)
        }
    },
    User : {
        posts(parent, args, {db}, info) {
            return db.posts.filter(post => post.author === parent.id)
        },
        comments(parent, args, {db}, info){
            return db.comments.filter(comment=>comment.author === parent.id)
        }
    },
    Comment : {
        author(parent, args, {db}, info){
            return db.users.find(user=>user.id === parent.author)
        },
        post(parent, args, {db}, info){
            return db.posts.find(post=>post.id == parent.post)
        }
    },
    Mutation : {
        createUser(parent, args, {db}, info){
            const emailTaken = db.users.some(user=>{
                return user.email === args.data.email
            })
            if(emailTaken){
                throw new Error('This email is taken')
            }
            const user = {
                id : uuid4(), 
                ...args.data
            }
            db.users.push(user)
            return user
        },
        deleteUser(parent, args, {db}, info){
            const userIndex = db.users.findIndex(user=>user.id === args.id)
            if(userIndex == -1){
                throw new Error('User not found!!')
            }
            const deletedUsers = db.users.splice(userIndex, 1)
            db.posts = db.posts.filter(post=>{
                const match = post.author === args.id
                if(match){
                    db.comments = db.comments.filter(comment=>comment.post != post.id)
                }
                return !match
            })
            db.comments = db.comments.filter(comment=>comment.author === args.id)
            return deletedUsers[0]
        },
        deletePost(oarent, args, {db}, info){
            const postIndex = db.posts.findIndex(post=>post.id === args.id)
            if(postIndex === -1){
                throw new Error('Post not found!!')
            }
            const deletedPost = db.posts.splice(postIndex, 1)
            db.comments = db.comments.filter(comment=>comment.post !== args.id)
            return deletedPost[0]
        },
        deleteComment(parent, args, {db}, info){
            const commentIndex = db.comments.findIndex(comment=>comment.id === args.id)
            if(commentIndex === -1){
                throw new Error('Comment not found!')
            }
            return db.comments.splice(commentIndex, 1)[0]
            
        },
        createPost(parent, args, {db}, info){
            const userExist = db.users.some(user=>user.id === args.data.author)
            if(!userExist){
                throw new Error('That user doenst exist.')
            }
            const post = {
                id : uuid4(),
                ...args.data,
            }
            db.posts.push(post)
            return post
        },
        createComment(parent, args, {db}, info){
            const userExist = db.users.some(user=>user.id === args.data.author)
            const postExist = db.posts.some(post=>post.id === args.data.post && post.published)
            if(!postExist || !userExist){
                throw new Error('You cant comment this shit')
            }
            const comment = {
                id : uuid4(),
                ...args.data
            }
            db.comments.push(comment)
            return comment

        }
    },
}

const server = new GraphQLServer({
    typeDefs : './src/schema.graphql',
    resolvers,
    context : {
        db
    }
})
server.start(()=>{
    console.log('The server is up!')
})