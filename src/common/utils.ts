export const getNewId = (prefix: string) => {
    return `${prefix}_${Math.floor(
        1000 + Math.random() * 900000
    ).toString()}`;
}
