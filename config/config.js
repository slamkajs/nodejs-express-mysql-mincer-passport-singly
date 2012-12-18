module.exports = {
	development: {
		 domain:'http://localhost:3000'
		,db: {
			  database: 'DB_NAME_dev'
			, user: 'dbUser'
			, password: 'db_password'
		}
		,singly: {
			clientID: "0"
			, clientSecret: "0"
			, callbackURL: "http://localhost:3000/auth/callback"
		}
		,email:{
			domain: "smtp.sendgrid.net",
			host: "smtp.sendgrid.net",
			port : 587,
			authentication: "login",
			auth: {
		        user: "sg_username",
		        pass: "password"
		    }
		}
	}
	,test: {
		 domain:'http://testdomain:3000'
		,db: {
			  database: 'DB_NAME_dev'
			, user: 'dbUser'
			, password: 'db_password'
		}
		,singly: {
			clientID: "0"
			, clientSecret: "0"
			, callbackURL: "http://localhost:3000/auth/callback"
		}
		,email:{
			domain: "smtp.sendgrid.net",
			host: "smtp.sendgrid.net",
			port : 587,
			authentication: "login",
			auth: {
		        user: "sg_username",
		        pass: "password"
		    }
		}
	}
	,production: {
		 domain:'http://zerobound.jit.su'
		,db: {
			  database: 'DB_NAME_dev'
			, user: 'dbUser'
			, password: 'db_password'
		}
		,singly: {
			clientID: "0 "
			, clientSecret: "0"
			, callbackURL: "http://DOMAIN-NAME.com/auth/callback"
		}
		,email:{
			domain: "smtp.sendgrid.net",
			host: "smtp.sendgrid.net",
			port : 587,
			authentication: "login",
			auth: {
		        user: "sg_username",
		        pass: "password"
		    }
		}
	}
}