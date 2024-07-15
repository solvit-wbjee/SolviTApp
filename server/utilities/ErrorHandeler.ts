class ErrorHandeler extends Error{
    statusCode: Number;

    constructor(message, StatusCode:Number) {
        super(message)
        this.statusCode = StatusCode;
        Error.captureStackTrace(this,this.constructor)
    }
}
export default  ErrorHandeler;