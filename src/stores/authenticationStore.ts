import { action, observable } from "mobx";
import AuthenticationOutput from "../Dtos/AuthenticationOutput";
import userService, { ILoginInput } from "../services/userService";
import cookie from "../ultils/cookie";
import Cookie from "../ultils/cookie";

class AuthenticationStore {
  @observable authentication = new AuthenticationOutput();

  @action public isLogin(): boolean {
    const login: any = localStorage.getItem("login");
    const user = JSON.parse(login);
    if (!user?.username  || !user) {
      return false;
    }
    this.authentication = user;
    return true;
  }

  @action
  public login = async (input: ILoginInput) => {
    let result = await userService.login(input);
    this.authentication = result;
    localStorage.setItem("login", JSON.stringify(result));
  };
}

export default AuthenticationStore;
