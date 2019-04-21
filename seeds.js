var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var data=[
    {
        name:"Himalaya",
        image:"https://cdn.britannica.com/s:700x450/74/114874-004-297B207E.jpg",
        description:"Snowy Mountains"
    },
    {
        name:"Wye valley Camping",
        image:"https://maggievalleynclife.com/wp-content/uploads/2017/08/14IMG_8766-2.jpg",
    
        description:"camp on farm"
    },
    {
        name:"Night Tent",
        image:"https://uk.oisans.com/wp-content/uploads/sites/3/2017/05/les-2-alpes-slider01.jpg",
        description:"raat mein camping"
    }
]
function seedDB(){
    Campground.remove({},function(err){
        if(err){
            console.log("error while removing");
    
        }
        data.forEach(function(seed){
            Campground.create(seed,function(err,campground){

                if(err){
                    console.log(err);
                }else{
                    console.log("seeded");
                    Comment.create({
                        text:"This is a great place ,but i wish der was internet",
                        author:"Homer"
                    },function(err,comment){
    
                        if(err){
                            console.log(err);
                        }
                        else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log("created new comment");
                        }
                       
    
                    })
                }
               

            })

            })
    })

          
   
}

module.exports=seedDB;
