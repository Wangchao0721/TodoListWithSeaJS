define(function(require, exports, module) {
	var _ = require('underscore');
	var Backbone = require('backbone');
	var localStorage = require('localstore');

	var ToDo = Backbone.Model.extend({
	    default:function() {
			return {
				title: "empty todo...",
				order: Todos.nextOrder(),
				done: false
			};
		},

		initialize: function() {
			if(!this.get("title")) {
				this.set({
					"title": this.default.title
				});
			}
		},

		toggle:function(){
			this.save({done:!this.get("done")});
		},

		clear:function(){
			this.destroy;
		}


	});

	var TodoList = Backbone.Collection.extend({
		model:ToDo,

		localStorage:new Store("todos-backbone"),

		done:function(){
			return this.filter(function(todo){
				return todo.get('done');
			});
		},

		remaining:function(){
			return this.without.apply(this,this.done());
		},

		nextOrder:function(){
			if(!this.length) return 1;
			return this.last().get('order');
		},

		comparator:function(todo){
			return todo.get('order');
		}
	});

	var Todos = new TodoList;

	module.exports = Todos;

});