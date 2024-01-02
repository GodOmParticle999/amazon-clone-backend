export const excludePassword=(obj)=>{
    // converting mongodb doc object to plain object and destructuring
     const {password:undefined,...rest}=  obj.toObject()  
     return rest
}