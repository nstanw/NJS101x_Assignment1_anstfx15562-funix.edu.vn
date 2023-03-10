class AuthenticationOutput {
  token!: string;
  userId!: string;
  username!: string;
  role!: string;
  name!: string;
  path!:string;
  isLogin?: boolean;
}
export default AuthenticationOutput;
