const generateId = () => Math.random().toString(36).substr(2, 6)

const keyExists = async (db, key) => {
    const user = await db.get(key)
    return user ? true : false
}

const findGroupPosition = (count) => {
    let max = 255
    let position = -1;
    while (count >= 0){ count -= max; position++ }
    return position
}

module.exports = {
    generateId, keyExists, findGroupPosition
}