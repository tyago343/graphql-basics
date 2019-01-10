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