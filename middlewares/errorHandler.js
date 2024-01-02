const errorHandler=(error,_,res,next)=>{
    res.status(error.status||500).json({
        status:error.status||500,
        message:error.message||"something went wrong"
})
next(res)
}

export default errorHandler