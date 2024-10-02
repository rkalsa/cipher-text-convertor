document.getElementById('cipherForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const text = document.getElementById('text').value;
    const cipher = document.getElementById('cipher').value;
    const operation = document.getElementById('operation').value;
    const key = document.getElementById('key').value;
    let result = '';

    switch (cipher) {
        case 'caesar':
            const shift = parseInt(key);
            if (isNaN(shift)) {
                alert('Please enter a valid number for Caesar Cipher shift.');
                return;
            }
            result = operation === 'encrypt' ? caesarEncrypt(text, shift) : caesarEncrypt(text, -shift);
            break;

        case 'vigenere':
            if (!key) {
                alert('Please enter a key for Vigenère Cipher.');
                return;
            }
            result = operation === 'encrypt' ? vigenereEncrypt(text, key) : vigenereDecrypt(text, key);
            break;

        case 'transposition':
            const columns = parseInt(key);
            if (isNaN(columns) || columns <= 0) {
                alert('Please enter a valid positive number for Transposition Cipher columns.');
                return;
            }
            result = operation === 'encrypt' ? transpositionEncrypt(text, columns) : transpositionDecrypt(text, columns);
            break;

        case 'railFence':
            const rails = parseInt(key);
            if (isNaN(rails) || rails <= 0) {
                alert('Please enter a valid positive number for Rail Fence Cipher rails.');
                return;
            }
            result = operation === 'encrypt' ? railFenceEncrypt(text, rails) : railFenceDecrypt(text, rails);
            break;

        default:
            alert('Invalid cipher selected.');
            return;
    }

    document.getElementById('output').textContent = result;
});

function caesarEncrypt(text, shift) {
    shift = shift % 26; 
    return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const base = code >= 65 && code <= 90 ? 65 : 97;
            return String.fromCharCode(((code - base + shift + 26) % 26) + base);
        }
        return char;
    }).join('');
}

function vigenereEncrypt(text, key) {
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    let keyIndex = 0;

    for (const char of text) {
        if (char.match(/[a-z]/i)) {
            const shift = key.charCodeAt(keyIndex % key.length) - 65;
            result += caesarEncrypt(char, shift);
            keyIndex++;
        } else {
            result += char;
        }
    }
    return result;
}

function vigenereDecrypt(text, key) {
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    let keyIndex = 0;

    for (const char of text) {
        if (char.match(/[a-z]/i)) {
            const shift = -(key.charCodeAt(keyIndex % key.length) - 65);
            result += caesarEncrypt(char, shift);
            keyIndex++;
        } else {
            result += char;
        }
    }
    return result;
}

function transpositionEncrypt(text, key) {
    let result = '';
    const columns = Array.from({ length: key }, () => '');
    
    for (let i = 0; i < text.length; i++) {
        columns[i % key] += text[i];
    }
    
    result = columns.join('');
    return result;
}

function transpositionDecrypt(text, key) {
    const n = text.length;
    const numCols = Math.ceil(n / key);
    const numRows = key;
    const shaded = numCols * numRows - n;
    const plaintext = Array.from({ length: numCols }, () => '');
    let col = 0, row = 0;

    for (let i = 0; i < n; i++) {
        plaintext[col] += text[i];
        col++;
        if (col === numCols || (col === numCols - 1 && row >= numRows - shaded)) {
            col = 0;
            row++;
        }
    }

    return plaintext.join('');
}

function railFenceEncrypt(text, key) {
    const rail = Array.from({ length: key }, () => []);
    let row = 0;
    let dirDown = false;

    for (const char of text) {
        rail[row].push(char);
        if (row === 0 || row === key - 1) dirDown = !dirDown;
        row += dirDown ? 1 : -1;
    }

    return rail.flat().join('');
}

function railFenceDecrypt(text, key) {
    const rail = Array.from({ length: key }, () => []);
    const len = text.length;
    let dirDown = null;
    let row = 0;
    let index = 0;

    for (let i = 0; i < len; i++) {
        rail[row][i] = '*';
        if (row === 0) dirDown = true;
        else if (row === key - 1) dirDown = false;
        row += dirDown ? 1 : -1;
    }

    for (let i = 0; i < key; i++) {
        for (let j = 0; j < len; j++) {
            if (rail[i][j] === '*' && index < len) {
                rail[i][j] = text[index++];
            }
        }
    }

    let result = '';
    row = 0;
    dirDown = true;

    for (let i = 0; i < len; i++) {
        result += rail[row][i];
        if (row === 0) dirDown = true;
        else if (row === key - 1) dirDown = false;
        row += dirDown ? 1 : -1;
    }

    return result;
}
