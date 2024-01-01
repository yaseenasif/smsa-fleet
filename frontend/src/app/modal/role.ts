export interface Role {
  id: number | null | undefined
  name: string | null | undefined
  permissions: Array<{
    id: number | null | undefined
    name: string | null | undefined
  }>
}
