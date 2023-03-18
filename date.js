module.exports.getdatee=getdatee;

function getdatee()
{
    var today=new Date();
    var currentDay = today.getDay() ;
    var day="";
    var options ={
        weekday:"long",
        day:"numeric",
        month:"long"
    };
    var day=today.toLocaleDateString("en-US",options);
    return day;
}
module.exports.getdayy=getdayy;

function getdayy()
{
    
    var day="";
    var options ={
        weekday:"long",
       
    };
    var day=today.toLocaleDateString("en-US",options);
    return day;
}
console.log(module.exports);