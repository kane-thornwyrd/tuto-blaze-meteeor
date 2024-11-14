import { Template } from 'meteor/templating';
import { TasksCollection } from '../api/TasksCollection';
import './App.html';

const tasks = () => TasksCollection.find({}, { sort: { createdAt: -1 } })

Template.mainContainer.helpers({
  tasks
})

Template.form.events({
  "submit .task-form"(event) {
    event.preventDefault()

    const target = event.target
    const text = target.text.value

    TasksCollection.insert({
      text,
      createdAt: new Date(),
    })

    target.text.value = ''
  }
})