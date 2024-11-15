import { check } from "meteor/check";
import { TasksCollection } from "/imports/db/TasksCollection";

Meteor.methods({
  "tasks.insert"(task) {
    check(task.text, String)
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    TasksCollection.insertAsync({
      createdAt: new Date(),
      userId: this.userId,
      ...task
    })
  },

  "tasks.remove"(taskId) {
    check(taskId, String)

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.")
    }

    TasksCollection.removeAsync(taskId);
  },

  "tasks.setIsChecked"(taskId, isChecked) {
    check(taskId, String)
    check(isChecked, Boolean)

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.")
    }

    TasksCollection.updateAsync(taskId, {
      $set: {
        isChecked,
      },
    })
  },
})
