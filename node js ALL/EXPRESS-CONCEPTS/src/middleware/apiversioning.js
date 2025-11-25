const urlVersioning = (version) =>(req,res ,next) =>{
    if(req.path.startWith(`/api/${version}`)){
        next();
    }else {
        res.status(404).json({
            success : false,
            error : "API version is not supported"
        })
    }
}


const headerVersioning = (version) =>(req,res ,next) =>{
    if(req.get('Accept-Version') === version){
        next();
    }else {
        res.status(404).json({
            success : false,
            error : "API version is not supported"
        })
    }
}


