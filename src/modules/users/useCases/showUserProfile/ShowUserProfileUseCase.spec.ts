import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to show a user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "test-user",
      email: "test@test.com",
      password: "test-password"
    }) as User;

    const userProfile = await showUserProfileUseCase.execute(user.id as string);

    expect(userProfile).toHaveProperty("id");
  });

  it("should not be able to list a non-existing user profile", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("unexisting-user-id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
})
