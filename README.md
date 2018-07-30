# Vue-Token
Simple token storage/ authorization in vuejs.

This plugin requires you to initialize the [vue-resource](https://github.com/vuejs/vue-resource) plugin first.

The token will be stored into the Authorization header with each request you make with the vue-resource plugin.

	npm install vue-token --save

# Usage

	import Auth from "vue-token";
	Vue.use(Auth, options);

## Options

	{
		loginUrl: "/api/login", 
		signupUrl: "/api/users", 
		logoutUrl: "/api/logout",
		refresh: false // Utilize the automatic refresh of tokens (it will use the token from response.token as the new token)
	}

## Example Component

	<script>
	export default {
		data(){
			return {
				input: {
					email: "",
					password: ""
				}
			}
		},
		created(){
			//
		},
		methods: {
			send() {
            	this.$auth.login(this, this.input, "profile/0", (errors) => {
					console.log(errors);
            	});
            }
		}
	}
	</script>

## Methods

	$auth.
		// Send a (post) request to the loginUrl.
		login(context, input, redirect = false, errorHandler = false)
			
		// Send a (post) request to the signupUrl.
		register(context, input, redirect = false, errorHandler = false login = true)
			
		//Send a (get) request to the logoutUrl.
		logout(context, redirect = false, errorHandler = false)
			
		//Check if a token is being stored and if is not null.
		check()
			
		//Get the token from the localStorage.
		getToken()
			
		//Set a token in the localStorage.
		setToken(token)
			
		//Remove the token from the localStorage.
		removeToken()

# License
[MIT](https://github.com/joostlawerman/Vue-Token/blob/master/LICENSE)
