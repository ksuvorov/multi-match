export const apiUrl = (path: string) => {
    const base = process.env.NEXT_PUBLIC_APP_URL;
    if (!base) throw new Error('NEXT_PUBLIC_APP_URL is not set')
    return `${base}${path}`
}