
/**
 * Abstract authentication interface
 */
export default class IAuthHandler {
  SignUpAsync(email, password) { throw new Error("[IAuthHandler]: method not implemented") }
  SignInAsync(email, password) { throw new Error("[IAuthHandler]: method not implemented") }
  SignInGoogleAsync() { throw new Error("[IAuthHandler]: method not implemented") }
  LogOutAsync() { throw new Error("[IAuthHandler]: method not implemented") }
  ResetPasswordAsync() { throw new Error("[IAuthHandler]: method not implemented") }
}