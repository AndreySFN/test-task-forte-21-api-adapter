import {WithId} from "./utils";

export interface UserDto extends WithId{
    username: string;
    password: string;
}