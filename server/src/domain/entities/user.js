export default function User (name, email, password) {
  return Object.freeze({
    name,
    email,
    password
  })
}
