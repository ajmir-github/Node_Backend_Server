const { exit , exitCode } = require("process")

const exitProgram = ()=> exit(exitCode)


module.exports = {
    exitProgram
}