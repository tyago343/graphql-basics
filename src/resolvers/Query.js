const Query = {
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
    }
export { Query as default }