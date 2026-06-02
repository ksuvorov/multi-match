export function parseWKBPoint(hex: string): { lat: number; lng: number } {
    const buf = Buffer.from(hex, 'hex')
    const hasSRID = !!(buf.readUInt32LE(1) & 0x20000000)
    let offset = 5
    if (hasSRID) offset += 4
    const lng = buf.readDoubleLE(offset)
    const lat = buf.readDoubleLE(offset + 8)
    return { lng, lat }
}