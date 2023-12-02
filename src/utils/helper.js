const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const salt = 10;

async function encryptPin(password) {
  try {
    const encryptedPassword = await bcrypt.hash(password, salt);
    return encryptedPassword;
  } catch (e) {
    throw new Error(e);
  }
}
async function checkPin(password, encryptedPassword) {
  try {
    const isCorrect = await bcrypt.compare(password, encryptedPassword);
    return isCorrect;
  } catch (e) {
    throw new Error(e);
  }
}
function generateAccessToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '3H' });
}

function decodeJWT(token) {
  if (!token) return null
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error.message);
    return null;
  }
}

function extractJWTFromHeader(req) {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    return null;
  }
  const [bearer, token] = authorizationHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

module.exports = { encryptPin, checkPin, generateAccessToken, decodeJWT, extractJWTFromHeader };
