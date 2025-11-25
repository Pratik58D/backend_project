// custom error class

class ApiError extends Error{
    constructor(message , statusCode){
        super(message);
        this.statusCode = statusCode
        this.name = "API ERROR"    // set the error type to api error
    }
}



const asyncHandler = (fn)=>(req ,res ,next)=>{
    Promise.resolve(fn(req,res,next)).catch(next)
}


const globalErrorhandler = (err, req ,res , next) =>{
    console.error(err.stack)    // log the error stack

    if(err instanceof ApiError){
        return res.status(err.statusCode).json({
            status : false,
            message : err.message
        })
    }

    // handle mongoose validation error
    else if(err.name === "validationError"){
        return res.status(400).json({
            status : false,
            message : 'validation Error'
        })
    }


    else {
        return res.status(500).json({
            status : false,
            message : 'unexpected error'
        })

    }


}


export {ApiError , asyncHandler , globalErrorhandler}