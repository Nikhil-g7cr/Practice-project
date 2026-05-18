import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity() export class Laptop {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    image_url:string;
}
 
