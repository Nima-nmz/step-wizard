export interface MockUser {
  id: number
  phoneNumber: string
  firstName: string
  lastName: string
  nationalId: string
  birthDate: string
  email: string | null
  avatarUrl: string | null
  idCardUrl: string | null
  iban: string | null
  bankName: string | null
  accountNumber: string | null
  createdAt: string
  updatedAt: string
}

const users: Map<string, MockUser> = new Map()
let nextId = 1

export function findUserByToken(token: string): MockUser | undefined {
  return users.get(token)
}

export function getOrCreateUser(token: string, data?: Partial<MockUser>): MockUser {
  let user = users.get(token)
  if (!user) {
    user = {
      id: nextId++,
      phoneNumber: data?.phoneNumber || '09000000000',
      firstName: data?.firstName || '',
      lastName: data?.lastName || '',
      nationalId: data?.nationalId || '',
      birthDate: data?.birthDate || '',
      email: data?.email || null,
      avatarUrl: data?.avatarUrl || null,
      idCardUrl: data?.idCardUrl || null,
      iban: data?.iban || null,
      bankName: data?.bankName || null,
      accountNumber: data?.accountNumber || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    users.set(token, user)
  } else if (data) {
    Object.assign(user, data, { updatedAt: new Date().toISOString() })
  }
  return user
}

export function updateUser(token: string, data: Partial<MockUser>): MockUser | undefined {
  const user = users.get(token)
  if (!user) return undefined
  const updated = { ...user, ...data, updatedAt: new Date().toISOString() }
  users.set(token, updated)
  return updated
}
