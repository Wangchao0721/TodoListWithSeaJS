define(function(require, exports, module) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');

	var Todos = require('../collection/todos');

	var TodoView = Backbone.View.extend({

		tagName: "li",

		temolate: _.template($('#item-template').html()),

		events: {
			"click .toggle": "toggleDone",
			"dbclick .View": "edit",
			"click a.destroy": "clear",
			"keypress .edit": "updateOnEnter",
			"blur .edit": "close"
		},

		initialize: function() {
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},

		render: function() {
			$(this.el).addClass("editing");
			$(this.input).focus();

			return this;
		},

		toggleDone: function() {
			this.model.toggle();
		},

		edit: function() {
			this.$el.addClass("editing");
			this.input.focus();
		},

		close: function() {
			var value = this.input.val();
			if(!value) this.clear();
			this.model.save({
				title: value
			});
			this.$el.removeClass("editing");
		},

		updateOnEnter: function(e) {
			if(e.keyCode == 13) this.close();
		},

		clear: function() {
			this.model.clear();
		}
	});

	var AppView = Backbone.View.extend({

		el: $("#todoapp"),

		statsTemplate: _.template($('#stats-template').html()),

		events: {
			"keypress #new-todo": "createOnEnter",
			"click #clear-completed": "clearCompleted",
			"click #toggle-all": "toggleAllComplete"
		},

		initialize: function() {

			this.input = this.$("#new-todo");
			this.allCheckbox = this.$("#toggle-all")[0];

			Todos.bind('add', this.addOne, this);
			Todos.bind('reset', this.addAll, this);
			Todos.bind('all', this.render, this);

			this.footer = this.$('footer');
			this.main = $('#main');

			Todos.fetch();
		},

		render: function() {
			var done = Todos.done().length;
			var remaining = Todos.remaining().length;

			if(Todos.length) {
				this.main.show();
				this.footer.show();
				this.footer.html(this.statsTemplate({
					done: done,
					remaining: remaining
				}));
			} else {
				this.main.hide();
				this.footer.hide();
			}

			this.allCheckbox.checked = !remaining;

			return this;
		},

		addOne: function(todo) {
			var view = new TodoView({
				model: todo
			});
			$("#todo-list").append(view.render().el);
		},

		addAll: function() {
			Todos.each(this.addOne);
		},

		createOnEnter: function(e) {
			if(e.keyCode != 13) return;
			if(!this.input.val()) return;

			Todos.create({
				title: this.input.val()
			});
			this.input.val('');
		},

		clearCompleted: function() {
			_.each(Todos.done(), function(todo) {
				todo.clear();
			});
			return false;
		},

		toggleAllComplete: function() {
			var done = this.allCheckbox.checked;
			Todos.each(function(todo) {
				todo.save({
					'done': done
				});
			});
		}
	});

	module.exports = AppView;
});