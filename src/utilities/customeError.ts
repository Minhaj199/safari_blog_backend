

export function customError(message:string='user not found',statusCode:number=400){
    const err=new Error(message) as any
    err.code=statusCode
    return err
}