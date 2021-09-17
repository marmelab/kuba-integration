const apiUrl = process.env.REACT_APP_API_URL;

export const authProvider = {
    
    login: async ({ username, password }: {username: string, password: string}) => {
        const request: Request = new Request(`${apiUrl}/auth/admin/login`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: new Headers({'Content-Type': 'application/json'})
        })

        return fetch(request)
        .then(response =>{
            if (response.status < 200 || response.status >= 300){
                localStorage.removeItem('authenticated');
                throw new Error(response.statusText)
            }
            return response.json()
        })
        .then(json => {
            localStorage.setItem('authenticated', "true");
            localStorage.removeItem('role');
            localStorage.setItem('login', json.email);
            localStorage.setItem('user', json.email);
            localStorage.setItem('token', json.access_token)
            localStorage.setItem('permissions', json.role)
        })
    },
    logout: () => {
        localStorage.removeItem('authenticated');
        localStorage.removeItem('role');
        localStorage.removeItem('login');
        localStorage.removeItem('user');
        localStorage.removeItem('avatar');
        localStorage.removeItem('token')
        localStorage.removeItem('permissions')
        return Promise.resolve();
    },
    checkError: ({ status } : {status:any}) => {
        return status === 401 || status === 403
            ? Promise.reject()
            : Promise.resolve();
    },
    checkAuth: () => {
        return localStorage.getItem('authenticated')
            ? Promise.resolve()
            : Promise.reject();
    },
    getPermissions: () => {
        const role = localStorage.getItem('permissions');
        return role ? Promise.resolve(role) : Promise.reject()
    },
    getIdentity: () => {
        return {
            id: localStorage.getItem('login'),
            fullName: localStorage.getItem('user'),
        };
    },
};