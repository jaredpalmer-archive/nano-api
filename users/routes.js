import { Router } from 'express'
import User from './model'
const router = new Router()

router.get('/', (req, res, next) => {
  User.getAll({ limit: 25, skip: 0 }).then(user => {
    res.status(200).json(user)
  }).catch(e => next(e))
})

router.post('/', (req, res, next) => {
  const { username, password, email } = req.body
  User.create({ username, password, email }).then(user => {
    res.status(200).json(user)
  }).catch(e => next(e))
})

export default router
