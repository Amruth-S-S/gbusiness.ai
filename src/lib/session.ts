import crypto from "crypto"

export function getOrCreateSessionId() {
  let sessionId: string | null = sessionStorage.getItem("sessionId")

  if (!sessionId) {
    sessionId = crypto.randomBytes(16).toString("hex")
    sessionStorage.setItem("sessionId", sessionId)
  }

  return sessionId
}
