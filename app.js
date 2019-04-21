var express= require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var Campground=require("./models/campground");
var seedDB=require("./seeds");
var Comment=require("./models/comment");
var User=require("./models/user");



mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true });

//
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");

app.use(express.static(__dirname+"/public"));
seedDB();

//passport config

app.use(require("express-session")({
    secret:"once again rusty is the best dog",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
})




app.get("/",function(req,res){

res.render("landing");

})

app.get("/campgrounds",function(req,res){
     console.log(req.user);
    Campground.find({},function(err,allCampground){
     if(err){
         console.log("Something went wrong");
     }
     else{
        res.render("campgrounds/index",{campgrounds:allCampground,currentUser:req.user});
     
         }
    
    })

    

})

app.post("/campgrounds",function(req,res){
     

   var name= req.body.name;
   var image= req.body.image;
   var desc=req.body.description;
   // console.log(name+" "+image);
   var newCampground ={name:name,image:image,description:desc}
   
   console.log(newCampground);
   Campground.create(newCampground,function(err,newlycreated){
       if(err){
           console.log(err);
       }
       else{
          // console.log(newlycreated);
           res.redirect("/campgrounds");
       }
   })

})

app.get("/campgrounds/new",function(req,res){
  
     res.render("campgrounds/new");

})

app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){

        if(err){
            console.log(err);
        }
        else{
            //console.log(foundCampground);
            res.render("campgrounds/show",{campground:foundCampground});
        }
    })
})

//comment routes
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){

            if(err){
                console.log("comment route error");
            }

            else{
                res.render("comments/new",{campground:campground});
            }



    })
    
})


app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log("error at posrt comment route");
            res.redirect("/campground");
        }
        else{
            
           Comment.create(req.body.comment,function(err,comment){
               if(err){
                   console.log(err);
               }
               else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id)
               }
           })    
        }
    })
})

//AUTH ROUTES
app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});

    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        })
    })
})

//login route

app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/login",passport.authenticate("local",{
       
    successRedirect:"/campgrounds",
    failureRedirect:"/login"


}),(req,res)=>{

})

//logout route

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/campgrounds");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT||3000,function(){

     console.log("server has started");


})
