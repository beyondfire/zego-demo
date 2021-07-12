const debug = (msg) => {
    console.log(`%c${msg}`,`font-size:18px;color:#4E6EF2`)
}

const error = (msg) => {
    console.log(`%c${msg}`,`font-size:18px;color:#e54d42`)
}

const success = (msg) => {
    console.log(`%c${msg}`,`font-size:18px;color:#8dc63f`)
}

const warning = (msg) => {
    console.log(`%c${msg}`,`font-size:18px;color:#fbbd08`)
}

const mark = (msg) => {
    console.log(`%c${msg}`,`font-size:18px;color:#9c26b0`)
}

const utils = {
    debug,
    error,
    success,
    warning,
    mark
}

export default utils;