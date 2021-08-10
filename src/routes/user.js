const express = require('express')
const { Deta } = require('deta')
const { generateId, keyExists } = require('../helper.js') 

const router = new express.Router()
const deta = Deta('b0t6xspl_PfV5pfhncSNXq84EkMki2FtjUrXMH57R')
const db = deta.Base('whatsapp')

// CREATE - Create new user
router.post(['/', '/:key'], async (req, res) => {
    const obj = { key: generateId(), createdAt: new Date(), count: 0, links: [], slug: false }

    // Check if generated key is used and if so generate another
    if(await keyExists(db, obj.key)) obj.key = generateId()

    // Check if a key was passed
    if(req.params.key) {
        obj.key = req.params.key
        obj.slug = true
    }
    
    // Check if key is already used
    if(obj.slug && await keyExists(db, obj.key)){
        return res.status(400).send({error: 'Ops! The key you passed is already in use.'})
    }
    
    // Put the object in the database
    db.put(obj)
        .then(() => 
            res.status(200).send({
                message: (obj.slug ? `Done! The key you passed is available. Just to remind you, here it is: ${obj.key}` : `Done! Here is your key: ${obj.key}`),
                key: obj.key
            })
        )
        .catch(error => res.status(400).send({error}))
})

// READ - Get user information
router.get('/:key/info', async (req, res) => {
    const key = req.params.key
    
    if(key){
        const user = await db.get(key)
        if(user){
            delete user.slug
            return res.status(200).send({...user})           
        } else res.status(404).send({error: 'User not found.'})
    } 
    else res.status(404).send({error: 'Key was not passed.'})
})

// DELETE - Delete user
router.delete('/:key', async (req, res) => {
    const key = req.params.key
    
    if(key){
        db.delete(key)
            .then(() => 
                res.status(200).send({ message: (`Farewell! The user ${key} has been successfully deleted.`)})
            )
            .catch(error => res.status(400).send({error}))
    } 
    else res.status(404).send({error: 'Key was not passed.'})
})

module.exports = router