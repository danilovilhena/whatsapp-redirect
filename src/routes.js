const express = require('express')
const slugify = require('slugify')
const { Deta } = require('deta')
const { generateId, keyExists } = require('./helper.js') 

const router = new express.Router()
const deta = Deta('b0t6xspl_PfV5pfhncSNXq84EkMki2FtjUrXMH57R')
const db = deta.Base('whatsapp')

router.get('/', async (req, res) => { 
    res.send('Hello World!')
    // res.redirect('https://github.com/danilovilhena/whatsapp-redirect');
})

// Create a new object in the database 
// Can receive a "key" parameter in BODY or QUERY
router.post('/create', async (req, res) => {
    const obj = { key: generateId(), createdAt: new Date().toLocaleString(), count: 0, groups: [], slug: false }

    // Check if generated key is used and if so generate another
    if(await keyExists(db, obj.key)) obj.key = generateId()

    // Check if a key was passed
    if(req.query.key || req.body.key) {
        obj.key = req.query.key || slugify(req.body.key)
        obj.slug = true
    }
    
    // Check if key is already used
    if(obj.slug && await keyExists(db, obj.key)){
        res.status(400).send("Ops! The key you passed is already in use.")
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

// Adds a link to a previously created object
// QUERY case: /add?key=something&link=E7XVpkrLPBy2O1PFB5rRr9
// BODY case: { key: "something", link: "https://chat.whatsapp.com/E7XVpkrLPBy2O1PFB5rRr9" }
router.post('/add', async (req, res) => {
    const key = req.query.key || req.body.key
    if(key){
        const user = await db.get(key)
        
        if(user){
            let link = req.query.link || req.body.link
    
            if(!link) res.status(400).send('Group link was not passed.')
            if(!link.includes('whatsapp')) link = "https://chat.whatsapp.com/" + link
            if(user.groups.includes(link)) res.status(400).send('Group link is already included.')
            
            const updates = { "groups": db.util.append(link) }
    
            await db.update(updates, key)
              .then(() => { res.status(200).send('New link added successfully!') })
              .catch(err => res.status(400).send(err))
        } else res.status(404).send('User not found.')
    } 
    else res.status(404).send('Key was not passed.')
})

module.exports = router

/* Possible routes:
/ -  redirect to README
/create - create object in the database
/add - add link inside that object
/link - send the link back (check if it's possible to redirect)
*/