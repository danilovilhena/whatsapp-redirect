const express = require('express')
const { Deta } = require('deta')
const { findGroupPosition, sanitizeLink } = require('./helper.js') 

const router = new express.Router()
const deta = Deta('b0t6xspl_PfV5pfhncSNXq84EkMki2FtjUrXMH57R')
const db = deta.Base('whatsapp')

// UPDATE - Append link to user's array
router.post('/:key/add', async (req, res) => {
    const key = req.params.key
    const user = await db.get(key)
    
    if(user){
        let link = req.query.link || req.body.link

        if(!link) return res.status(400).send({error: 'Group link was not passed.'})
        link = sanitizeLink(link)
        if(user.links.includes(link)) return res.status(400).send({error: 'Group link is already included.'})
        
        const updates = { 'links': db.util.append(link) }

        await db.update(updates, key)
            .then(() => res.status(200).send({message: `New link added successfully! This was the added link: ${link}`}))
            .catch(error => res.status(400).send({error}))
    } else res.status(404).send({error: 'User not found.'})
})

// GET - Get/redirect to current link
router.get('/:key', async (req, res) => {
    const key = req.params.key
    const redirect = req.query.redirect || false
    const user = await db.get(key)

    if(user){
        await db.update({'count': db.util.increment(1)}, key)
            .then(() => {})
            .catch(error => res.status(400).send({error}))
            
        if(user.links.length == 0) return res.status(400).send({error: "There aren't any links added to this user."}) 

        let index = findGroupPosition(user.count + 1)
        let link = user.links[index]

        return redirect ? res.redirect(link) : res.status(200).send({ link })
    }
    else res.status(404).send({error: 'User not found.'})
})

module.exports = router