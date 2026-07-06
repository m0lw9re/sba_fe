export type LoginData = {
    username?: string;
    password?: string;
    roles?: Array<any>;
};

export type ChangePassworData = {
    oldPassword?: string;
    newPassword? : string;
}
