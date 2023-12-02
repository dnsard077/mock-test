const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const response = require("../utils/response");
const router = express.Router();
const { addTaskSchema } = require("../validators/taskValidator");
const {
  decodeJWT, extractJWTFromHeader
} = require("../utils/helper");

const getTaskByUserId = async (req, res) => {
  try {
    const userId = decodeJWT(extractJWTFromHeader(req))?.userId?.id||req.params.userid;
    if (!userId){
      return response.res401(res, "Expired Login")
    }
    const tasks = await prisma.task.findMany({
      where: { userId: parseInt(userId, 10) },
    });
    if (!tasks || tasks.length <=0) {
      return response.res404(res, []);
    }
    return response.res200(res, tasks);
  } catch (error) {
    console.error("Error getting tasks:", error);
    response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

const addTask = async (req, res) => {
  try {
    const userReq = req.body;
    userReq.userId = parseInt(userReq.userId, 10)
    const { error } = addTaskSchema.validate(userReq);
    if (error) {
      return response.res400(res, { error: error.details[0].message });
    }
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(userReq.userId, 10) },
    });

    if (!existingUser) {
      return response.res404(res, "user not found");
    }
    const newTask = await prisma.task.create({
      data: userReq
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error adding task:", error);
    response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

const updateTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskid, 10);
    const updateData = req.body;
    
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return response.res404(res, "task not found");
    }

    const partialUpdate = {};
    Object.keys(updateData).forEach(async (key) => {
      if (existingTask[key] !== undefined && !key in ["id", "userId"] ) {
          partialUpdate[key] = updateData[key];
      }
    });

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: partialUpdate,
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Error adding task:", error);
    response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskid, 10);

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return response.res404(res, "task not found");
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return response.res200(res, "Task deleted successfully");
  } catch (error) {
    console.error("Error adding task:", error);
    response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = { getTaskByUserId, addTask, updateTask, deleteTask };
