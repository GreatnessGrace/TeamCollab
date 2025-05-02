import bcrypt from 'bcrypt';

export const comparePasswords = async (plain: string, hashed: string) => {
return bcrypt.compare(plain, hashed);
}