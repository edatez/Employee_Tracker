const inquirer = require("inquirer");
const mysql = require("mysql");
const node_env =  require  ("node-env-file");

const askQuestions = function() {
    inquirer
      .prompt({
        type: "list",
        name: "startQuestions",
        message: "What would you like to do?",
        choices: [
          "view all employees",
          "view all roles",
          "view all departments",
          "add employee",
          "add department",
          "add role",
          "update employee role",
          "remove employee"
        ]
      })
      .then(function(answer) {
        console.log(answer);
        // start of switch statment for user choice
        switch (answer.startQuestions) {
          case "view all employees":
            viewallemployees();
            break;
  
          case "view all roles":
            viewallroles();
            break;
  
          case "view all departments":
            viewalldepartments();
            break;
  
          case "add employee":
            addEmployee();
            break;
  
          case "update employee role":
            updateEmpRole();
            break;
  
          case "add department":
            addDepartment();
            break;
  
          case "add role":
            addRole();
            break;
        }
      });
