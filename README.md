
# Error log

 The main way to track the client side error is  `window.onerror()` which has been around for a while now and supported by major modern browsers. Let's get the trace of error object and and log it.

## Install
    npm install

## Usage

 1. Open ***config.js***, edit your appPort, db.path, db.collection settings here.
 2. `npm start`
 3. If there's any window error, post the error object in the same format shown above, through your **save** api.

 ```javascript
 window.onerror = function (msg, url, line, column, error) {
 	// Step 1. Prepare the error object to save
	var data = {
		url: window.location.href,
		file: url,
		line: line,
		column: column,
		error: error,
		createdOn: new Date()
	};
	// Step 2. Post the above data to your api now

	return false;
}

 ```
 4. Check the error logs on ***{path}/show/***

Note: {path} above denotes where your app is running, 1300 is default.


## License
This work is under [MIT Open Source license](https://opensource.org/licenses/MIT).
