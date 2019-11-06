import ErrorList from '../interfaces/IErrorList'

class ErrorListHelper {
  protected readonly errors: Array<ErrorList> = [
    { code: 0, message: 'success' }
  ]

  public getError (code: number): ErrorList {
    return this.errors[code]
  }
}

export default new ErrorListHelper()
