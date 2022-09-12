import { keyPressed, onKey } from 'kontra';

const mappings = {}
export const onKeyPressed = (keyName, handler) => {
    mappings[keyName] = false;
    onKey([keyName], (e) => {
        if (!mappings[keyName]) {
            mappings[keyName] = true;
            handler(e)
        }
    }, { handler: 'keydown' })
    onKey([keyName], (e) => {
        mappings[keyName] = false;
    }, { handler: 'keyup' })
}
