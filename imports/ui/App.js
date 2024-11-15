import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'

import { TasksCollection } from '/imports/db/TasksCollection'
import './App.html'
import './Task/Task.js'
import './Login/Login.js'

const HIDE_COMPLETED_STRING = "hideCompleted"

const getTasksFilter = () => {
  const user = getUser()

  const hideCompletedFilter = { isChecked: { $ne: true } }

  const userFilter = user ? { userId: user._id } : {}

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter }

  return { userFilter, pendingOnlyFilter }
}

const tasks = () => {
  const instance = Template.instance()
  const hideCompleted = instance['state'].get(HIDE_COMPLETED_STRING)

  const { pendingOnlyFilter, userFilter } = getTasksFilter()

  if (!isUserLogged()) return []

  return TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter, {
    sort: { createdAt: -1 },
  }).fetch();
}
const hideCompleted = () => Template.instance()['state'].get(HIDE_COMPLETED_STRING)
const incompleteCount = () => {
  if (!isUserLogged()) return ''

  const { pendingOnlyFilter } = getTasksFilter()

  const incompleteTasksCount = TasksCollection.find(pendingOnlyFilter).count()

  return incompleteTasksCount ? `(${incompleteTasksCount})` : ''
}
const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();


Template.mainContainer.onCreated(function mainContainerOnCreated() {
  this.state = new ReactiveDict();
})

Template.mainContainer.helpers({
  tasks,
  hideCompleted,
  incompleteCount,
  isUserLogged,
  getUser,
})

Template.mainContainer.events({
  "click #hide-completed-button"(_, instance) {
    const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING)
    instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted)
  },
  'click .user #logout'() {
    Meteor.logout()
  }
})

Template.form.events({
  "submit .task-form"(event) {
    event.preventDefault()

    const target = event.target
    const text = target.text.value

    Meteor.call('tasks.insert', {text})

    target.text.value = ''
  }
})