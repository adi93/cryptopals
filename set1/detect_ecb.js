function detect_ecb(buff) {
    let block_size = 16
    let m = new Map()
    for (let i=0; i<buff.length; i+= block_size) {
        block = buff.slice(i, i+block_size)
        count = m.get(block)
        if (count == undefined || count == null) {
            m.set(block, 0)
            count = 0
        }
        count += 1
        if (count > 1) {
            return true;
        }
        m.set(block_size, count)
        
    }
    return false;
}

