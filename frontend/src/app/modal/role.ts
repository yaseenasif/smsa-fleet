export interface Role {
    id: Number | null | undefined
    name: String | null | undefined
    permissions: Array< {
            id: Number | null | undefined
            name: String | null | undefined              
        }>
}