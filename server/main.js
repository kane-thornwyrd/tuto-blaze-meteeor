import { Meteor } from 'meteor/meteor'
import { TasksCollection } from '/imports/api/TasksCollection'

const seed = [
  {text: 'First Task'},
  {text: 'Second Task'},
  {text: 'Third Task'},
  {text: 'Fourth Task'},
  {text: 'Fifth Task'},
  {text: 'Sixth Task'},
  {text: 'Seventh Task'}
]

Meteor.startup(() => {
  TasksCollection.find().countAsync().then(async (howMany) => {
    if (howMany === 0) {
      for (let i = 0; i < seed.length; i++) {
        await TasksCollection.insertAsync(seed[i])
      }
    }
  })
})