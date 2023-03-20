import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
export const getIlo = async () => {
    try {
        const res = await axios.post(baseUrl +  '/api/v1/get_ilos', {})
        return res;
    } catch (error) {
        return error;
    }
}
