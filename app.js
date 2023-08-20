const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const toDate = require("date-fns/toDate");
const isValid = require("date-fns/isValid");
const format = require("date-fns/format");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DBError: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const validColumnValues = async (request, response, next) => {
  const { status, priority, category, date } = request.query;

  if (status !== undefined) {
    const statusArray = ["TO DO", "DONE", "IN PROGRESS"];
    const statusIsInArray = statusArray.includes(status);
    // console.log(statusIsInArray);
    if (statusIsInArray === true) {
      request.status = status;
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
      return;
    }
  }

  if (category !== undefined) {
    const categoryArray = ["WORK", "HOME", "LEARNING"];
    const IsCategoryPresent = categoryArray.includes(category);
    if (IsCategoryPresent === true) {
      request.category = category;
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
      return;
    }
  }

  if (priority !== undefined) {
    const priorityArr = ["HIGH", "MEDIUM", "LOW"];
    const isPriorPresent = priorityArr.includes(priority);
    if (isPriorPresent === true) {
      request.priority = priority;
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
      return;
    }
  }

  if (date !== undefined) {
    // const formattedDate = format(date, "yyyy-MM-dd");
    const myDate = new Date(date);
    const result = toDate(
      new Date(
        `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}`
      )
    );
    console.log(result);
    const isValidDate = await isValid(result);
    console.log(isValid);
    if (isValidDate === true) {
      const formattedDate = format(new Date(date), "yyyy-MM-dd");
      request.date = formattedDate;
    } else {
      response.status(400);
      response.send("Invalid Due Date");
      return;
    }
  }

  next();
};
//

const validColumnValuesByRequestBody = async (request, response, next) => {
  const { dueDate, status, priority, category } = request.body;

  if (status !== undefined) {
    const statusArray = ["TO DO", "DONE", "IN PROGRESS"];
    const statusIsInArray = statusArray.includes(status);
    // console.log(statusIsInArray);
    if (statusIsInArray === true) {
      request.status = status;
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
      return;
    }
  }

  if (category !== undefined) {
    const categoryArray = ["WORK", "HOME", "LEARNING"];
    const IsCategoryPresent = categoryArray.includes(category);
    if (IsCategoryPresent === true) {
      request.category = category;
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
      return;
    }
  }

  if (priority !== undefined) {
    const priorityArr = ["HIGH", "MEDIUM", "LOW"];
    const isPriorPresent = priorityArr.includes(priority);
    if (isPriorPresent === true) {
      request.priority = priority;
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
      return;
    }
  }

  if (dueDate !== undefined) {
    const myDate = new Date(dueDate);
    const result = toDate(
      new Date(
        `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}`
      )
    );
    console.log(result);
    const isValidDate = await isValid(result);
    console.log(isValid);
    if (isValidDate === true) {
      const formattedDate = format(new Date(dueDate), "yyyy-MM-dd");
      request.dueDate = formattedDate;
    } else {
      response.status(400);
      response.send("Invalid Due Date");
      return;
    }
  }

  next();
};

//

//

const hasStatusPropery = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasCategoryPropery = (requestQuery) => {
  return requestQuery.category !== undefined;
};

const hasProrityAndStatusProperty = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasCategoryAndStatusProperty = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  );
};

const hasCategoryAndPriorityProperty = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  );
};

//

// Get Todo on status Q.Param API

app.get("/todos/", validColumnValues, async (request, response) => {
  const { category, priority, status, search_q = "" } = request.query;
  //   console.log(status);
  switch (true) {
    case hasStatusPropery(request.query):
      selectTodoQuery = `
                SELECT id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate  FROM todo WHERE todo LIKE "%${search_q}%" AND status = '${status}';
            `;
      break;
    case hasPriorityProperty(request.query):
      selectTodoQuery = `
                SELECT id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate  FROM todo WHERE todo LIKE "%${search_q}%" AND priority = '${priority}';
            `;
      break;
    case hasCategoryPropery(request.query):
      selectTodoQuery = `
                SELECT id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate  FROM todo WHERE todo LIKE "%${search_q}%" AND category = '${category}';
            `;
      break;
    case hasProrityAndStatusProperty(request.query):
      selectTodoQuery = `
                SELECT id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate  FROM todo WHERE todo LIKE "%${search_q}%" AND priority = '${priority}' AND status = '${status}';
            `;
      break;
    case hasCategoryAndStatusProperty(request.query):
      selectTodoQuery = `
                SELECT id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate  FROM todo WHERE todo LIKE "%${search_q}%" AND category = '${category}' AND status = '${status}';
            `;
      break;
    case hasCategoryAndPriorityProperty(request.query):
      selectTodoQuery = `
                SELECT id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate  FROM todo WHERE todo LIKE "%${search_q}%" AND category = '${category}' AND priority = '${priority}';
            `;
      break;
    default:
      selectTodoQuery = `
                SELECT id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate  FROM todo WHERE todo LIKE "%${search_q}%";
            `;
      break;
  }
  const getTodoDetails = await db.all(selectTodoQuery);
  response.send(getTodoDetails);
});

// Get Todo based pn Id API-2

app.get("/todos/:todoId/", validColumnValues, async (request, response) => {
  const { todoId } = request.params;
  const selectTodoQuery = `
        SELECT id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate  FROM todo WHERE id = ${todoId};
    `;
  const getTodoObject = await db.get(selectTodoQuery);
  response.send(getTodoObject);
});

// Get Todo based on due_date

app.get("/agenda/", validColumnValues, async (request, response) => {
  const { date } = request;
  console.log(date);
  const selectTodoQuery = `
        SELECT 
            id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate 
        FROM todo 
        WHERE due_date = '${date}';
    `;
  const getTodoObject = await db.all(selectTodoQuery);
  response.send(getTodoObject);
});

// Create a Todo API-4

app.post(
  "/todos/",
  validColumnValuesByRequestBody,
  async (request, response) => {
    const { id, todo, priority, status, category, dueDate } = request.body;
    const createTodoQuery = `
        INSERT INTO todo(id, todo, priority, status, category, due_date)
        VALUES(
            ${id},
            '${todo}',
            '${priority}',
            '${status}',
            '${category}',
            '${dueDate}'
        );
    `;
    await db.run(createTodoQuery);
    response.send("Todo Successfully Added");
  }
);

// Update Todo API-5

app.put(
  "/todos/:todoId/",
  validColumnValuesByRequestBody,
  async (request, response) => {
    const { todoId } = request.params;
    let updatedColumnName = "";
    const requestBody = request.body;
    switch (true) {
      case requestBody.todo !== undefined:
        updatedColumnName = "Todo";
        break;
      case requestBody.status !== undefined:
        updatedColumnName = "Status";
        break;
      case requestBody.category !== undefined:
        updatedColumnName = "Category";
        break;
      case requestBody.dueDate !== undefined:
        updatedColumnName = "Due Date";
        break;
      case requestBody.priority !== undefined:
        updatedColumnName = "Priority";
        break;
    }
    const selectTodoQuery = `
        SELECT * FROM todo WHERE id = ${todoId};
    `;
    const getTodoDetails = await db.get(selectTodoQuery);

    const {
      todo = getTodoDetails.todo,
      status = getTodoDetails.status,
      dueDate = getTodoDetails.due_date,
      category = getTodoDetails.category,
      priority = getTodoDetails.priority,
    } = request.body;
    const updateTodoQuery = `
        UPDATE todo
        SET
            todo = '${todo}',
            status = '${status}',
            category = '${category}',
            priority = '${priority}',
            due_date = '${dueDate}'
        WHERE id = ${todoId};
    `;
    await db.run(updateTodoQuery);
    response.send(`${updatedColumnName} Updated`);
  }
);

// Delete Todo API-6

app.delete("/todos/:todoId/", validColumnValues, async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
        DELETE FROM todo WHERE id = ${todoId};
    `;
  await db.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
