
import { User } from 'src/models/user.model';
import { DbModule } from '../../db/db.module';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { UserLists } from 'src/models/user-lists.model';
import { Song } from 'src/models/song.model';
import { SongList } from 'src/models/song-list.model';
import { UserListsService } from '../user-lists.service';

describe('UserLists Service', () => {
  //Define Data for testing
  let userLists:UserLists = {
    userId : new ObjectId(Math.floor(Math.random()*5000)).toString(),
    lists : new Array<SongList>()
  };

  let nonexistentUserList:UserLists = {
    userId : new ObjectId(Math.floor(Math.random()*5000)).toString(),
    lists : new Array<SongList>()
  };

  let song1 :Song = {
    title : "Nothing else matters",
    artist : "Metalica"
  };

  let song2 : Song = {
    title: "Smells like teen spirit",
    artist: "Nirvana"
  };

  let song3 : Song = {
    title: "Te felicito",
    artist : "Shakira"
  };

  let song4: Song = {
    title : "Get Lucky",
    artist : "Daft Punk"
  }

  let song5: Song = {
    title : "The Reason",
    artist : "Hoobastank"
  }

  let list1 : SongList = {
    listId : new ObjectId(Math.floor(Math.random()*5000)).toString(),
    songs : [ song1, song2, song3]
  };

  let list2 : SongList = {
    listId : new ObjectId(Math.floor(Math.random()*5000)).toString(),
    songs : [ song4, song5]
  }

  let nonExistentList : SongList ={
    listId : new ObjectId(Math.floor(Math.random()*5000)).toString(),
    songs : [ song1, song5, song3]
  }

  let userListsService : UserListsService;
  let insertedId:string;
  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DbModule],
      providers: [UserListsService]
    }).compile();
    userListsService = app.get<UserListsService>(UserListsService);


  });

  afterAll(async () =>{
    await userListsService.close();
  })

  describe('Insert', () => { 
    it('Should create the document on the UserLists collection', async () => {
      insertedId = await userListsService.insert(userLists);
      expect (insertedId).toBeDefined();
    });
  });

  describe('Add a list', () => { 
    it('Adds a list properly', async () => {
      let wasInserted = await userListsService.addListToUser(userLists.userId,list1);
      expect (wasInserted).toBeTruthy();
      let updatedUserLists = await userListsService.get(userLists.userId);
      expect (updatedUserLists.lists.length).toBe(1);
    });
  });

  describe('Get List', () => { 
    it('Gets the lists properly', async () => {
      let testUserLists = await userListsService.get(userLists.userId);
      expect(testUserLists.lists.length).toBe(1);
      expect(testUserLists.lists[0]).toEqual(list1);
    });

    it('Does not get a list that does not exist', async () => {
      let list = await userListsService.getList(userLists.userId,nonExistentList.listId)
      expect (list).toBeFalsy();
    });
  });


  describe('Add a song to a list', () => { 
    it('Adds a song to an existing list', async () => {
      let wasInserted= await userListsService.addSongToList(userLists.userId,list1.listId,song4);
      expect (wasInserted).toBeTruthy();
      let updatedList = await userListsService.getList(userLists.userId,list1.listId)
      expect (updatedList.songs.length).toBe(4);
    });

    it('Does not add a song to an unexistent userList', async () => {
      let wasInserted= await userListsService.addSongToList(nonexistentUserList.userId,list1.listId,song4);
      expect (wasInserted).toBeFalsy();
    });
  });

  describe('Add another list', () => { 
    it('Adds a second list properly', async () => {
      let wasInserted = await userListsService.addListToUser(userLists.userId,list2);
      expect (wasInserted).toBeTruthy();
      let updatedUserLists = await userListsService.get(userLists.userId);
      expect (updatedUserLists.lists.length).toBe(2);
      expect (updatedUserLists.lists[1]).toEqual(list2);
    });
  });

  describe('Adding to non existent users', () => { 
    it('Does not add a list to a non existent user', async () => {
      let wasInserted = await userListsService.addListToUser(nonexistentUserList.userId,list2);
      expect (wasInserted).toBeFalsy();
    });
  });

  describe('Delete', () => { 
    it('Should delete the document on the UserLists collection', async () => {
      let deletedAmmount = await userListsService.delete(userLists.userId);
      expect (deletedAmmount).toBe(1);
    });
  });
 

});
