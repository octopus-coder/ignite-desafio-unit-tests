import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to create a user", async () => {
    const user = await createUserUseCase.execute({
      name: "test-user",
      email: "test@test.com",
      password: "test-password"
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a user that already exists", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "test-user",
        email: "test@test.com",
        password: "test-password"
      });

      await createUserUseCase.execute({
      name: "test-user",
      email: "test@test.com",
      password: "test-password"
    });
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
