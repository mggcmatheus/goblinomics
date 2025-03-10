export interface IRepository<T> {
  create(item: T): T
  read(id: number): T | null
  update(id: number, item: T): T | null
  delete(id: number): boolean
}
