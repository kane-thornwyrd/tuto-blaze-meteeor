import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'

import { TasksCollection } from '../api/TasksCollection'
import './App.html'
import './Task.js'

const HIDE_COMPLETED_STRING = "hideCompleted"

const tasks = () => {
  const instance = Template.instance();
  const hideCompleted = instance['state'].get(HIDE_COMPLETED_STRING);

  const hideCompletedFilter = { isChecked: { $ne: true } };

  return TasksCollection.find(hideCompleted ? hideCompletedFilter : {}, {
    sort: { createdAt: -1 },
  }).fetch();
}

const hideCompleted = () => Template.instance()['state'].get(HIDE_COMPLETED_STRING)
const incompleteCount = () => {
  const incompleteTasksCount = TasksCollection.find({ isChecked: { $ne: true } }).count();
  return incompleteTasksCount ? `(${incompleteTasksCount})` : '';
}


Template.mainContainer.onCreated(function mainContainerOnCreated() {
  this.state = new ReactiveDict();
})

Template.mainContainer.helpers({
  tasks,
  hideCompleted,
  incompleteCount,
})

Template.mainContainer.events({
  "click #hide-completed-button"(_, instance) {
    const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING)
    instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted)
  }
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