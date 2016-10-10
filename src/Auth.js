
const Auth = {
	install(vue, options = { loginUrl: "/api/login", signupUrl: "/api/users", logoutUrl: "/api/logout", refresh: false}) {
		vue.prototype.$auth = new Authenticate(vue, options.loginUrl, options.signupUrl, options.logoutUrl);

		vue.http.interceptors.push((request, next) => {

	        if (!request.headers.hasOwnProperty('Authorization')) {
	            request.headers['Authorization'] = localStorage.getItem("token");
	        }

			if (options.refresh) {
				next((response) => {
					vue.$auth.setToken(response.token);
				});
			}
			next();
		});
	}
}

if (typeof exports == "object") {
	// Export
    module.exports = Auth;
} else if (window.Vue) {
	// Vue use if vue is being used on the page
	Vue.use(Auth);
}

class Authenticate {
	constructor(context, loginUrl, signupUrl, logoutUrl) {
		this.authenticated = this.check();
		this.loginUrl = loginUrl;
		this.signupUrl = signupUrl;
		this.logoutUrl = logoutUrl;
		this.context = context;
	}

	login(context, input, redirect = false, errorHandler = false) {
		this.context.$http.post(this.loginUrl, input).then((response) => {
			this.setToken(response.data.token);

			this.authenticated = true;

			redirect(this.context, redirect);

		}, handleErrors(errorHandler));
	}

	register(context, input, redirect = false, errorHandler = false, login = true) {
		this.context.$http.post(this.signupUrl, input).then((response) => {
			if (login) {
				this.setToken(response.data.token);

				this.authenticated = true;
			}
			redirect(this.context, redirect);

		}, handleErrors(errorHandler));
	}

	logout(context, redirect = false, errorHandler = false) {
		this.context.$http.get(this.logoutUrl).then((response) => {
			this.removeToken();

			this.authenticated = false;

			redirect(this.context, redirect);

		}, handleErrors(errorHandler));
	}

	check() {
		validToken(this.getToken());
	}

	getToken() {
		return localStorage.getItem("token")
	}

	setToken(token) {
		localStorage.setItem("token", token);
	}

	removeToken() {
		localStorage.removeItem("token")
	}
}

function redirect(context, redirect) {
	if (redirect !== false) {
		context.$router.go(redirect);
	}
}

function validToken(token) {
	if (typeof token != "undefined" && token != null) {
		return true;
	}
	return false;
}

function handleErrors(errorHandler) {
	return (errors) => {
		if (errorHandler !== false) {
			errorHandler(errors);
		}
	}
}
