import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserLists } from '../src/models/user-lists.model';
import { ObjectId } from 'mongodb';
import { SongList } from '../src/models/song-list.model';
import { UserListsService } from '../src/modules/user-lists/user-lists.service';
import { Song } from 'src/models/song.model';
import { UsersService } from '../src/modules/users/users.service';
import { User } from '../src/models/user.model';

describe('UserListsController (e2e)', () => {
  let app: INestApplication;
  //Define data for testing
  let username = "juan";
  let password = "password";
  let user:User = {
    name:username,
    password:password
  }

  let username2 = "paco";
  let password2 = "thisisart";
  let user2: User = {
    name: username2,
    password: password2
  };

  let userLists:UserLists = {
    userId : "",
    lists : new Array<SongList>()
  }

  let userLists2:UserLists = {
    userId : "",
    lists : new Array<SongList>()
  }

  let nonExistenUserList:UserLists = {
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

  let song6 : Song = {
    title : "Time",
    artist : "Hans Zimmer"
  }

  let list1 : SongList = {
    listId : new ObjectId(Math.floor(Math.random()*5340)).toString(),
    songs : [ song1, song2, song3]
  };

  let list2 : SongList = {
    listId : new ObjectId(Math.floor(Math.random()*5429)).toString(),
    songs : [ song4, song5]
  }

  let list3: SongList = {
    listId : new ObjectId(Math.floor(Math.random()*4999)).toString(),
    songs : [ song6, song5]
  }

  let list4: SongList = {
    listId : new ObjectId(Math.floor(Math.random()*5001)).toString(),
    songs : [ song1, song3, song6]
  }

  let userListsService : UserListsService;
  let insertedId:string;
  let insertedId2 : string;
  let usersService : UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    userListsService = app.get<UserListsService>(UserListsService);
    usersService = app.get<UsersService>(UsersService);

    //Insert the users in the users collection and in the usersList collection
    insertedId = await usersService.insert(user);
    user.id = insertedId;

    userLists.userId = insertedId;
    await userListsService.insert(userLists);

    insertedId2 = await usersService.insert(user2);
    user2.id = insertedId2;

    userLists2.userId = insertedId2;
    await userListsService.insert(userLists2);

  });
  
  afterAll( async () =>{
    //We delete all of the useless testData we have introduced and close database connections
    await usersService.delete(insertedId);
    await userListsService.delete(insertedId);
    await usersService.delete(insertedId2);
    await userListsService.delete(insertedId2);
    await usersService.close();
    await userListsService.close();
  });
  
  describe('/users/:userid/lists (GET) authorized', () => { 
    it('Returns an empty song list set', async () => {
      let response = await request(app.getHttpServer()).get('/users/'+user.id+'/lists')
      .auth(username, password, {type:"basic"});
      expect(response.body).toEqual([]);
    });
  });

  describe('/users/:userid/lists (GET) unauthorized', () => { 
    it('Returns HTTP 401 error if no username and password are provided', async () => {
      let response = await request(app.getHttpServer()).get('/users/'+user.id+'/lists')
      expect(response.status).toEqual(401);
    });
  });

  describe('/users/:userid/lists (GET) unauthorized', () => { 
    it('Returns HTTP 401 error if the user is not found', async () => {
      let response = await request(app.getHttpServer()).get('/users/234234234213/lists')
      .auth(username, password, {type:"basic"})
      expect(response.status).toEqual(401);
    });

    it('Returns HTTP 404 error if no userID is placed', async () => {
      let response = await request(app.getHttpServer()).get('/users/lists')
      .auth(username, password, {type:"basic"})
      expect(response.status).toEqual(404);
    });
  });

  describe('/users/:userid/lists (POST) unauthorized', () => { 
    it('Returns HTTP 401 error if no username and password are provided', async () => {
      let response = await request(app.getHttpServer()).post('/users/'+user.id+'/lists')
      expect(response.status).toEqual(401);
    });
  });

  describe('/users/:userid/lists (POST) authorized', () => { 
    it('Inserts a list of songs to the given user', async () => {
      let response = await request(app.getHttpServer()).post('/users/'+user.id+'/lists')
      .auth(username, password, {type:"basic"})
      .send(list1);
      expect(response.body).toEqual(list1);
      expect(response.status).toEqual(200);
    });

    it('Returns one list after the first list has been inserted', async () => {
      let response = await request(app.getHttpServer()).get('/users/'+user.id+'/lists')
      .auth(username, password, {type:"basic"});
      expect(response.body).toEqual([list1]);
    });

    it('Does not insert a malformed list', async () => {
      let response = await request(app.getHttpServer()).post('/users/'+user.id+'/lists')
      .auth(username, password, {type:"basic"})
      .send(song1);
      expect(response.status).toEqual(400);
    });
  });

  describe('/users/:userid/lists (POST) access from different user', () => { 
    it('One user cannot insert lists to another user', async () => {
      let response = await request(app.getHttpServer()).post('/users/'+user.id+'/lists')
      .auth(username2, password2, {type:"basic"})
      .send(list1);
      expect(response.status).toEqual(401);
    });

    it('We repeat this test twice because we can', async () => {
      let response = await request(app.getHttpServer()).post('/users/'+user2.id+'/lists')
      .auth(username, password, {type:"basic"})
      .send(list1);
      expect(response.status).toEqual(401);
    });
  });

  describe('/users/:userid/lists/:listid (GET) unauthorized', () => { 
    it('Returns HTTP 401 error if no username and password are provided', async () => {
      let response = await request(app.getHttpServer()).get('/users/'+user.id+'/lists/'+list1.listId)
      expect(response.status).toEqual(401);
    });

    it('Returns HTTP 401 error if the username/pwd combination are from another user', async () => {
      let response = await request(app.getHttpServer()).get('/users/'+user.id+'/lists/'+list1.listId)
      .auth(username2, password2, {type:"basic"})
      expect(response.status).toEqual(401);
    });
  });

  describe('/users/:userid/lists/:listid (GET) authorized', () => { 
    it('Returns the list of songs', async () => {
      let response = await request(app.getHttpServer()).get('/users/'+user.id+'/lists/'+list1.listId)
      .auth(username, password, {type:"basic"})
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(list1);
    });

    it('Does not find an unexistent list', async () => {
      let response = await request(app.getHttpServer()).get('/users/'+user.id+'/lists/'+list4.listId)
      .auth(username, password, {type:"basic"})
      expect(response.status).toEqual(404);
    });
  });

  describe('/users/:userid/lists/:listid (POST) unauthorized', () => { 
    it('Does not allow to add the song to the list if no credentials are provided', async () => {
      let response = await request(app.getHttpServer()).get('/users/'+user.id+'/lists/'+list1.listId)
      expect(response.status).toEqual(401);
    });

    it('One user cannot add songs to a list that belongs to another user', async () => {
      let response = await request(app.getHttpServer()).get('/users/'+user.id+'/lists/'+list1.listId)
      .auth(username2, password2, {type:"basic"})
      expect(response.status).toEqual(401);
    });
  });

  describe('/users/:userid/lists/:listid (POST) authorized', () => { 
    it('It adds the song correctly to a list', async () => {
      let response = await request(app.getHttpServer()).post('/users/'+user.id+'/lists/'+list1.listId)
      .auth(username, password, {type:"basic"})
      .send(song6);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(song6);
      response = await request(app.getHttpServer()).get('/users/'+user.id+'/lists/'+list1.listId)
      .auth(username, password, {type:"basic"})
      expect(response.body.songs.length).toEqual(list1.songs.length +1);
    });

    it('It does not add the song to an unexistent list', async () => {
      let response = await request(app.getHttpServer()).post('/users/'+user.id+'/lists/'+list4.listId)
      .auth(username, password, {type:"basic"})
      .send(song6);
      expect(response.status).toEqual(404);
    });
  });
});