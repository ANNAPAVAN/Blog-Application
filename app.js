const express = require('express')
const mongoose = require('mongoose')
// const morgan = require('morgan')
const Blog = require('./models/blog')


// express app 
const app = express() 

// MongoDB connection
mongoose.connect('mongodb+srv://pavananna:Mongodb134@new.bes8xs6.mongodb.net/notes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
    app.listen(3333, () => {
        console.log('Server is running on http://localhost:3333/');
    });
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

//register view engines
app.set("view engine", "ejs")


// with  morgan middleware & static files
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))


app.get('/blogs/create',(req,res)=>{
    res.render('create',{title_name: 'Blog'});
})


app.get('/',(req,res) => {
    res.redirect('/blogs')
})

app.get('/about',(req,res) => {

    res.render('about',{title_name: 'About'});  // it will use ejs view engine

})

// blog routes 
app.get('/blogs',(req,res)=>{
    Blog.find().sort({createdAt: -1})
        .then((result)=>{
            res.render('index',{title_name:'All Blogs', blogs: result})
        })
        .catch((err)=>{
            console.log(err)
        })
})

app.post('/blogs',(req,res)=>{
    // console.log(req.body);
    const blog = new Blog(req.body);

    blog.save()
        .then(()=>{
            res.redirect('/blogs');
        })
        .catch((err)=>{
            console.log(err)
        })
})

app.get('/blogs/:id', (req,res)=>{
    const id = req.params.id;
    // console.log(id)
    Blog.findById(id)
        .then((result)=>{
            res.render('details',{blog:result, title_name:"Blog Details"})
        })
        .catch((err)=>{
            console.log(err)
        }) 
})

app.delete('/blogs/:id',(req,res) => {
    const id=req.params.id;

    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({redirect: '/blogs'})
        })
        .catch((err)=>{
            console.log(err)
        }) 

})

// 404 page
// it should be always lasttttt or at Bottommmmmm
app.use((req,res)=>{
    res.status(404).render("404",{title_name: '404'})
})


