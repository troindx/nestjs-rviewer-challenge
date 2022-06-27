import { IsDefined, IsNotEmpty } from "class-validator";
import { Song } from "./song.model";

export class SongList {
    @IsNotEmpty() @IsDefined() listId: string;
    @IsDefined() songs : Song[];
}