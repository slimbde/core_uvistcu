import IAuthHandler from "./IAuthHandler";

class SQLiteAuthHandler extends IAuthHandler {
  static instance = null

  constructor() {
    super()
  }

  static GetInstance() {
    if (!this.instance)
      this.instance = new SQLiteAuthHandler()

    return this.instance
  }

  SignUpAsync(email, password) { }
  SignInAsync(email, password) { }
  SignInGoogleAsync() { }
  LogOutAsync() { }
  ResetPasswordAsync() { }
}

export default SQLiteAuthHandler.GetInstance()