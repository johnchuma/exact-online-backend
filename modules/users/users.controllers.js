const { Op, Sequelize } = require("sequelize");
const { User } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { errorResponse, successResponse } = require("../../utils/responses");
const { randomNumber } = require("../../utils/random_number");

const findUserByUUID = async (uuid) => {
  try {
    const user = await User.findOne({
      where: {
        uuid,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const checkIfUserExists = async (phone) => {
  const user = await User.findOne({
    where: {
      phone,
    },
  });
  return user;
};
const addUser = async (req, res) => {
  try {
    let { name, phone } = req.body;
    let user = await checkIfUserExists(phone);
    if (user) {
      res.status(403).send({
        status: false,
        message: "Phone number is already used",
      });
    } else {
      let code = randomNumber();
      code = 123456;
      //send verfication code sms
      user = await User.create({
        name,
        phone,
        passcode: code,
      });
      successResponse(res, {
        status: true,
        message: "Verification code is sent to your phone number",
      });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const sendVerificationCode = async (req, res) => {
  try {
    let { phone } = req.body;
    let user = await checkIfUserExists(phone);
    if (user) {
      let code = randomNumber();
      code = 123456;
      //send verfication code sms
      user = await User.update({
        passcode: code,
      });

      successResponse(res, {
        status: true,
        message: "Verification code is sent to your phone number",
      });
    } else {
      res.status(403).send({
        status: false,
        message: "User does not exist",
      });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const verifyCode = async (req, res) => {
  try {
    let { phone, passcode } = req.body;
    let user = await checkIfUserExists(phone);
    if (user) {
      if (user.passcode == passcode) {
        const token = generateJwtTokens(user);
        successResponse(res, {
          status: true,
          message: "Logged in successfully",
          token,
        });
        await User.update({
          passcode: null,
        });
      } else {
        res.status(401).send({
          status: false,
          message: "Invalid verification code",
        });
      }
    } else {
      res.status(403).send({
        status: false,
        message: "User does not exist",
      });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};

const getUsers = async (req, res) => {
  try {
    const response = await User.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
      },
      attributes: {
        exclude: ["id"],
      },
    });
    successResponse(res, {
      count: response.count,
      page: req.page,
      ...response,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

const getUserInfo = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    successResponse(res, user);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getMyInfo = async (req, res) => {
  try {
    const user = req.user;
    const response = await findUserByUUID(user.uuid);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteUser = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    const response = await user.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    const response = await user.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  findUserByUUID,
  getUsers,
  deleteUser,
  getUserInfo,
  checkIfUserExists,
  addUser,
  verifyCode,
  sendVerificationCode,
  getMyInfo,
  updateUser,
};
