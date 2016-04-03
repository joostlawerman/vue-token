
Auth = {
	install(Vue, options = { loginUrl: "/api/login", signupUrl: "/api/users", logoutUrl: "/api/logout"}) {
		const LOGIN_URL = options.loginUrl;
		const SIGNUP_URL = options.signupUrl;
		const LOGOUT_URL = options.logoutUrl;

		Vue.prototype.$auth = new Authenticate();

		Vue.http.interceptors.push({
		    request: function(request) {

		        var headers = request.headers;

		        if (!headers.hasOwnProperty('Authorization')) {
		            headers['Authorization'] = localStorage.getItem("token");
		        }

		        return request;
		    }
		});
	}
}

class Authenticate {
	constructor() {
		this.authenticated = this.check();
	}

	/**
	 * Send a post request to the LoginUrl
	 * 
	 * @param  {Object}  context      [description]
	 * @param  {Object|Array}  input        [description]
	 * @param  {String} redirect     [description]
	 * @param  {Closure} errorHandler [description]
	 * @return {Void}               [description]
	 */
	login(context, input, redirect = false, errorHandler = false) {
		context.$http.post(LOGIN_URL, input).then((response) => {
			this.setToken(response.data.token);

			this.authenticated = true;

			if (redirect !== false) {
				context.$router.go(redirect);
			}
		}, (errors) => {
			if (errorHandler !== false) {
				errorHandler(errors);
			}
		});
	}

	/**
	 * Send a post request to the SignUpUrl
	 * 
	 * @param  {Object}  context      [description]
	 * @param  {Object|Array}  input
	 * @param  {String} redirect
	 * @param  {Closure} errorHandler
	 * @param  {Bool} login
	 * @return {Void}
	 */
	register(context, input, redirect = false, errorHandler = false, login = true) {
		context.$http.post(SIGNUP_URL, input).then((response) => {
			if (login) {
				this.setToken(response.data.token);

				this.authenticated = true;
			}
			if (redirect !== false) {
				context.$router.go(redirect);
			}
		}, (errors) => {
			if (errorHandler !== false) {
				errorHandler(errors);
			}
		});
	}

	/**
	 * Send a get request to the logout url
	 * 
	 * @param  {Object}  context
	 * @param  {Boolean} redirect
	 * @param  {Boolean} errorHandler
	 * @return {Void}
	 */
	logout(context, redirect = false, errorHandler = false) {
		context.$http.get(LOGOUT_URL).then((response) => {
			this.removeToken();
			this.authenticated = false;

			if (redirect !== false) {
				context.$router.go(redirect);
			}
		}, (errors) => {
			if (errorHandler !== false) {
				errorHandler(errors);
			}
		});
	}

	/**
	 * Check if token exists
	 * 
	 * @return {Bool}
	 */
	check() {
		let token = this.getToken();
		if (typeof(token) != "undefined" && token != null) {
			return true;
		}
		return false;
	}

	/**
	 * Get token from localStorage
	 * 
	 * @return {String}
	 */
	getToken() {
		return localStorage.getItem("token")
	}
	
	/**
	 * Set the token in the localStorage
	 * 
	 * @param {String}
	 * @return {Void}
	 */
	setToken(token) {
		localStorage.setItem("token", token);
	}

	/**
	 * Remove the token from the localStorage
	 * 
	 * @return {Void}
	 */
	removeToken() {
		localStorage.removeItem("token")
	}
}

if (typeof exports == "object") {
	// Export
    module.exports = Auth;
} else if (window.Vue) {
	// Vue use if vue is being used on the page
	Vue.use(Auth);
}
