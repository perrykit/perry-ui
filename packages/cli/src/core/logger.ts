const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  gray: "\x1b[90m",
}

export const logger = {
  info(msg: string) {
    console.log(`${COLORS.blue}i${COLORS.reset} ${msg}`)
  },

  success(msg: string) {
    console.log(`${COLORS.green}\u2714${COLORS.reset} ${msg}`)
  },

  warn(msg: string) {
    console.log(`${COLORS.yellow}\u26A0${COLORS.reset} ${msg}`)
  },

  error(msg: string) {
    console.error(`${COLORS.red}\u2718${COLORS.reset} ${msg}`)
  },

  dim(msg: string) {
    console.log(`${COLORS.dim}${msg}${COLORS.reset}`)
  },

  bold(msg: string) {
    console.log(`${COLORS.bold}${msg}${COLORS.reset}`)
  },

  newline() {
    console.log()
  },

  step(msg: string) {
    console.log(`${COLORS.gray}\u2502${COLORS.reset} ${msg}`)
  },

  heading(msg: string) {
    console.log(`\n${COLORS.bold}${msg}${COLORS.reset}\n`)
  },
}
