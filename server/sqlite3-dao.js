"use strict"

import { TodoDao } from "./sqlite3-todo-dao";
import { UserDao } from "./sqlite3-user-dao";

export function Status(status, message) {
  this.status = status;
  this.message = message;
}

export { TodoDao, UserDao, Status };
