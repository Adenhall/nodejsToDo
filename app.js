const fs = require("fs");
const yargs = require("yargs");
const chalk = require("chalk");

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
        demandOption: false
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
    let newToDo = { id: data.length,todo: argv.todo, status: argv.status };
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
    data.forEach(({ todo, status }) => {
      if (status === false) {
        console.log(
          chalk.red(`
        todo: ${todo}
        status: Incomplete
    `)
        );
      } else
        console.log(
          chalk.green(`
        todo: ${todo}
        status: Complete
      `)
        );
    });
  },
});

yargs.parse();
