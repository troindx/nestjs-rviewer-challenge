import { Inject, Injectable } from '@nestjs/common';
import * as mongoDB from 'mongodb';
import 'dotenv/config';
import { UserLists } from 'src/models/user-lists.model';
import { SongList } from 'src/models/song-list.model';
import { Song } from 'src/models/song.model';

@Injectable()
export class UserListsService {
  private collection: mongoDB.Collection<UserLists>;
  private db : mongoDB.Db;
  constructor( @Inject('ASYNC_CONNECTION') private client: mongoDB.MongoClient){
    this.db= this.client.db(process.env.DB_NAME);
    this.collection = this.db.collection("UserLists");
  }

  async close(): Promise<void>{
    await this.client.close();
  }

  async get(userId:string): Promise<UserLists>{
    try {
      const query = { userId: userId};
      let dbUser = (await this.collection.findOne(query)) as unknown;
      let userLists:UserLists = dbUser as UserLists;
      return userLists;
    } catch (error) {
      console.error(`Error retrieving userlists for ${userId}`);
      console.error(error);
      return null;
    }  
  }

  async getList(userId:string,listId : string):Promise<SongList>{
    try {
      let userLists = await this.get(userId);
      return userLists.lists.find(element => element.listId == listId)
    } catch (error) {
      console.error(`Error retrieving list ${listId}`);
      console.error(error);
      return null;
    }
  }

  async addListToUser(userId : string, list: SongList) : Promise<boolean>{
    try {
      let userLists = await this.get(userId);
      if (userLists){
        await userLists.lists.push(list);
        await this.update(userLists);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error while adding list to ${userId}`);
      console.error(error);
      return false;
    }
  }

  async addSongToList(userId : string, listId: string, song:Song): Promise<boolean>{
    try {
      let userLists = await this.get(userId);
      if (userLists){
        let list:SongList = userLists.lists.find(element => element.listId == listId)
        if (list){
          list.songs.push(song);
          await this.update(userLists);
          return true
        }
        else return false;
      }
      return false;
    } catch (error) {
      console.error(`Error while adding song ${song.title} to list ${listId}`);
      console.error(error);
      return false;
    }
  }
  
  async update(userList:UserLists):Promise<number>{
    try {
      let query = { userId: userList.userId};
      let newvalue = {$set: userList };
      let updatedResult = await this.collection.updateOne(query, newvalue)
      return updatedResult.modifiedCount;
    }catch(error){
      console.error(`Error while updating UserList ${userList.userId}`);
      console.error(error);
    }
  }

  async delete(userId:string): Promise<number>{
    try {
      const query = { userId: userId };
      let deletedResults = await this.collection.deleteOne(query);
      return deletedResults.deletedCount;
    } catch (error) {
      console.error(`Error while deleting UserList ${userId}`);
      console.error(error);
    }
  }

  async insert(userLists:UserLists): Promise<string>{
    try {
      let res = await this.collection.insertOne(userLists);
      return res.insertedId.toString();
    }
    catch(error){
      console.error(`Error while inserting ${userLists.userId}`);
      console.error(error);
    }
  }
}
