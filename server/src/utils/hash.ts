import { genSaltSync, hashSync } from "bcryptjs"

const hashPass = (pass: string): string => {
  const salt = genSaltSync(12)
  return hashSync(pass, salt)
}

export default {
  hashPass,
}
