import { OperationType } from "@modules/statements/entities/Statement";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Statement Operation", () => {

  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("should be able to get statement operation", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "test-user",
      email: "test@test.com",
      password: "test-password"
    })

    const statement = await inMemoryStatementsRepository.create({
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
      amount: 100,
      description: "Work"
    })

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(statementOperation).toHaveProperty("id");
  });

  it("should not be able to get statement operation from non existing user", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "test-user",
        email: "test@test.com",
        password: "test-password"
      })

      const statement = await inMemoryStatementsRepository.create({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Work"
      });

      await getStatementOperationUseCase.execute({
        user_id: "not-found-user",
        statement_id: statement.id as string,
      });

    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  });

   it("should not be able to get statement operation from non existing user", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "test-user",
        email: "test@test.com",
        password: "test-password"
      })

      await inMemoryStatementsRepository.create({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Work"
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "something",
      });

    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  });
})
