import cors from "cors";


const configureCors = () =>{
    return  cors({
        // origin -> this will tell that  which origin you want user can access your api

        origin : (origin ,  callback) =>{
            const allowedOrigins = [
                "http://localhost:3000", // local dev
                "https://yourcustomdomain.com" //production domain
            ]
            if(!origin || allowedOrigins.indexOf(origin) !== -1){
                callback(null , true)  //giving permission so that req can be allowed
            }else{
                callback(new Error("NOt allowed by cors"))
            }             
        },
        methods :["GET" , "POST" ,"PUT" , "DELETE"],
        allowedHeaders : [
            'Content-Type',
            'Authorization',
            'Accept-version'
        ],
        exposedHeaders: ['X-Total-count', 'Content-Range'],
        credentials : true,
        preflightContinue : false,
        maxAge : 600 , // cache pre flight responses for 10 min (600 seconds) -> avoid sending options requests multiple times
        optionsSuccessStatus : 204

    })
}

export default configureCors;