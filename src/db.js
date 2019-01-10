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
const comments = [
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
const db = {
    users,
    posts,
    comments
}
export { db as default }