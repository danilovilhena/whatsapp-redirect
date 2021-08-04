const express = require('express')
const { Deta } = require('deta')
const { generateId, keyExists, findGroupPosition } = require('./helper.js') 

const router = new express.Router()
const deta = Deta('b0t6xspl_PfV5pfhncSNXq84EkMki2FtjUrXMH57R')
const db = deta.Base('whatsapp')

// Creates a new user in the database. Can accept a "key" parameter
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
        return res.status(400).send("Ops! The key you passed is already in use.")
    }
    
    // Put the object in the database
    db.put(obj)
      .then(() => {
        obj.slug ?
          res.status(200).send(`Done! The key you passed is available. Just to remind you, here it is: ${obj.key}`) :
          res.status(200).send(`Done! Here is your key: ${obj.key}`)
      })
      .catch(err => res.status(400).send(err))
})

// Adds a link to the array by key
router.post('/:key/add', async (req, res) => {
    const key = req.params.key
    const user = await db.get(key)
    
    if(user){
        let link = req.query.link || req.body.link

        if(!link) return res.status(400).send('Group link was not passed.')
        if(!link.includes('whatsapp')) link = "https://chat.whatsapp.com/" + link
        if(user.links.includes(link)) return res.status(400).send('Group link is already included.')
        
        const updates = { "links": db.util.append(link) }

        await db.update(updates, key)
            .then(() => { res.status(200).send('New link added successfully!') })
            .catch(err => res.status(400).send(err))
    } else res.status(404).send('User not found.')
})

// Redirects to current link by key
router.get('/:key', async (req, res) => {
    const key = req.params.key
    const redirect = req.query.redirect || false
    const user = await db.get(key)

    if(user){
        await db.update({"count": db.util.increment(1)}, key)
            .then(() => {})
            .catch(err => res.status(400).send(err))

        let index = findGroupPosition(user.count + 1)
        let link = user.links[index]

        redirect ? res.redirect(link) : res.status(200).send({ link })
        
    }
    else res.status(404).send('User not found.')
})

// Returns user information by key
router.get('/:key/info', async (req, res) => {
    const key = req.params.key
    if(key){
        const user = await db.get(key)
        delete user.slug
        user ? res.status(200).send({...user}) : res.status(404).send('User not found.')            
    } 
    else res.status(404).send('Key was not passed.')
})

module.exports = router