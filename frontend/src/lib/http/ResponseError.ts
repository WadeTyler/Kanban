class ResponseError<T> implements Error {
    name: string;
    message: string;
    stack?: string | undefined;
    cause?: unknown;
    data: T;
    response: Response;

    constructor(message: string, data: T, response: Response) {
      this.name = "Response Error";
      this.message = message;
      this.data = data;
      this.response = response;
    }
}

export default ResponseError;