
import { User } from 'src/models/user.model';
import { AuthService } from '../auth.service';
import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../../users/users.module';
import { UsersService } from '../../users/users.service';
  
describe('AuthService', () => {
  let user: User = {
    name : "Jonson",
    password : "thisisart"
  };
  
  let authService: AuthService;
  let usersService: UsersService;
  let lastId: string;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [AuthService],
      exports : [AuthService],
    }).compile();
    authService = app.get<AuthService>(AuthService);
    usersService = app.get<UsersService>(UsersService);
    lastId = await usersService.insert(user);
    user.id = lastId;
  });

  afterAll(async () =>{
    await authService.close();
  });

  describe('Correct user name and password', () => { 
    it('Should validate the right user name and password', async() => {
      let validation = await authService.validateCredentials(user.id, 'Jonson', 'thisisart');
      expect(validation).toBeTruthy();
    });
  });

  describe('Validating Login', () => { 
    it('Should validate the login from username.', async() => {
      let validation = await authService.validateLogin('Jonson', 'thisisart');
      expect(validation).toBeTruthy();
    });
    it('Should not validate the wrong credentials for username and password.', async() => {
      let validation = await authService.validateLogin('Jonson', 'thisisnotart');
      expect(validation).toBeFalsy();
    });
  });

  describe('Wrong password', () => { 
    it('Should not validate a user with a wrong password', async() => {
      let validation = await authService.validateCredentials(user.id, 'Jonson', 'thisisnotart');
      expect(validation).toBeFalsy();
    });
  });

  describe('Wrong userId', () => { 
    it('Should not validate a non existent user', async() => {
      let validation = await authService.validateCredentials("aaaaaaaaaaaa", 'Jonson', 'thisisnotart');
      expect(validation).toBeFalsy();
    });
  });

});
