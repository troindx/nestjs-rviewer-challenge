import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../models/user.model';
import * as mongoDB from 'mongodb';
import 'dotenv/config';
import * as md5 from 'md5'

@Injectable()
export class UsersService {
  private collection: mongoDB.Collection<User>;
  private db : mongoDB.Db;
  constructor( @Inject('ASYNC_CONNECTION') private client: mongoDB.MongoClient){
    this.db= this.client.db(process.env.DB_NAME);
    this.collection = this.db.collection("Users");
  }

  async close(): Promise<void>{
    await this.client.close();
  }

  async get(id:string):Promise<User>{
    try {
      const query = { _id: new mongoDB.ObjectId(id) };
      let dbUser = (await this.collection.findOne(query)) as unknown;
      let user = dbUser as User;
      return user;
    } catch (error) {
      console.error(`Error retrieving user ${id}`);
      console.error(error);
      return null;
    }
  }

  async getFromUserName(name:string):Promise<User>{
    try {
      const query = { name: name };
      let dbUser = (await this.collection.findOne(query)) as unknown;
      let user = dbUser as User;
      return user;
    } catch (error) {
      console.error(`Error retrieving user ${name}}`);
      console.error(error);
      return null;
    }
  }

  async insert(user:User): Promise<string>{
    try {
      //I wouldn't do this in production, but since it's not what we are testing...
      //I wouldn't store a plain password in a database either.
      user.password = md5(user.password);
      let res = await this.collection.insertOne(user);
      return res.insertedId.toString();
    }
    catch(error){
      console.error(`Error while inserting ${user.name}`);
      console.error(error);
    }
  }

  async update(user:User):Promise<number>{
    try {
      user.password = md5(user.password);
      let query = { _id: new mongoDB.ObjectId(user.id)};
      let newvalue = {$set: user };
      let updatedResult = await this.collection.updateOne(query, newvalue)
      return updatedResult.modifiedCount;
    }catch(error){
      console.error(`Error while updating ${user.id}`);
      console.error(error);
    }
  }

  async delete(id:string): Promise<number>{
    try {
      const query = { _id: new mongoDB.ObjectId(id) };
      let deletedResults = await this.collection.deleteOne(query);
      return deletedResults.deletedCount;
    } catch (error) {
      console.error(`Error while deleting user with id ${id}`);
      console.error(error);
    }
  }
}
