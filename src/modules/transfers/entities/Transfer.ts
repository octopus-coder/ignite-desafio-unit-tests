import { User } from "../../users/entities/User";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("transfers")
export class Transfer {
  @PrimaryColumn("uuid")
  id?: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "sender_id" })
  sender: User;

  @Column()
  sender_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "receiver_id" })
  receiver: User;

  @Column()
  receiver_id: string;

  @Column()
  amount: number;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
