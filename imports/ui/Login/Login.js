import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './Login.html';

Template.login.events({
  'submit .login-form'(e) {
    e.preventDefault()

    const { username: { value : username }, password: { value : password } } = e.target;

    Meteor.loginWithPassword(username, password)
  }
})