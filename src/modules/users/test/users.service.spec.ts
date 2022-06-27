
import { User } from 'src/models/user.model';
import { UsersService } from '../users.service';
import { DbModule } from '../../db/db.module';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';

describe('UsersService', () => {

  let user:User = {
    name : "Test Jonson",
    id : new ObjectId(Math.floor(Math.random()*5000)).toString(),
    password :"thisisapassword"
  };

  let usersService: UsersService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DbModule],
      providers: [UsersService]
    }).compile();
    usersService = app.get<UsersService>(UsersService);
  });

  afterAll(async () =>{
    await usersService.close();
  })

  describe('Insert', () => { 
    it('Should Insert a user in the collection and return a valid userID', async () => {
      let objectId = await usersService.insert(user);
      expect(objectId).toBeDefined();
      user.id = objectId.toString();
    });
  });

  describe('Get', () => { 
    it('Should get a user from the user id', async () => {
      let testUser = await usersService.get(user.id);
      expect(testUser.name).toEqual(user.name);     
    });

    it('Should get a user from the user name', async () => {
      let testUser = await usersService.getFromUserName(user.name);
      expect(testUser.name).toEqual(user.name);   
    });

    it('Should not get a user from a username that does not exist', async () => {
      let testUser = await usersService.getFromUserName("Mateo rosso");
      expect(testUser).toBeFalsy();   
    });

    it('Should not get a user from a user ID that does not exist', async () => {
      let testUser = await usersService.get("123456789012");
      expect(testUser).toBeFalsy();   
    });
  });

  describe('Update', () => { 
    it('Should update a user properly', async () => {
      user.name="Michael Warrior";
      let modifiedCount = await usersService.update(user);
      expect(modifiedCount).toBe(1);
      let retreivedUser = await usersService.get(user.id);
      expect (retreivedUser.name).toBe(user.name);
    });
  });

  describe('Delete', () => { 
    it('Should Delete a user', async () => {
      let deletedUsers = await usersService.delete(user.id);
      expect(deletedUsers).toBe(1);
    });
  });

  describe('Search for non existent user', () => { 
    it('Should not find a user that does not exist', async () => {
      let nonExistentUser = await usersService.get(user.id);
      expect(nonExistentUser).toBeNull();
    });
  });
 
});
