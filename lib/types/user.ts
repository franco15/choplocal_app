export interface IUser {
	id: string;
	firstName: string;
	lastName: string;
	birthDate: Date;
	email: string;
	phoneNumber: string;
	code: string;
	image: string;
}

export interface IUserPut {
	firstName: string;
	lastName: string;
	birthDate: Date;
	email: string;
}

export interface IUserPutVM {
	firstName: string;
	lastName: string;
	birthDate: string;
	email: string;
}
