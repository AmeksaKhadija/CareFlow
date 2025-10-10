import { hash, compare } from 'bcryptjs';

export const doHash = async (value, saltValue = 10) => {
    const result = await hash(value, saltValue);
    return result;
};

export const doHashValidation = async (value, hashedValue) => {
    const result = await compare(value, hashedValue);
    return result;
}

export default {doHash, doHashValidation};