define(function(require, exports, module) {

	exports.AppInit = function() {
		var AppView = require('./src/views/todos');
		var appView = new AppView();
	}


});