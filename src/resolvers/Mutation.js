import uuid4 from 'uuid/v4'

const Mutation = {
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
        updateUser(parent, args, {db}, info){
            const user = db.users.find(user=> user.id === args.id)
            if(!user){
                throw new Error('User not found!')
            }
            if (typeof args.data.email === 'string'){
                const emailTaken = db.users.some(user=>user.email === args.data.email)
                if(emailTaken){
                    throw new Error('Email taken')
                }
                user.email = args.data.email
            }
            if(typeof args.data.name === 'string'){
                user.name = args.data.name
            }
            if(typeof args.data.age !== 'undefined'){
                user.age = args.data.age
            }
            return user
        },
        updatePost(parent, args, {db}, info){
            const { id, data } = args
            const { title, body, published } = data
            const post = db.posts.find(post=>post.id === id)
            if(!post){
                throw new Error('Post not found!')
            }
            if(typeof title === 'string'){
                post.title = title
            }
            if(typeof body === 'string'){
                post.body = body
            }
            if(typeof published === 'boolean'){
                post.published = published
            }
            return post
        },
        updateComment(parent, args, {db}, info){
            const { id, text } = args
            const comment = db.comments.find(comment=>comment.id===id)
            if(!comment){
                throw new Error('That comments doesnt exist!!')
            }
            if(typeof text === 'string'){
                comment.text = text
            }
            return comment
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
    }
export { Mutation as default }