"use strict"
const log = console.log
function student(firstname, lastname){
	this.firstname = firstname;
	this.lastname = lastname;
}

student.prototype.sayName = function(){
	log('Student\'s name is '+this.firstname + this.lastname)
}

const s1 = new student('Daniel', 'Liu')
s1.sayName()

const s2 = Object.create(s1)
s2.firstname = "Charlie"
s2.sayName()

class Person{
	constructor(firstName, lastName){
		this.firstName = firstName
		this.lastName = lastName
	}
}

class Instructor extends Person{
	constructor(firstName, lastName, courses){
		super(firstName, lastName)
		this.courses = courses
	}
	sayName(){
		log(this.lastName)
	}
}

const I1 = new Instructor('david','lee','aps1052')
// log(I1.__proto__)
I1.sayName()

function Model(){
	this.todos = [
		{id: 1, text:'Run a marathon', complete: false},
		{id: 2, text:'Plant a garden', complete: false},
	]
	this.bindTodoListChanged = function (callback){
		this.onTodoListChanged = callback
	}
}
Model.prototype.addTodo = function(todoText){
	const todo = {id: this.todos.length > 0 ? this.todos[this.todos.length-1].id + 1 : 1,
		text: todoText,
		complete: false,}
	this.todos.push(todo)
	this.onTodoListChanged(this.todos)
}

Model.prototype.deleteTodo = function (id){
	this.todos = this.todos.filter(todo => todo.id != id)
	this.onTodoListChanged(this.todos)
}

Model.prototype.toggleTodo = function (id){
	this.todos.map(todo => {
		if(todo.id == id){
			todo.complete = todo.complete ? false : true
		}
	})
	this.onTodoListChanged(this.todos)
}

Model.prototype.editTodo = function(id, editText){
	this.todos.map(todo => {
		if(todo.id == id){
			todo.text = editText
		}
	})
	this.onTodoListChanged(this.todos)
}
function View(){
	// The root element
    this.app = this.getElement('#root')

    // The title of the app
    this.title = this.createElement('h1')
    this.title.textContent = 'Todos'

    // The form, with a [type="text"] input, and a submit button
    this.form = this.createElement('form')

    this.input = this.createElement('input')
    this.input.type = 'text'
    this.input.placeholder = 'Add todo'
    this.input.name = 'todo'

    this.submitButton = this.createElement('button')
    this.submitButton.textContent = 'Submit'

    // The visual representation of the todo list
    this.todoList = this.createElement('ul', 'todo-list')

    // Append the input and submit button to the form
    this.form.append(this.input, this.submitButton)

    // Append the title, form, and todo list to the app
    this.app.append(this.title, this.form, this.todoList)

    this._temporaryTodoText = ''
    this._initLocalListeners()
}

View.prototype.createElement = function(tag, className){
	const element = document.createElement(tag)
    if (className) element.classList.add(className)

    return element
}
View.prototype.getElement = function(selector) {
    const element = document.querySelector(selector)

    return element
}
View.prototype.displayTodos = function(todos){
	// Delete all nodes
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild)
    }

	if (todos.length === 0) {
	  const p = this.createElement('p')
	  p.textContent = 'Nothing to do! Add a task?'
	  this.todoList.append(p)
	} else {
		// Create todo item nodes for each todo in state
	  todos.forEach(todo => {
	    const li = this.createElement('li')
	    li.id = todo.id

	    // Each todo item will have a checkbox you can toggle
	    const checkbox = this.createElement('input')
	    checkbox.type = 'checkbox'
	    checkbox.checked = todo.complete

	    // The todo item text will be in a contenteditable span
	    const span = this.createElement('span')
	    span.contentEditable = true
	    span.classList.add('editable')

	    // If the todo is complete, it will have a strikethrough
	    if (todo.complete) {
	      const strike = this.createElement('s')
	      strike.textContent = todo.text
	      span.append(strike)
	    } else {
	      // Otherwise just display the text
	      span.textContent = todo.text
	    }

	    // The todos will also have a delete button
	    const deleteButton = this.createElement('button', 'delete')
	    deleteButton.textContent = 'Delete'
	    li.append(checkbox, span, deleteButton)

	    // Append nodes to the todo list
	    this.todoList.append(li)
	  })
	}
}

View.prototype._todoText = function (){
	return this.input.value
}

View.prototype.bindAddTodo = function(handler){
	this.form.addEventListener('submit', event => {
		event.preventDefault()

		if(this.input.value){

			handler(this.input.value)
			this.input.value = ''
		}
	})
}

View.prototype.bindDeleteTodo = function(handler){
	this.todoList.addEventListener('click', event => {
		if(event.target.className == 'delete'){
			const id = parseInt(event.target.parentElement.id)
			handler(id)
		}
	})
}

View.prototype.bindToggleTodo = function(handler){
	this.todoList.addEventListener('change', event => {
		if(event.target.type == 'checkbox'){
			const id = parseInt(event.target.parentElement.id)
			handler(id)
		}
	})
}
View.prototype._initLocalListeners = function(){
	this.todoList.addEventListener('input', event => {
		if(event.target.className == 'editable'){
			this._temporaryTodoText = event.target.innerText
		}
	})
}
View.prototype.bindEditTodo = function(handler){
	this.todoList.addEventListener('focusout', event => {
		if(this._temporaryTodoText){
			const id = parseInt(event.target.parentElement.id)
			handler(id, this._temporaryTodoText)
			this._temporaryTodoText = ''
		}
	})
}

function Controller(model, view){
	this.model = model
	this.view = view

	this.onTodoListChanged = function(todos) {
		this.view.displayTodos(todos)
	}
	this.handleAddTodo = function (todoText) {
		this.model.addTodo(todoText)
	}
	this.handleDeleteTodo = function(id){
		this.model.deleteTodo(id)
	}
	this.handleToggleTodo = function(id){
		this.model.toggleTodo(id)
	}
	this.handleEditTodo = function(id, text){
		this.model.editTodo(id, text)
	}
	this.onTodoListChanged(this.model.todos)
	this.view.bindAddTodo(this.handleAddTodo.bind(this))
	this.view.bindDeleteTodo(this.handleDeleteTodo.bind(this))
	this.view.bindToggleTodo(this.handleToggleTodo.bind(this))
	this.view.bindEditTodo(this.handleEditTodo.bind(this))
	this.model.bindTodoListChanged(this.onTodoListChanged.bind(this))
}


let model = new Model()
let view = new View()
let app = new Controller(model, view)
app.model.addTodo('take a nap')
log(app.model.todos)
// app.view.displayTodos(app.model.todos)
