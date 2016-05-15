import { Router } from 'express'
import Email from './model'
const router = new Router()

router.get('/', (req, res, next) => {
  Email.getAll({ limit: 25 }).then(emails => {
    res.status(200).json(emails)
  }).catch(e => next(e))
})

router.post('/', (req, res, next) => {
  const { subject, preheader } = req.body
  Email.create({ subject, preheader }).then(email => {
    res.status(200).json(email)
  }).catch(e => next(e))
})

export default router
