function formatData() {
    const rawData = document.getElementById('rawData').value;
    if (!rawData.trim()) {
        alert('Masukkan data terlebih dahulu!');
        return;
    }

    try {
        const transactions = parseRawData(rawData);
        const formattedText = generateFormattedOutput(transactions);
        const statistics = calculateStatistics(transactions);
        
        displayFormattedResult(formattedText);
        displayStatistics(statistics);
    } catch (error) {
        alert('Error memproses data: ' + error.message);
    }
}

function parseRawData(rawData) {
    const lines = rawData.split('\n');
    const transactions = [];
    let currentTransaction = null;
    let inItemsSection = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Deteksi awal transaksi baru
        if (line.includes('TJ01') && line.includes('Putri Rahmaniati')) {
            if (currentTransaction) {
                transactions.push(currentTransaction);
            }
            
            const parts = line.split('\t');
            currentTransaction = {
                timestamp: parts[0],
                transactionId: parts[1],
                customer: parts[2],
                items: [],
                payment: parts[6] || ''
            };
            inItemsSection = false;
            continue;
        }

        // Deteksi section items
        if (line.startsWith('Kode Barang') || line.includes('Nama Barang')) {
            inItemsSection = true;
            continue;
        }

        // Deteksi item
        if (inItemsSection && currentTransaction && 
            (line.match(/^\d+\./) || line.match(/[A-Z]{2}\d+/))) {
            
            // Skip jika ini header table
            if (line.includes('Kode Barang') || line.includes('Nama Barang')) continue;
            
            // Parse item line
            const itemParts = line.split('\t').filter(part => part.trim() !== '');
            if (itemParts.length >= 7) {
                const item = {
                    code: itemParts[0].replace(/^\d+\.\s*/, '').trim(),
                    name: itemParts[1].trim(),
                    quantity: itemParts[2].trim(),
                    subtotal: itemParts[3].trim(),
                    discount: itemParts[4].trim(),
                    additional: itemParts[5].trim(),
                    total: itemParts[6].trim()
                };
                currentTransaction.items.push(item);
            }
        }

        // Deteksi total transaksi
        if (line.includes('Total+PPN+Ongkir') && currentTransaction) {
            const totalMatch = line.match(/Total\+PPN\+Ongkir\s*:\s*([\d.,]+)/);
            if (totalMatch) {
                currentTransaction.grandTotal = totalMatch[1];
            }
        }
    }

    // Push transaksi terakhir
    if (currentTransaction) {
        transactions.push(currentTransaction);
    }

    return transactions;
}

function generateFormattedOutput(transactions) {
    let output = `## **REKAP TRANSAKSI - PUTRI RAHMANIATI**\n`;
    output += `**Periode**: ${getPeriodFromTransactions(transactions)}\n\n`;

    let grandTotalAll = 0;

    transactions.forEach((transaction, index) => {
        output += `### **TRANSAKSI ${index + 1}**\n`;
        output += `- **No. Transaksi**: ${transaction.transactionId}\n`;
        output += `- **Waktu**: ${formatTime(transaction.timestamp)}\n`;
        output += `- **Status**: ${transaction.payment}\n`;
        output += `- **Item**: \n`;
        
        transaction.items.forEach(item => {
            const quantityMatch = item.quantity.match(/(\d+)\s*Pieces?\s*x\s*([\d.,]+)/);
            if (quantityMatch) {
                output += `  - ${item.name} ×${quantityMatch[1]} @Rp ${formatCurrency(quantityMatch[2])}\n`;
            } else {
                output += `  - ${item.name} - ${item.quantity}\n`;
            }
        });

        const subtotal = calculateSubtotal(transaction.items);
        const additional = calculateAdditional(transaction.items);
        const total = calculateTotal(transaction.items);

        output += `- **Subtotal**: Rp ${formatCurrency(subtotal)}\n`;
        output += `- **Tambahan**: Rp ${formatCurrency(additional)}\n`;
        output += `- **Total**: **Rp ${formatCurrency(total)}**\n\n`;

        grandTotalAll += total;
    });

    output += `---\n\n`;
    output += `## **TOTAL KESELURUHAN**\n`;
    output += `- **Total Transaksi**: **Rp ${formatCurrency(grandTotalAll)}**\n`;
    output += `- **Jumlah Transaksi**: ${transactions.length} transaksi\n`;

    return output;
}

// Helper functions
function formatTime(timestamp) {
    return timestamp.split(' ')[1];
}

function formatCurrency(amount) {
    return parseInt(amount.toString().replace(/[.,]/g, '')).toLocaleString('id-ID');
}

function calculateSubtotal(items) {
    return items.reduce((sum, item) => {
        const subtotal = parseInt(item.subtotal.replace(/[.,]/g, ''));
        return sum + (isNaN(subtotal) ? 0 : subtotal);
    }, 0);
}

function calculateAdditional(items) {
    return items.reduce((sum, item) => {
        const additional = parseInt(item.additional.replace(/[.,]/g, ''));
        return sum + (isNaN(additional) ? 0 : additional);
    }, 0);
}

function calculateTotal(items) {
    return items.reduce((sum, item) => {
        const total = parseInt(item.total.replace(/[.,]/g, ''));
        return sum + (isNaN(total) ? 0 : total);
    }, 0);
}

function getPeriodFromTransactions(transactions) {
    if (transactions.length === 0) return '';
    const firstDate = transactions[0].timestamp.split(' ')[0];
    return firstDate;
}

function calculateStatistics(transactions) {
    const totalAmount = transactions.reduce((sum, transaction) => {
        return sum + calculateTotal(transaction.items);
    }, 0);

    const totalItems = transactions.reduce((sum, transaction) => {
        return sum + transaction.items.length;
    }, 0);

    return {
        totalTransactions: transactions.length,
        totalAmount: totalAmount,
        totalItems: totalItems
    };
}

function displayFormattedResult(formattedText) {
    const resultDiv = document.getElementById('formattedResult');
    // Convert markdown-like formatting to HTML
    const htmlContent = formattedText
        .replace(/## (.*?)\n/g, '<h2>$1</h2>')
        .replace(/### (.*?)\n/g, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\* (.*?)\n/g, '<li>$1</li>')
        .replace(/- (.*?)\n/g, '<li>$1</li>')
        .replace(/(\d+\.)\s/g, '$1 ')
        .replace(/\n/g, '<br>');
    
    resultDiv.innerHTML = `<div class="transaction-item">${htmlContent}</div>`;
}

function displayStatistics(statistics) {
    const statsDiv = document.getElementById('statistics');
    statsDiv.innerHTML = `
        <div class="stat-item">
            <div class="stat-value">${statistics.totalTransactions}</div>
            <div class="stat-label">Total Transaksi</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">Rp ${formatCurrency(statistics.totalAmount)}</div>
            <div class="stat-label">Total Nilai</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${statistics.totalItems}</div>
            <div class="stat-label">Total Item</div>
        </div>
    `;
}

function clearData() {
    document.getElementById('rawData').value = '';
    document.getElementById('formattedResult').innerHTML = '';
    document.getElementById('statistics').innerHTML = '';
}

function copyToClipboard() {
    const resultDiv = document.getElementById('formattedResult');
    const textToCopy = resultDiv.innerText;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Text berhasil disalin ke clipboard!');
    }).catch(err => {
        console.error('Gagal menyalin text: ', err);
    });
}

function downloadAsText() {
    const resultDiv = document.getElementById('formattedResult');
    const textToDownload = resultDiv.innerText;
    
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rekap-transaksi-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
