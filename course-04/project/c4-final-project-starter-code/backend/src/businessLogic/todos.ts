import { TodosAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
const uuid = require('uuid')

const todosAccess = new TodosAccess()

export async function getTodos(userId: string) {
  return todosAccess.getTodos(userId)
}

export async function createTodo(newTodo: CreateTodoRequest, userId: string) {
  const todoId = uuid.v4()
  const timestamp = new Date().toISOString()

  const newItem = {
    todoId: todoId,
    createdAt: timestamp,
    userId: userId,
    done: false,
    ...newTodo
  }

  return todosAccess.createTodo(newItem)
}

export async function updateTodo(
  itemToUpdate: UpdateTodoRequest,
  todoId: string,
  userId: string
) {
  return todosAccess.updateTodo(itemToUpdate, todoId, userId)
}

export async function deleteTodo(todoId: string, userId: string) {
  return todosAccess.deleteTodo(todoId, userId)
}

export async function generateUploadUrl(todoId: string, userId: string) {
  return todosAccess.generateUploadUrl(todoId, userId)
}
