const generateId = () => Math.random().toString(36).substr(2, 6)

const keyExists = async (db, key) => {
    const user = await db.get(key)
    return user ? true : false
}

const sanitizeLink = (link) => {
    let base = "https://chat.whatsapp.com/"
    return link.includes('whatsapp') ? base + link.split('/').splice(-1)[0] : base + link
}

module.exports = {
    generateId, keyExists, sanitizeLink
}