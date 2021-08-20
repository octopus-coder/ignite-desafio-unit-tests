import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendTransferUseCase } from "./SendTransferUseCase";

export class SendTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: sender_id } = request.user;
    const { user_id: receiver_id } = request.params;
    const { amount, description } = request.body;

    const sendTransferUseCase = container.resolve(SendTransferUseCase);

    const transfer = await sendTransferUseCase.execute({
      sender_id,
      receiver_id,
      amount,
      description,
    });

    return response.status(201).json(transfer);
  }
}
