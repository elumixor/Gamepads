const fs = require('fs')
const {parse, stringify} = require('svgson')

let width, height

function parseCommand(command) {
    const c = command[0]
    const split = command.slice(1).split(' ')
    return {command: c, x: parseFloat(split[0]) / width, y: parseFloat(split[1]) / height}
}

function applyCommand(command, x, y, last) {
    if (command === "L") return [x, y]
    if (command === "V") return [x, last[1]]
    if (command === "H") return [last.x, x]
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

const parts_front = {
    '#FF0000': 'left stick',
    '#FF00A8': 'buttons',
    '#0029FF': 'd-pad',
    '#00FF47': 'right stick',
    '#FA00FF': 'start select',
    'black': 'bumpers'
}

const parts_back = {
    '#00FFF0': 'side rails',
    '#FF0000': 'rt lt',
    '#001AFF': 'bumpers',
    '#FF067E': 'battery pack'
}


const regions_front = {}
const regions_back = {}

const product = 'xbox'
const name = 'back'

const parts = name === 'front' ? parts_front : parts_back
const regions = name === 'front' ? regions_front : regions_back

Object.values(parts).forEach(p => regions[p] = [])

const src = `./${product}_${name}.svg`
const target = `./${product}_${name}.json`

const content = fs.readFileSync(src, 'utf8')
parse(content).then(json => {
    width = parseFloat(json.attributes.width)
    height = parseFloat(json.attributes.height)

    const paths = json.children.find(c => c.name === 'g').children.map(p => {
        // return {part: parts_back[p.attributes.stroke], path: p.attributes.d}
        return {selectedPart: parts[p.attributes.stroke], path: p.attributes.d}
    })


    paths.forEach(({selectedPart, path}) => {
        const commands = path.slice(0, path.length - 1).split(/(?=[LMCVH])/)
        const points = processCommands(commands)
        regions[selectedPart].push(points)
    })

    fs.writeFileSync(target, JSON.stringify(regions))
})
// console.log(content)
