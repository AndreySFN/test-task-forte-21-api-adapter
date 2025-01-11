import {WithId} from "./utils";

export interface ClientDetailsDto extends WithId{
    contact: string;
    about?: string;
    phoneNumber?: string;
}

export interface ClientDto extends WithId{
    name: string;
    company: string;
    details: ClientDetailsDto;
}
