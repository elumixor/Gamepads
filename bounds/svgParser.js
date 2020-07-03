const fs = require('fs')
const {parseSync, stringify} = require('svgson')

let width, height

function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max)
}

function parseCommand(command) {
    const c = command[0]
    const split = command.slice(1).split(' ')
    return {
        command: c,
        x: clamp(parseFloat(split[0]) / width, 0, 1),
        y: clamp(parseFloat(split[1]) / height, 0, 1)
    }
}

function applyCommand(command, x, y, last) {
    if (command === "L") return [x, y]
    if (command === "V") return [last[0], x]
    if (command === "H") return [x, last[1]]
}

function processCommands(commands) {
    const {x, y} = parseCommand(commands[0])
    let last = [x, y]
    const points = [last]

    for (let i = 1; i < commands.length; i++) {
        const {command, x, y} = parseCommand(commands[i])
        last = applyCommand(command, x, y, last)
        points.push(last)
    }

    return points
}

const parts2Colors = require("./partsDefinition.json")
const products = Object.keys(parts2Colors)

const colors2Parts = {}
const bounds = {}


for (const p of products) {
    colors2Parts[p] = {front: {}, back: {}}
    bounds[p] = {front: {}, back: {}}

    for (const [key, value] of Object.entries(parts2Colors[p].front)) {
        colors2Parts[p].front[value] = key
        bounds[p].front[key] = []
    }
    for (const [key, value] of Object.entries(parts2Colors[p].back)) {
        colors2Parts[p].back[value] = key
        bounds[p].back[key] = []
    }
}
const files = {}
for (const p of products) files[p] = {front: `./svg/${p}Front.svg`, back: `./svg/${p}Back.svg`}

for (const p of products) {
    const front = fs.readFileSync(files[p].front, 'utf-8')
    const back = fs.readFileSync(files[p].back, 'utf-8')

    let json = parseSync(front)

    width = parseFloat(json.attributes.width)
    height = parseFloat(json.attributes.height)

    let paths = json.children.filter(c => c.name === 'path').map(path => {
        return {part: colors2Parts[p].front[path.attributes.stroke], path: path.attributes.d}
    })
    for (const {part, path} of paths) {
        const commands = path.slice(0, path.length - 1).split(/(?=[LMCVH])/)
        const points = processCommands(commands)
        bounds[p].front[part].push(points)
    }

    json = parseSync(back)

    width = parseFloat(json.attributes.width)
    height = parseFloat(json.attributes.height)

    paths = json.children.filter(c => c.name === 'path').map(path => {
        return {part: colors2Parts[p].back[path.attributes.stroke], path: path.attributes.d}
    })

    for (const {part, path} of paths) {
        const commands = path.slice(0, path.length - 1).split(/(?=[LMCVH])/)
        const points = processCommands(commands)
        bounds[p].back[part].push(points)
    }
}

fs.writeFileSync('bounds.json', JSON.stringify(bounds))
