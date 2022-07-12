const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models');

const secret = process.env.JWT_SECRET;

const validateBody = (body, res) => {
  const { username, password } = body;

  if (!username || !password) {
    res
      .status(401)
      .json({ message: 'É necessário usuário e senha para fazer login' });
    return false;
  }

  return true;
};

module.exports = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!validateBody(req.body, res)) return;
    const user = await User.findOne({ where: { username } });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Usuário não existe ou senha inválida' });
    }
    const jwtConfig = {
      expiresIn: '7d',
      algorithm: 'HS256',
    };
    const token = jwt.sign({ data: user }, secret, jwtConfig);
    return res.status(200).json({ token });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Erro interno', error: err.message });
  }
};
