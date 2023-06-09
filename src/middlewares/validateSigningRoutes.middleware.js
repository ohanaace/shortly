import bcrypt from "bcrypt"
import { findUserDB } from "../repositories/signing.repositories.js"

export async function validateSignUp(req, res, next) {
    const { email } = req.body

    const existingEmail = await findUserDB(email)
    if (existingEmail.rowCount) return res.status(409).send({ message: "E-mail já cadastrado" })
    next()
}

export async function validateSignIn(req, res, next) {
    const { email, password } = req.body

    const existingEmail = await findUserDB(email)
    if (!existingEmail.rowCount) return res.status(401).send({ message: "Usuário e/ou senha inválidos" })
    const correctPassword = bcrypt.compareSync(password, existingEmail.rows[0].password)
    if(!correctPassword) return res.status(401).send({ message: "Usuário e/ou senha inválidos" })
    
    const {id, name} = existingEmail.rows[0]
    res.locals.userId = id
    res.locals.userName = name
    next()
}