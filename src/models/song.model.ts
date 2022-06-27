import { IsDefined } from "class-validator";

export class Song {
    @IsDefined() artist: string;
    @IsDefined() title: string;
}