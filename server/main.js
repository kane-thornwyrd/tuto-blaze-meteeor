import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/db/TasksCollection'
import '/imports/api/tasksMethods'

const SEED_USERNAME = 'meteorite'
const SEED_PASSWORD = 'password'

const SEED_DATA = [
  {
    text: 'First Task',
    isChecked: false,
  },
  {
    text: 'Second Task',
    isChecked: false,
  },
  {
    text: 'Third Task',
    isChecked: false,
  },
  {
    text: 'Fourth Task',
    isChecked: false,
  },
  {
    text: 'Fifth Task',
    isChecked: false,
  },
  {
    text: 'Sixth Task',
    isChecked: false,
  },
  {
    text: 'Seventh Task',
    isChecked: false,
  }
]

const insertTask = (content, userId) =>
  TasksCollection.insertAsync({
    ...content,
    userId,
    createdAt: new Date(),
  })

Meteor.startup(async () => {
  const existingUser = await Accounts.findUserByUsername(SEED_USERNAME)
  const userId = existingUser ? existingUser._id : await Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    })

  const hasNoTasksInDB = !(await TasksCollection.find().countAsync())

  if (hasNoTasksInDB) {
    for (let i = 0; i < SEED_DATA.length; i++) {
      await insertTask(SEED_DATA[i], userId)
    }
  }
})