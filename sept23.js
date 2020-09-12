/* Sept 23 */
"use strict";
const log = console.log;
log('Sept 23');

function sayName() {
	log('My name is ' + this.firstName)
}

//sayName(); // undefined

const person = {
	sayName: sayName
}

person.sayName(); // undefined

const student = {
	firstName: 'James'
}

//student.sayName();

Object.setPrototypeOf(student, person)
student.sayName(); // James


const teacher = {
	firstName: 'Paul'
}

Object.setPrototypeOf(teacher, person)
teacher.sayName() //Paul

// chaining prototypes
const partTimeStudent = {
	numCourses: 2
}

Object.setPrototypeOf(partTimeStudent, student)
partTimeStudent.sayName() //James

person.sayName = function () {
	log('MY NAME IS ' + this.firstName)
}

partTimeStudent.sayName() // MY NAME IS James

//////////////////

// a constructor function
function Student(firstName, lastName) {
	this.firstName = firstName
	this.lastName = lastName
}

Student.prototype.sayLastName = function () {
	log('My last name is ' + this.lastName)
}

const student2 = new Student('Jimmy', 'Parker')
student2.sayLastName()

// Object.create()
const student3 = Object.create(student)
student3.sayName()

// class keyword

class Instructor {
	constructor(firstName, course) {
		this.firstName = firstName
		this.course = course
		this.circle =0
	}

	whatsMyCourse() {
		this.circle++;
		return this.course;
	}
}

/// Equivalent to above class

// function Instructor(firstName, course) {
// 	this.firstName = firstName
// 	this.course = course
// }

// Instructor.prototype.whatsMyCourse = function () {
// 	return this.course
// }


const jen = new Instructor('Jen', 'CSC108')
log(jen.whatsMyCourse())

class Person {
	constructor(firstName) {
		this.firstName = firstName
	}
}

/// More Object-oriented syntactic sugar below.
// Under the hood, this is still prototypal delegation
class Instructor2 extends Person {
	constructor(firstName, course) {
		super(firstName)
		this.course = course
	}

	whatsMyCourse() {
		return this.course;
	}
}

const jen2 = new Instructor2('Jen2', 'CSC108')
log(jen2.whatsMyCourse())

