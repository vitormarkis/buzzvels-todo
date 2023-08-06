import { Redis } from "@upstash/redis"

// export const redis = Redis.fromEnv()
export const redis = new Redis({
  url: "https://national-parrot-45806.upstash.io",
  token:
    "AbLuASQgMzlmZWMzMGEtZDE4OS00ZjEwLWJkNzMtYTZiOWEzMWExNDU3N2E3ZTkyMDFhZjYzNGJhNWExOWJhNDU3YjFmZGU5OTA=",
})
