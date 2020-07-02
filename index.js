const connection = require("./db/connection");
const inquirer = require("inquirer");
const mysql = require("mysql");
const logo = require("asciiart-logo");
const config = require("./package.json");

console.log(logo(config).render());

function menu() {
  inquirer
  .prompt([
      {
          message: "What would you like to do?",
          type: "list",
          name: "prompt",
          choices: [
              "Add department", 
              "Add role", 
              "Add employee", 
              "View departments", 
              "View roles",
              "View employees",
              "Update employee roles",
          ]
      },
  ])
  .then( (res) => {
      if (res.prompt === "Add department") {
        addDepartment()
      }
      else if (res.prompt === "Add role") {
          addRole()
      }
      else if (res.prompt === "Add employee") {
        addEmployee()
      }
      else if (res.prompt === "View departments") {
        viewDepartment()
      }
      else if (res.prompt === "View roles") {
        viewRoles()
      }
      else if (res.prompt === "View employees") {
          viewEmployee()
      }
      else if (res.prompt === "Update employee roles") {
          updateEmployeeRoles()
      }
  })
}

// Add departments, roles, employees
function addDepartment() {
  inquirer
    .prompt([
      {
        message: "What is the department's name?",
        type: "input",
        name: "departmentName",
      },
    ])
    .then((response) => {
      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        response.departmentName,
        (err, result) => {
          if (err) throw err;
          console.log("Inserted as ID " + result.insertId);
        }
      );
    });
}

function addRole() {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          message: "What is the title?",
          type: "input",
          name: "title",
        },
        {
          message: "What is the salary?",
          type: "input",
          name: "salary",
          // validate: (value) =>{
          //     return !isNaN(value) ? true : "Please provide a number value.";
          // }
        },
        {
          message: "What department does the role belong to?",
          type: "list",
          name: "department_id",
          choices: results.map((department) => {
            return {
              name: department.name,
              value: department.id,
            };
          }),
        },
      ])
      .then((response) => {
        connection.query(
          "INSERT INTO role SET?",
          response.departmentName,
          (err, result) => {
            if (err) throw err;
            console.log("Inserted as ID " + result.insertId);
          }
        );
      });
  });
}

function addEmployee() {
  getRoles((roles) => {
    getEmployees((employees) => {
      employeeSelections = employees.map((employee) => {
        return {
          name: employee.first_name + " " + employee.last_name,
          value: employee.id,
        };
      });

      employeeSelections.unshift({ name: "None", value: null });

      inquirer
        .prompt([

          {
            message: "First Name",
            type: "input",
            name: "first_name",
          },
          {
            message: "Last Name",
            type: "input",
            name: "last_name",
          },
          {
            message: "Role",
            type: "list",
            name: "role_id",

            choices: roles.map((role) => {               
              console.log(role);
              return {
                name: role.title,
                value: role.id,
              };
            }),
          },
          {
            message: "Manager",
            type: "list",
            name: "manager_id",
            choices: employeeSelections,
          },
        ])
        .then((response) => {
          connection.query(
            "INSERT INTO employee SET?",
            response,
            (err, result) => {
              if (err) throw err;

              console.log("Inserted as ID " + result.insertId);
              menu()
            }
          );
        });
    });
  });
}

function getRoles(cb) {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    cb(results);
  });
}

function getEmployees(cb) {
  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;
    cb(results);
  });
}

// // // View departments, roles, employees
function viewDepartment(){
  connection.query("SELECT * FROM department", (err,results) =>{
      if(err) throw err;
      console.table(results)
      menu()
  });
  }

  function viewRoles(){
    getRoles((roles)=>{
          //loop over the roles and print info from each one to the terminal 
          console.table(roles);
         menu();
    });
  }  
function viewEmployee() {
  getEmployees((employees)=>{
    console.table(employees);
    menu();
});  
}
// // Update employee roles
function updateEmployeeRoles(){
      
  getEmployees((employees)=>{
      employeeSelections=employees.map(employee =>{
      return{
          name:employee.first_name + ' ' +employee.last_name,
          value:employee.id
      };
      });
  });

  getRoles((roles)=>{
      inquirer.prompt([
              {
                  message:"Which employee's role do you want to update?",
                  type:"list",
                  name:"id",
                  choices: employeeSelections
              },
              {
                  message:"What is the new role of this employee?",
                  type:"list",
                  name:"role_id",
                  choices: roles.map(role =>{
                      return{
                          name:role.title ,
                          value:role.id
                      };
                  })
              },
          ]).then((response)=>{
              console.log(response)
              connection.query(`UPDATE employee SET role_id = ${response.role_id} WHERE id =  ${response.id}`, (err,result)=>{
                  if(err) throw err;
                  console.log(result.affectedRows + " employee role updated.");
              });

              menu()
          });
  });

}

menu();
