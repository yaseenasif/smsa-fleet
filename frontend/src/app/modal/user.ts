export interface User {

    id: Number | null | undefined,
    name: String | null | undefined,
    email: String | null | undefined,
    password: String | null | undefined,
    roles: Array< {
        id: Number | null | undefined
        name: String | null | undefined
        permissions: Array< {
            id: Number | null | undefined
            name: String | null | undefined              
        }>
    }>

}