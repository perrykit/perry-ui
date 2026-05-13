import { createInterface } from "readline"

export async function confirm(message: string, defaultVal = false): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const suffix = defaultVal ? " [Y/n]" : " [y/N]"

  return new Promise((resolve) => {
    rl.question(`${message}${suffix} `, (answer) => {
      rl.close()
      const a = answer.trim().toLowerCase()
      if (a === "") return resolve(defaultVal)
      if (a === "y" || a === "yes") return resolve(true)
      if (a === "n" || a === "no") return resolve(false)
      resolve(defaultVal)
    })
  })
}

export async function select(message: string, options: string[], defaultIndex = 0): Promise<string> {
  console.log(`\n${message}\n`)
  options.forEach((opt, i) => {
    const marker = i === defaultIndex ? ">" : " "
    console.log(`  ${marker} ${i + 1}. ${opt}`)
  })

  const rl = createInterface({ input: process.stdin, output: process.stdout })

  return new Promise((resolve) => {
    rl.question(`\nEnter number (default ${defaultIndex + 1}): `, (answer) => {
      rl.close()
      const n = parseInt(answer.trim(), 10)
      if (isNaN(n) || n < 1 || n > options.length) {
        resolve(options[defaultIndex])
      } else {
        resolve(options[n - 1])
      }
    })
  })
}

export async function input(message: string, defaultVal = ""): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const suffix = defaultVal ? ` (${defaultVal})` : ""

  return new Promise((resolve) => {
    rl.question(`${message}${suffix}: `, (answer) => {
      rl.close()
      resolve(answer.trim() || defaultVal)
    })
  })
}
