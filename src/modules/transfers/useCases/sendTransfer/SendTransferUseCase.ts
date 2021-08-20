import { IStatementsRepository } from "../../../../modules/statements/repositories/IStatementsRepository";
import { ICreateTransferDTO } from "../../../../modules/transfers/dtos/ICreateTransferDTO";
import { Transfer } from "../../../../modules/transfers/entities/Transfer";
import { ITransfersRepository } from "../../../../modules/transfers/repositories/ITransfersRepository";
import { IUsersRepository } from "../../../../modules/users/repositories/IUsersRepository";
import { injectable, inject } from "tsyringe";
import { SendTransferError } from "./SendTransferError";
import { OperationType } from "../../../../modules/statements/entities/Statement";

@injectable()
class SendTransferUseCase {
  constructor(
    @inject("TransfersRepository")
    private transfersRepository: ITransfersRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}
  async execute({
    sender_id,
    receiver_id,
    amount,
    description,
  }: ICreateTransferDTO): Promise<Transfer> {
    const sender = await this.usersRepository.findById(sender_id);

    if (!sender) {
      throw new SendTransferError.SenderNotFound();
    }

    const receiver = await this.usersRepository.findById(receiver_id);

    if (!receiver) {
      throw new SendTransferError.ReceiverNotFound();
    }

    const { balance: sender_balance } =
      await this.statementsRepository.getUserBalance({
        user_id: sender_id,
      });

    if (sender_balance < amount) {
      throw new SendTransferError.InsufficientFunds();
    }

    await this.statementsRepository.create({
      user_id: receiver.id,
      type: OperationType.TRANSFER,
      sender_id,
      amount,
      description,
    });

    await this.statementsRepository.create({
      user_id: sender.id,
      type: OperationType.WITHDRAW,
      amount,
      description,
    });

    const transfer = await this.transfersRepository.create({
      sender_id,
      receiver_id,
      amount,
      description,
    });

    return transfer;
  }
}

export { SendTransferUseCase };
