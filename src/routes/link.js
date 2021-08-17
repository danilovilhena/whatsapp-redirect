const express = require('express')
const { Deta } = require('deta')
const { sanitizeLink } = require('../helper.js') 

const router = new express.Router()
const deta = Deta('b0t6xspl_PfV5pfhncSNXq84EkMki2FtjUrXMH57R')
const db = deta.Base('whatsapp')

// READ - Get/redirect to current link
router.get('/:key', async (req, res) => {
    const key = req.params.key
    const redirect = req.query.redirect || false
    const user = await db.get(key)

    if(user){
        // Increase user count
        await db.update({'count': db.util.increment(1)}, key)
            .then(() => {})
            .catch(error => res.status(400).send({error}))
            
        if(user.links.length == 0) return res.status(400).send({error: "There aren't any links added to this user."}) 

        // Find first link not full
        let currentLink = user.links.find(el => !el.full)

        // Increment link counter
        currentLink.count += 1
        
        // Check if link counter passed limit after increment, if so change it to full
        if(currentLink.count >= (user.limit || 255) + (currentLink.additional || 0)) currentLink.full = true

        // Update the database
        user.links[user.links.indexOf(currentLink)] = currentLink
        await db.update({'links': user.links}, key)
            .then(() => {})
            .catch(error => res.status(400).send({error}))

        // Redirect or send link inside JSON
        return redirect ? res.redirect(currentLink.link) : res.status(200).send({ link: currentLink.link })
    }
    else res.status(404).send({error: 'User not found.'})
})

// UPDATE - Add link to user
router.post('/:key/add', async (req, res) => {
    const key = req.params.key
    const user = await db.get(key)
    
    if(user){
        let link = req.query.link || req.body.link

        if(!link) return res.status(400).send({error: 'Group link was not passed.'})
        link = sanitizeLink(link)
        if(user.links.some(el => el.link === link)) return res.status(400).send({error: 'Group link is already included.'})

        let linkObj = { id: user.links.length, link, count: 0, full: false, additional: 0 }
        
        const updates = { 'links': db.util.append(linkObj) }

        await db.update(updates, key)
            .then(() => res.status(200).send({message: `New link added successfully! This was the added link: ${link}`}))
            .catch(error => res.status(400).send({error}))
    } else res.status(404).send({error: 'User not found.'})
})

// UPDATE - Update link to full
router.post('/:key/full', async (req, res) => {
    const key = req.params.key
    const user = await db.get(key)

    if(user){
        let link = req.query.link || req.body.link
        if(!link) return res.status(400).send({error: 'Group link was not passed.'})
        link = sanitizeLink(link)

        if(user.links.some(el => el.link === link)){
            let index = user.links.findIndex((el) => el.link == link)
            user.links[index].full = true

            const updates = { 'links': user.links }

            await db.update(updates, key)
                .then(() => res.status(200).send({message: `Link ${link} updated to full!`}))
                .catch(error => res.status(400).send({error}))
        } 
        else return res.status(400).send({error: 'Group link is not included.'})
    } else res.status(404).send({error: 'User not found.'})
})

// UPDATE - Add additional clicks to link
router.post('/:key/additional', async (req, res) => {
    const key = req.params.key
    const user = await db.get(key)

    if(user){
        let link = req.query.link || req.body.link
        if(!link) return res.status(400).send({error: 'Group link was not passed.'})
        link = sanitizeLink(link)

        if(user.links.some(el => el.link === link)){
            const amount = req.query.amount || req.body.amount
            if(!amount) return res.status(400).send({error: 'Additional amount was not passed.'})

            let index = user.links.findIndex((el) => el.link == link)
            user.links[index].amount += +amount

            const updates = { 'links': user.links }

            await db.update(updates, key)
                .then(() => res.status(200).send({message: `Added ${amount} additional clicks to the link: ${link}.`}))
                .catch(error => res.status(400).send({error}))
        } 
        else return res.status(400).send({error: 'Group link is not included.'})
    } else res.status(404).send({error: 'User not found.'})
})

// DELETE - Delete link from user
router.delete('/:key/remove', async (req, res) => {
    const key = req.params.key
    const user = await db.get(key)

    if(user){
        let link = req.query.link || req.body.link
        if(!link) return res.status(400).send({error: 'Group link was not passed.'})
        link = sanitizeLink(link)

        if(user.links.some(el => el.link === link)){
            const updates = { 'links': user.links.filter((el) => el.link != link) }

            await db.update(updates, key)
                .then(() => res.status(200).send({message: `Link removed successfully! This was the removed link: ${link}`}))
                .catch(error => res.status(400).send({error}))
        } 
        else return res.status(400).send({error: 'Group link is not included.'})
    } else res.status(404).send({error: 'User not found.'})
})

// DELETE - Delete all links from user
router.delete('/:key/removeall', async (req, res) => {
    const key = req.params.key
    const user = await db.get(key)

    if(user){
        const updates = { 'links': [] }
        await db.update(updates, key)
            .then(() => res.status(200).send({message: 'All links removed successfully!'}))
            .catch(error => res.status(400).send({error}))
    } else res.status(404).send({error: 'User not found.'})
})

module.exports = router