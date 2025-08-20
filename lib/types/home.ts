import { IRestaurant } from "./restaurant";
import { IUser } from "./user";

export interface IHome {
	user: IUser;
	restaurants: IRestaurant[];
}
