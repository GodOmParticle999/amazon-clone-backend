class ApiError extends Error{
    constructor(status,message){
        super(message)
        this.status=status
        this.success=false
        this.data=null 
        
    }
    
}

export {ApiError}