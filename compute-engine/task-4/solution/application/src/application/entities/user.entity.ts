import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: string

  @Column({ name: 'first_name' })
  public first_name: string

  @Column({ name: 'last_name' })
  public last_name: string

  @CreateDateColumn()
  public created_on: Date
}
