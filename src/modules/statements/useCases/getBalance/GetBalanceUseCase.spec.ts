import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {

  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  })

  it("should be able to get statement operation", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "test-user",
      email: "test@test.com",
      password: "test-password"
    })

    await inMemoryStatementsRepository.create({
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
      amount: 100,
      description: "Work"
    });

    await inMemoryStatementsRepository.create({
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
      amount: 30,
      description: "Food"
    });


    const balanceResponse = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balanceResponse).toHaveProperty("balance");
    expect(balanceResponse.statement).toHaveLength(2);
    expect(balanceResponse.balance).toBe(70);
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

    await getBalanceUseCase.execute({
      user_id: "non-existing-user",
    });

    }).rejects.toBeInstanceOf(GetBalanceError)
  });
})
