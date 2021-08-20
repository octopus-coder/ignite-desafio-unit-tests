import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Statement", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create an statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "test-user",
      email: "test@test.com",
      password: "test-password",
    });

    const statement = await createStatementUseCase.execute({
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
      amount: 100,
      description: "Work",
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create statement operation from non existing user", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "test-user",
        email: "test@test.com",
        password: "test-password",
      });

      const statement = await createStatementUseCase.execute({
        user_id: "user-not-found",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Work",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to withdraw with insufficient funds user", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "test-user",
        email: "test@test.com",
        password: "test-password",
      });

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Work",
      });

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 2000,
        description: "Lamborgini",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
