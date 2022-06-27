import {  Body, Controller, Get, HttpCode, InternalServerErrorException, NotFoundException, Param, Post, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { SongList } from '../../models/song-list.model';
import { UserListsService } from './user-lists.service';
import { UserLists } from '../../models/user-lists.model';
import { AuthGuard } from '@nestjs/passport';
import { Song } from '../../models/song.model';

@Controller()
@UseGuards(AuthGuard('spotlist'))
export class UserListsController {
  constructor(private userListsService:UserListsService) {}

  @HttpCode(200)
  @Post("/users/:userid/lists")
  async addList( @Body(new ValidationPipe({forbidUnknownValues: true})) songList: SongList, @Param() params ) {
    let listHasBeenAdded = this.userListsService.addListToUser(params.userid, songList);
    if (!listHasBeenAdded) throw new InternalServerErrorException("Something went wrong... oops");
    else return songList;
  }

  @Get("/users/:userid/lists")
  async get(@Param() params): Promise<SongList[]> {
    let userLists: UserLists = await this.userListsService.get(params.userid);
    if (!userLists){
      throw new UnauthorizedException("User not found with this id (or user is not the one authenticated)")
    }else{
      return userLists.lists;
    }
  }

  @Get("/users/:userid/lists/:listid")
  async getList(@Param() params): Promise<SongList> {
    let songList: SongList = await this.userListsService.getList(params.userid, params.listid);
    if (!songList){
      throw new NotFoundException("This list does not exist");
    }else{
      return songList
    }
  }

  @HttpCode(200)
  @Post("/users/:userid/lists/:listid")
  async addSongToList( @Body(new ValidationPipe({forbidUnknownValues: true})) song: Song, @Param() params ) {
    let songHasBeenAdded = await this.userListsService.addSongToList(params.userid, params.listid, song)
    if (!songHasBeenAdded) throw new NotFoundException("The list you are trying to add songs to does not exist");
    else return song;
  }
}
