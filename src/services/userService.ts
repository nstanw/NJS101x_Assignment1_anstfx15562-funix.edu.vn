import http from "./httpService";

export interface ILoginInput {
  username: string;
  password: string;
}

class UserService {
  public async login(input: ILoginInput) {
    let result = await http.post("/user/login", input);
    return result.data;
  }
}
export default new UserService();
