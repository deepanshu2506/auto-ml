import API, { apiURLs } from "../API";

export const userService = {
	login,
	logout,
	register
};

async function login(form) {
    const formData = new FormData();
    const { email, password } = form

    formData.append("email", email);
    formData.append("password", password);
    return API.authData.post(
        apiURLs.user.login,
        formData
    ).then((response) => {
        console.log(response);
        let user={"profile":response.data.profile.username,"auth_token":response.data.token};
        //localStorage.setItem("user",JSON.stringify(user));
        console.log(user);
        return user;
    }).catch(err => {
        console.log(err)
        if(err.response.status===401){
            logout();
        }
        var error="Email or password invalid" ;
        if(err.response.status===403){
            logout();
            error="Email is not verified" ;
        }
        return Promise.reject(error);
    });
};




// remove user from local storage to log user out
function logout() {
	localStorage.removeItem('user');
}

async function register(form){
    const formData = new FormData();
    const { username, email, password } = form
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    return API.authData.post(
        apiURLs.user.register,
        formData
    ).then(response => {
        console.log(response)
        return response.data;
    }).catch(err => {
        if(err.response.status===401){
            logout();
        }
        const error = err.response.data.error;
        console.log(error)
		return Promise.reject(error);

    });
};
