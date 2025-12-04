import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:5000';

const userToken = Cookies.get("token_id");

export default async function api(endpoint, requestBody, method='GET', customHeader=null) {

    let headers = {
        "Content-Type": "application/json"
    }

    if (customHeader)
        headers = customHeader;

    // Add user token to headers if available
    headers['X-Token'] = userToken;

    // Request configuration
    const config = {
        method,
        url: `${BASE_URL}/api/v1${endpoint}`,
        headers,
        data: requestBody,
        ...customHeader
    }

    let response;

    try {
        response = await axios(config);
    } catch(error) {
        if (error?.response?.status === 401)
            window.location.href = '/login';

        return error.response.data;
    }

    return response.data;
}