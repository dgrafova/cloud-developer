const AWSXRay = require('aws-xray-sdk')
import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess {
  constructor(
    private readonly dynamoDBClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly grafTodoApp = process.env.TODO_TABLE,
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly userIdIndex = process.env.USER_INDEX,
    private readonly s3 = new AWS.S3({
      signatureVersion: 'v4'
    })
  ) {}

  async getTodos(userId: string) {
    const todos = await this.dynamoDBClient
      .query({
        TableName: this.grafTodoApp,
        IndexName: this.userIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    return todos
  }

  async createTodo(newTodo: TodoItem): Promise<TodoItem> {
    await this.dynamoDBClient
      .put({
        TableName: this.grafTodoApp,
        Item: newTodo
      })
      .promise()

    return newTodo
  }

  async updateTodo(
    itemToUpdate: UpdateTodoRequest,
    todoId: string,
    userId: string
  ) {
    console.log('Updating a todo...')

    const updatedTodo = await this.dynamoDBClient
      .update(
        {
          TableName: this.grafTodoApp,
          Key: { userId, todoId },
          ExpressionAttributeNames: { '#N': 'name' },
          UpdateExpression: 'set #N=:todoName, dueDate=:dueDate, done=:done',
          ExpressionAttributeValues: {
            ':todoName': itemToUpdate.name,
            ':dueDate': itemToUpdate.dueDate,
            ':done': itemToUpdate.done
          },
          ReturnValues: 'UPDATED_NEW'
        },
        function (err, data) {
          if (err) {
            const error = JSON.stringify(err, null, 2)
            console.error('Unable to update item. Error JSON:', error)
          } else {
            const updatedItem = JSON.stringify(data, null, 2)
            console.error('Successfully updated todo:', updatedItem)
          }
        }
      )
      .promise()

    return updatedTodo
  }

  async deleteTodo(todoId: string, userId: string) {
    await this.dynamoDBClient
      .delete(
        {
          TableName: this.grafTodoApp,
          Key: { userId, todoId }
        },
        function (err, data) {
          if (err) {
            const error = JSON.stringify(err, null, 2)
            console.error('Unable to delete the todo. Error JSON:', error)
          } else {
            const updatedItem = JSON.stringify(data, null, 2)
            console.log('Successfully deleted:', updatedItem)
          }
        }
      )
      .promise()
  }

  async generateUploadUrl(todoId: string, userId: string) {
    const imageUrl = this.getUploadUrl(todoId)

    await this.dynamoDBClient
      .update(
        {
          TableName: this.grafTodoApp,
          Key: { userId, todoId },
          UpdateExpression: 'set attachmentUrl=:attachmentUrl',
          ExpressionAttributeValues: {
            ':attachmentUrl': `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
          },
          ReturnValues: 'UPDATED_NEW'
        },
        function (err, data) {
          if (err) {
            const error = JSON.stringify(err, null, 2)
            console.error(
              'Error while saving the imageURL to the DynamoDB:',
              error
            )
          } else {
            const updatedItem = JSON.stringify(data, null, 2)
            console.log('ImageUrl updated successfully:', updatedItem)
          }
        }
      )
      .promise()

    return imageUrl
  }

  getUploadUrl(todoId: string) {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: parseInt(this.urlExpiration)
    })
  }
}
