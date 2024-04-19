import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column({unique:true})
  name:string;

  @Column({unique:true})
  email:string;

  @Column({unique:true})
  username:string;

  @Column()
  password:string;

  @Column()
  verificationToken:string;

  @Column({default:false})
  isVerified:boolean;
}