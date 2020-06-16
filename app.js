const fs = require("fs");
const yargs = require("yargs");
const chalk = require("chalk");
const { describe } = require("yargs");

const loadData = () => {
  const buffer = fs.readFileSync("data.json");
  const data = buffer.toString();
  const dataObj = JSON.parse(data);
  return dataObj;
};

const saveData = (data) => {
  fs.writeFileSync("data.json", JSON.stringify(data));
};

// const addToDo = (todo, status) => {
//   const data = loadData();
//   let newToDo = { todo: todo, status: status };
//   data.push(newToDo);
//   saveData(data);
// };

// if (process.argv[2] === "list") {

//     const data = loadData()
//     console.log("Listing to do")
//     data.forEach(({todo, status}) => console.log(`
//         todo: ${todo}
//         status: ${status}
//     `))
// } else if (process.argv[2] === "add") {
//     console.log("Adding a new to do")
//     let todo = process.argv[3] || null
//     let status = process.argv[4] || false
//     if (todo) {
//         addToDo(todo, status)
//     } else console.log("Please write down SOMETHING to do!")
// }
// else console.log("What da hell?")

yargs.command({
  command: "add",
  describe: "Add a new todo",
  builder: {
    id: {
      describe: "Id number",
      type: "number",
      demandOption: false,
    },
    todo: {
      alias: "t",
      describe: "Todo content",
      demandOption: true,
      type: "string",
    },
    status: {
      alias: "s",
      describe: "Todo status",
      demandOption: false,
      type: "boolean",
      default: false,
    },
  },
  handler: function (argv) {
    const data = loadData();
    let newToDo = { id: data.length, todo: argv.todo, status: argv.status };
    data.push(newToDo);
    saveData(data);
  },
});

yargs.command({
  command: "list",
  describe: "Showing To Do List",
  handler: function (todo, status) {
    const data = loadData();
    console.log("Listing to do");
    let x = process.argv[3] || null;
    if (x == null) {
      data.forEach(({ id, todo, status }) => {
        if (status === false) {
          console.log(
            chalk.red(`
        #${id + 1}
        todo: ${todo}
        status: Incomplete
    `)
          );
        } else
          console.log(
            chalk.green(`
        #${id + 1}
        todo: ${todo}
        status: Complete
      `)
          );
      });
    }
    if (x == "incomplete") {
      data.forEach(({ id, todo, status }) => {
        if (status === false) {
          console.log(
            chalk.red(`
          #${id + 1}
          todo: ${todo}
          status: Incomplete
      `)
          );
        }
      });
    }
    if (x == "complete") {
      data.forEach(({ id, todo, status }) => {
        if (status === true) {
          console.log(
            chalk.green(`
          #${id + 1}
          todo: ${todo}
          status: Complete
        `)
          );
        }
      });
    }
  },
});

yargs.command({
  command: "toggle",
  describe: "Toggle Incomplete/ Complete at a specific ID number",
  handler: () => {
    const data = loadData();
    let x = process.argv[3];
    if (x) {
      for (let i = 0; i < data.length; i++) {
        if (x == data[i].id + 1) {
          data[i].status = !data[i].status;
          // console.log("Gotcha!")
        }
        // console.log(data[i].id)
        // console.log("X is", x)
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        data[i].status = !data[i].status;
      }
    }

    saveData(data);
  },
});

yargs.command({
  command: "delete",
  describe: "Delete a specific to do thing by ID",
  handler: () => {
    const data = loadData();
    let x = process.argv[3];
    if (x) {
      for (let i = 0; i < data.length; i++) {
        if (x == data[i].id + 1) {
          for (let j = i; j < data.length; j++) {
            data[j].id--;
          }
          data.splice(i, 1);
        }
      }
    }
    saveData(data);
  },
});

yargs.command({
  command: "delete_all",
  describe: "Delete ALL of the to do things",
  handler: () => {
    const data = [];
    saveData(data);
  },
});

yargs.parse();
