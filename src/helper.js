const generateId = () => Math.random().toString(36).substr(2, 6)

const keyExists = async (db, key) => {
    const user = await db.get(key)
    return user ? true : false
}

module.exports = {
    generateId, keyExists
}