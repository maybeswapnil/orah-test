import { RolllStateType } from "./roll"

export interface Person {
  entity: any
  status: RolllStateType
  id: number
  first_name: string
  last_name: string
  photo_url?: string
}

export const PersonHelper = {
  getFullName: (p: Person) => `${p.first_name} ${p.last_name}`,
}
