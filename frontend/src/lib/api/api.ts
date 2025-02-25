const API_URL = 'http://localhost:3000/';
const API_MOD = 'todo-api/'

export function ApiUrl(path: string) {
    return API_URL + API_MOD + path;
}