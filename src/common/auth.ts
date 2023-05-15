import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const createAccessToken = (useId: string, userType: string) => {
    const ACCESS_TOEKN_SECRET = process.env.ACCESS_TOKEN_SECRET || '';
    const token = jwt.sign({ useId, userType }, ACCESS_TOEKN_SECRET);
    return token;
}

export const encryptPassword = (password: string) => {
    const hash = bcrypt.hashSync(password, SALT_ROUNDS);
    return hash;
}
