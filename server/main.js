import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/api/TasksCollection'

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

const SEED_DATA = [
  {text: 'First Task'},
  {text: 'Second Task'},
  {text: 'Third Task'},
  {text: 'Fourth Task'},
  {text: 'Fifth Task'},
  {text: 'Sixth Task'},
  {text: 'Seventh Task'}
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