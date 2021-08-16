import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let test_user: ICreateUserDTO;

describe("Authenticate User", () => {

  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    test_user = {
      name: "test-user",
      email: "test@test.com",
      password: "test-password"
    };

    await createUserUseCase.execute(test_user);
  })

  it("should be able to authenticate a user", async () => {
    const response = await authenticateUserUseCase.execute(
      {
        email: test_user.email,
        password: test_user.password
    })

    expect(response).toHaveProperty("token");
    expect(response).toHaveProperty("user");
    expect(response.user).toHaveProperty("id");
  });

  it("should not be able to authenticate a non-existing user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute(
      {
        email: "non-existing-user",
        password: test_user.password
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });

  it("should not be able to authenticate a user with wrong password", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute(
      {
        email: test_user.email,
        password: "wrong-password"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });

})
