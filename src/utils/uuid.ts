export const generateUUID = () : string => {
  let d: number = new Date().getTime()
  const uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}

export const generateColor = (): string => `#${Math.floor(Math.random() * 16777215).toString(16)}`
