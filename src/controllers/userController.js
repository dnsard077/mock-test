const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const response = require("../utils/response");
const { registerSchema, loginSchema } = require("../validators/userValidator");
const {
  encryptPin,
  checkPin,
  generateAccessToken,
} = require("../utils/helper");

const register = async (req, res) => {
  try {
    const userData = req.body;
    const { error } = registerSchema.validate(userData);
    if (error) {
      return response.res400(res, { error: error.details[0].message });
    }
    const hashedPin = await encryptPin(userData.pin);
    userData.pin = hashedPin;

    const user = await prisma.user.create({
      data: userData,
    });
    delete user.pin;

    return response.res201(res, user);
  } catch (err) {
    if (err.code === "P2002" && err.meta.target.includes("email")) {
      return response.res400(
        res,
        [],
        "Someone is already using the email you have chosen. Please try using another one instead."
      );
    }
    console.error("Error creating user:", err);
    return response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

const login = async (req, res) => {
  try {
    const userData = req.body;
    const { error } = loginSchema.validate(userData);
    if (error) {
      return response.res400(res, { error: error.details[0].message });
    }
    const { email, pin } = userData;
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return response.res404(res, "user not found");
    }

    const isPinCorrect = await checkPin(pin, user.pin);

    if (!isPinCorrect) {
      return response.res404(res, "wrong pin");
    }
    delete user.pin;
    const token = generateAccessToken(user);
    return response.res200(res, { user, token });
  } catch (error) {
    console.error("Error creating user:", error);
    return response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage, 10) || 10;

    const offset = (page - 1) * itemsPerPage;

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
      take: itemsPerPage,
      skip: offset,
    });

    if (users.length <= 0) {
      return response.res404(res, users);
    }

    return response.res200(res, users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    return response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.userid;
  if (!userId) {
    response.res400(res);
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
      select: {
        email: true,
        tasks: true,
      },
    });

    if (!user) {
      return response.res404(res, user);
    }

    return response.res200(res, user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    return response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

const updateUserById = async (req, res) => {
  try {
    const userId = req.params.userid;
    const updateData = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
    });

    if (!existingUser) {
      return response.res404(res, "user not found");
    }

    const partialUpdate = {};
    Object.keys(updateData).forEach(async (key) => {
      if (existingUser[key] !== undefined && key != "id") {
        if (key === "pin") {
          const hashedPin = await encryptPin(userData.pin);
          partialUpdate[key] = hashedPin;
        } else {
          partialUpdate[key] = updateData[key];
        }
      }
    });

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: partialUpdate,
    });

    response.res200(res, updatedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.userid;
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
    });

    if (!existingUser) {
      return response.res404(res, "user not found");
    }
    await prisma.user.delete({
      where: { id: parseInt(userId, 10) },
      include: { tasks: true },
    });
    response.res200(res, "User and associated tasks deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  login,
  register,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
