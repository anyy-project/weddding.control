// Wedding Control - Main JavaScript

// Data Storage
let weddingInfo = {
    groomName: '',
    brideName: '',
    date: '',
    time: '',
    venue: '',
    invitationLink: ''
};

let guests = [];
let templates = {
    whatsapp: '',
    instagram: ''
};

let broadcastHistory = [];
let selectedContacts = [];

// Load data from localStorage
function loadData() {
    const savedWeddingInfo = localStorage.getItem('weddingInfo');
    const savedGuests = localStorage.getItem('guests');
    const savedTemplates = localStorage.getItem('templates');
    const savedHistory = localStorage.getItem('broadcastHistory');
    
    if (savedWeddingInfo) weddingInfo = JSON.parse(savedWeddingInfo);
    if (savedGuests) guests = JSON.parse(savedGuests);
    if (savedTemplates) templates = JSON.parse(savedTemplates);
    if (savedHistory) broadcastHistory = JSON.parse(savedHistory);
    
    // Load wedding info to form
    if (weddingInfo.groomName) {
        document.getElementById('groomName').value = weddingInfo.groomName;
        document.getElementById('brideName').value = weddingInfo.brideName;
        document.getElementById('weddingDate').value = weddingInfo.date;
        document.getElementById('weddingTime').value = weddingInfo.time;
        document.getElementById('weddingVenue').value = weddingInfo.venue;
    }
    
    // Load invitation link
    if (weddingInfo.invitationLink) {
        document.getElementById('invitationLink').value = weddingInfo.invitationLink;
        updateLinkPreview(weddingInfo.invitationLink);
    }
    
    // Load templates
    if (templates.whatsapp) {
        document.getElementById('whatsappTemplate').value = templates.whatsapp;
    }
    if (templates.instagram) {
        document.getElementById('instagramTemplate').value = templates.instagram;
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('weddingInfo', JSON.stringify(weddingInfo));
    localStorage.setItem('guests', JSON.stringify(guests));
    localStorage.setItem('templates', JSON.stringify(templates));
    localStorage.setItem('broadcastHistory', JSON.stringify(broadcastHistory));
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateDashboard();
    renderGuests();
    updatePreview();
    renderBroadcastHistory();
    initEventListeners();
});

// Event Listeners
function initEventListeners() {
    // Tab Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    // Wedding Info Form
    document.getElementById('weddingInfoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveWeddingInfo();
    });
    
    // Add Guest
    document.getElementById('addGuestBtn').addEventListener('click', openAddGuestModal);
    document.getElementById('addGuestForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addGuest();
    });
    
    // Edit Guest Form
    document.getElementById('editGuestForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateGuest();
    });
    
    // Modal Close
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModals();
            }
        });
    });
    
    // Search Guest
    document.getElementById('searchGuest').addEventListener('input', function() {
        renderGuests(this.value);
    });
    
    // Template Save
    document.getElementById('saveWhatsappTemplate').addEventListener('click', function() {
        templates.whatsapp = document.getElementById('whatsappTemplate').value;
        saveData();
        updatePreview();
        showToast('Template WhatsApp berhasil disimpan!', 'success');
    });
    
    document.getElementById('saveInstagramTemplate').addEventListener('click', function() {
        templates.instagram = document.getElementById('instagramTemplate').value;
        saveData();
        updatePreview();
        showToast('Template Instagram berhasil disimpan!', 'success');
    });
    
    // Preview Toggle
    document.querySelectorAll('.preview-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const preview = this.getAttribute('data-preview');
            document.querySelectorAll('.preview-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.preview-box').forEach(box => box.classList.remove('active'));
            document.getElementById(preview + 'Preview').classList.add('active');
        });
    });
    
    
    // Broadcast Buttons
    document.getElementById('broadcastWhatsappBtn').addEventListener('click', broadcastWhatsApp);
    document.getElementById('broadcastInstagramBtn').addEventListener('click', broadcastInstagram);
    
    // Import from Contacts
    document.getElementById('importFromContactsBtn').addEventListener('click', openContactPicker);
    
    // Contact Picker
    document.getElementById('openContactPickerBtn').addEventListener('click', selectContacts);
    document.getElementById('confirmContactsBtn').addEventListener('click', confirmSelectedContacts);
    
    // Invitation Link
    document.getElementById('invitationLink').addEventListener('input', function() {
        const link = this.value;
        if (link) {
            updateLinkPreview(link);
        } else {
            document.getElementById('linkPreview').style.display = 'none';
        }
    });
    
    document.getElementById('copyLinkBtn').addEventListener('click', function() {
        const link = document.getElementById('invitationLink').value;
        copyToClipboard(link);
    });
    
    // Update broadcast counts on tab switch
    updateBroadcastCounts();
}

// Tab Switching
function switchTab(tabName) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    
    if (tabName === 'broadcast') {
        updateBroadcastCounts();
    }
}

// Save Wedding Info
function saveWeddingInfo() {
    weddingInfo.groomName = document.getElementById('groomName').value;
    weddingInfo.brideName = document.getElementById('brideName').value;
    weddingInfo.date = document.getElementById('weddingDate').value;
    weddingInfo.time = document.getElementById('weddingTime').value;
    weddingInfo.venue = document.getElementById('weddingVenue').value;
    weddingInfo.invitationLink = document.getElementById('invitationLink').value;
    
    saveData();
    updatePreview();
    updateLinkPreview(weddingInfo.invitationLink);
    showToast('Informasi pernikahan berhasil disimpan!', 'success');
}

// Update Link Preview
function updateLinkPreview(link) {
    const linkPreview = document.getElementById('linkPreview');
    const linkPreviewUrl = document.getElementById('linkPreviewUrl');
    
    if (link && isValidUrl(link)) {
        linkPreview.style.display = 'block';
        linkPreviewUrl.href = link;
        linkPreviewUrl.textContent = link;
    } else {
        linkPreview.style.display = 'none';
    }
}

// Validate URL
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

// Copy to Clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('✅ Link berhasil disalin!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('✅ Link berhasil disalin!', 'success');
    } catch (err) {
        showToast('❌ Gagal menyalin link', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Update Dashboard
function updateDashboard() {
    const total = guests.length;
    const sent = guests.filter(g => g.sentWhatsapp || g.sentInstagram).length;
    
    document.getElementById('totalGuests').textContent = total;
    document.getElementById('sentInvitations').textContent = sent;
}

// Guest Management
function openAddGuestModal() {
    document.getElementById('addGuestModal').classList.add('active');
    document.getElementById('addGuestForm').reset();
}

function addGuest() {
    const name = document.getElementById('guestName').value;
    const whatsapp = document.getElementById('guestWhatsapp').value;
    const instagram = document.getElementById('guestInstagram').value.replace('@', '');
    
    // Check duplicate WhatsApp
    const duplicateWhatsapp = guests.find(g => g.whatsapp === whatsapp);
    if (duplicateWhatsapp) {
        showToast(`❌ Nomor WhatsApp ${whatsapp} sudah digunakan oleh ${duplicateWhatsapp.name}!`, 'error');
        return;
    }
    
    // Check duplicate Instagram (if provided)
    if (instagram) {
        const duplicateInstagram = guests.find(g => g.instagram && g.instagram.toLowerCase() === instagram.toLowerCase());
        if (duplicateInstagram) {
            showToast(`❌ Username Instagram @${instagram} sudah digunakan oleh ${duplicateInstagram.name}!`, 'error');
            return;
        }
    }
    
    const guest = {
        id: Date.now(),
        name: name,
        whatsapp: whatsapp,
        instagram: instagram,
        sentWhatsapp: false,
        sentInstagram: false
    };
    
    guests.push(guest);
    saveData();
    renderGuests();
    updateDashboard();
    closeModals();
    showToast('Tamu berhasil ditambahkan!', 'success');
}

function editGuest(id) {
    const guest = guests.find(g => g.id === id);
    if (!guest) return;
    
    document.getElementById('editGuestId').value = guest.id;
    document.getElementById('editGuestName').value = guest.name;
    document.getElementById('editGuestWhatsapp').value = guest.whatsapp;
    document.getElementById('editGuestInstagram').value = guest.instagram;
    
    document.getElementById('editGuestModal').classList.add('active');
}

function updateGuest() {
    const id = parseInt(document.getElementById('editGuestId').value);
    const guest = guests.find(g => g.id === id);
    if (!guest) return;
    
    const newWhatsapp = document.getElementById('editGuestWhatsapp').value;
    const newInstagram = document.getElementById('editGuestInstagram').value.replace('@', '');
    
    // Check duplicate WhatsApp (exclude current guest)
    const duplicateWhatsapp = guests.find(g => g.id !== id && g.whatsapp === newWhatsapp);
    if (duplicateWhatsapp) {
        showToast(`❌ Nomor WhatsApp ${newWhatsapp} sudah digunakan oleh ${duplicateWhatsapp.name}!`, 'error');
        return;
    }
    
    // Check duplicate Instagram (exclude current guest, if provided)
    if (newInstagram) {
        const duplicateInstagram = guests.find(g => g.id !== id && g.instagram && g.instagram.toLowerCase() === newInstagram.toLowerCase());
        if (duplicateInstagram) {
            showToast(`❌ Username Instagram @${newInstagram} sudah digunakan oleh ${duplicateInstagram.name}!`, 'error');
            return;
        }
    }
    
    guest.name = document.getElementById('editGuestName').value;
    guest.whatsapp = newWhatsapp;
    guest.instagram = newInstagram;
    
    saveData();
    renderGuests();
    updateDashboard();
    closeModals();
    showToast('Data tamu berhasil diupdate!', 'success');
}

function deleteGuest(id) {
    if (!confirm('Yakin ingin menghapus tamu ini?')) return;
    
    guests = guests.filter(g => g.id !== id);
    saveData();
    renderGuests();
    updateDashboard();
    showToast('Tamu berhasil dihapus!', 'success');
}

function renderGuests(searchQuery = '') {
    const tbody = document.getElementById('guestsTableBody');
    
    let filteredGuests = guests;
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredGuests = guests.filter(g => 
            g.name.toLowerCase().includes(query) ||
            g.whatsapp.includes(query) ||
            g.instagram.toLowerCase().includes(query)
        );
    }
    
    if (filteredGuests.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="6">
                    <i class="fas fa-users"></i>
                    <p>${searchQuery ? 'Tamu tidak ditemukan' : 'Belum ada tamu yang ditambahkan'}</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredGuests.map((guest, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${guest.name}</strong></td>
            <td>${guest.whatsapp}</td>
            <td>${guest.instagram ? '@' + guest.instagram : '-'}</td>
            <td>
                ${guest.sentWhatsapp ? '<span class="sent-badge whatsapp"><i class="fab fa-whatsapp"></i> WA</span>' : ''}
                ${guest.sentInstagram ? '<span class="sent-badge instagram"><i class="fab fa-instagram"></i> IG</span>' : ''}
                ${!guest.sentWhatsapp && !guest.sentInstagram ? '-' : ''}
            </td>
            <td>
                <div class="action-buttons">
                    <button class="icon-btn edit" onclick="editGuest(${guest.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-btn delete" onclick="deleteGuest(${guest.id})" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}


// Template Preview
function updatePreview() {
    const sampleGuest = {
        nama: 'Budi Santoso',
        mempelaiPria: weddingInfo.groomName || 'Nama Mempelai Pria',
        mempelaiWanita: weddingInfo.brideName || 'Nama Mempelai Wanita',
        tanggal: weddingInfo.date ? formatDate(weddingInfo.date) : 'Sabtu, 1 Januari 2025',
        waktu: weddingInfo.time || '10:00 WIB',
        lokasi: weddingInfo.venue || 'Gedung Pernikahan',
        link: weddingInfo.invitationLink
    };
    
    const whatsappPreview = replacePlaceholders(templates.whatsapp || document.getElementById('whatsappTemplate').value, sampleGuest);
    const instagramPreview = replacePlaceholders(templates.instagram || document.getElementById('instagramTemplate').value, sampleGuest);
    
    document.getElementById('whatsappPreview').textContent = whatsappPreview;
    document.getElementById('instagramPreview').textContent = instagramPreview;
}

function replacePlaceholders(template, data) {
    return template
        .replace(/{nama}/g, data.nama)
        .replace(/{mempelaiPria}/g, data.mempelaiPria)
        .replace(/{mempelaiWanita}/g, data.mempelaiWanita)
        .replace(/{tanggal}/g, data.tanggal)
        .replace(/{waktu}/g, data.waktu)
        .replace(/{lokasi}/g, data.lokasi)
        .replace(/{link}/g, data.link);
}

function formatDate(dateString) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const date = new Date(dateString);
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName}, ${day} ${month} ${year}`;
}

// Broadcast Functions
function updateBroadcastCounts() {
    const whatsappCount = guests.filter(g => g.whatsapp).length;
    const instagramCount = guests.filter(g => g.instagram).length;
    
    document.getElementById('whatsappRecipientCount').textContent = `${whatsappCount} tamu`;
    document.getElementById('instagramRecipientCount').textContent = `${instagramCount} tamu`;
}

function broadcastWhatsApp() {
    if (!weddingInfo.groomName || !weddingInfo.brideName) {
        showToast('Mohon isi informasi pernikahan terlebih dahulu!', 'warning');
        switchTab('dashboard');
        return;
    }
    
    const recipients = guests.filter(guest => guest.whatsapp);
    
    if (recipients.length === 0) {
        showToast('Tidak ada tamu dengan nomor WhatsApp!', 'warning');
        return;
    }
    
    if (!confirm(`Kirim undangan WhatsApp ke ${recipients.length} tamu?`)) {
        return;
    }
    
    let sentCount = 0;
    const template = templates.whatsapp || document.getElementById('whatsappTemplate').value;
    
    recipients.forEach((guest, index) => {
        setTimeout(() => {
            const message = replacePlaceholders(template, {
                nama: guest.name,
                mempelaiPria: weddingInfo.groomName,
                mempelaiWanita: weddingInfo.brideName,
                tanggal: formatDate(weddingInfo.date),
                waktu: weddingInfo.time,
                lokasi: weddingInfo.venue,
                link: weddingInfo.invitationLink
            });
            
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${guest.whatsapp}?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
            
            guest.sentWhatsapp = true;
            sentCount++;
            
            if (index === recipients.length - 1) {
                saveData();
                renderGuests();
                updateDashboard();
                
                // Add to history
                broadcastHistory.unshift({
                    id: Date.now(),
                    type: 'whatsapp',
                    timestamp: new Date().toISOString(),
                    recipients: sentCount,
                    details: 'Semua tamu'
                });
                saveData();
                renderBroadcastHistory();
                
                showToast(`Broadcast WhatsApp selesai! Terkirim ke ${sentCount} tamu.`, 'success');
            }
        }, index * 3000); // 3 seconds delay between each message
    });
    
    showToast('Memulai broadcast WhatsApp...', 'success');
}

function broadcastInstagram() {
    if (!weddingInfo.groomName || !weddingInfo.brideName) {
        showToast('Mohon isi informasi pernikahan terlebih dahulu!', 'warning');
        switchTab('dashboard');
        return;
    }
    
    const recipients = guests.filter(guest => guest.instagram);
    
    if (recipients.length === 0) {
        showToast('Tidak ada tamu dengan Instagram!', 'warning');
        return;
    }
    
    if (!confirm(`Kirim undangan Instagram ke ${recipients.length} tamu?\n\nAnda akan diarahkan ke Instagram untuk setiap DM. Salin pesan yang sudah disiapkan.`)) {
        return;
    }
    
    let sentCount = 0;
    const template = templates.instagram || document.getElementById('instagramTemplate').value;
    
    recipients.forEach((guest, index) => {
        setTimeout(() => {
            const message = replacePlaceholders(template, {
                nama: guest.name,
                mempelaiPria: weddingInfo.groomName,
                mempelaiWanita: weddingInfo.brideName,
                tanggal: formatDate(weddingInfo.date),
                waktu: weddingInfo.time,
                lokasi: weddingInfo.venue,
                link: weddingInfo.invitationLink
            });
            
            // Copy message to clipboard
            navigator.clipboard.writeText(message).then(() => {
                showToast(`Pesan untuk @${guest.instagram} telah disalin!`, 'success');
            });
            
            // Open Instagram DM
            const instagramUrl = `https://www.instagram.com/direct/new/?username=${guest.instagram}`;
            window.open(instagramUrl, '_blank');
            
            guest.sentInstagram = true;
            sentCount++;
            
            if (index === recipients.length - 1) {
                saveData();
                renderGuests();
                updateDashboard();
                
                // Add to history
                broadcastHistory.unshift({
                    id: Date.now(),
                    type: 'instagram',
                    timestamp: new Date().toISOString(),
                    recipients: sentCount,
                    details: 'Semua tamu'
                });
                saveData();
                renderBroadcastHistory();
                
                showToast(`Broadcast Instagram selesai! Terkirim ke ${sentCount} tamu.`, 'success');
            }
        }, index * 5000); // 5 seconds delay between each message
    });
    
    showToast('Memulai broadcast Instagram...', 'success');
}

function renderBroadcastHistory() {
    const historyContainer = document.getElementById('broadcastHistory');
    
    if (broadcastHistory.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-paper-plane"></i>
                <p>Belum ada riwayat broadcast</p>
            </div>
        `;
        return;
    }
    
    historyContainer.innerHTML = broadcastHistory.slice(0, 10).map(item => `
        <div class="history-item ${item.type}">
            <div class="history-header">
                <div class="history-title">
                    <i class="fab fa-${item.type}"></i>
                    Broadcast ${item.type === 'whatsapp' ? 'WhatsApp' : 'Instagram'}
                </div>
                <div class="history-time">${formatTimestamp(item.timestamp)}</div>
            </div>
            <div class="history-details">
                ${item.recipients} tamu • ${item.details}
            </div>
        </div>
    `).join('');
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days < 7) return `${days} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}


// Contact Picker Functions
function openContactPicker() {
    // Check if Contact Picker API is supported
    if (!('contacts' in navigator)) {
        showToast('⚠️ Fitur ini hanya tersedia di browser mobile (Chrome Android, Safari iOS)', 'warning');
        return;
    }
    
    document.getElementById('contactSelectionModal').classList.add('active');
    selectedContacts = [];
    document.getElementById('selectedContactsPreview').style.display = 'none';
}

async function selectContacts() {
    try {
        // Check if Contact Picker API is supported
        if (!('contacts' in navigator)) {
            showToast('❌ Browser Anda tidak mendukung Contact Picker API', 'error');
            return;
        }

        const props = ['name', 'tel'];
        const opts = { multiple: true };

        // Open contact picker
        const contacts = await navigator.contacts.select(props, opts);
        
        if (contacts && contacts.length > 0) {
            selectedContacts = [];
            
            contacts.forEach(contact => {
                if (contact.tel && contact.tel.length > 0) {
                    contact.tel.forEach(tel => {
                        selectedContacts.push({
                            name: contact.name && contact.name[0] ? contact.name[0] : 'Unknown',
                            phone: tel
                        });
                    });
                }
            });
            
            if (selectedContacts.length > 0) {
                displaySelectedContacts();
                document.getElementById('selectedContactsPreview').style.display = 'block';
            } else {
                showToast('Tidak ada nomor telepon ditemukan pada kontak yang dipilih', 'warning');
            }
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            showToast('Pemilihan kontak dibatalkan', 'warning');
        } else {
            console.error('Contact Picker Error:', error);
            showToast('Terjadi kesalahan: ' + error.message, 'error');
        }
    }
}

function displaySelectedContacts() {
    const contactsList = document.getElementById('contactsList');
    const contactsCount = document.getElementById('contactsCount');
    
    contactsCount.textContent = selectedContacts.length;
    
    contactsList.innerHTML = selectedContacts.map((contact, index) => {
        const initial = contact.name.charAt(0).toUpperCase();
        const formattedPhone = formatPhoneNumber(contact.phone);
        
        return `
            <div class="contact-item" data-index="${index}">
                <div class="contact-item-icon">${initial}</div>
                <div class="contact-item-info">
                    <div class="contact-item-name">${contact.name}</div>
                    <div class="contact-item-phone">${formattedPhone}</div>
                </div>
                <button class="contact-item-remove" onclick="removeSelectedContact(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }).join('');
}

function removeSelectedContact(index) {
    selectedContacts.splice(index, 1);
    
    if (selectedContacts.length === 0) {
        document.getElementById('selectedContactsPreview').style.display = 'none';
    } else {
        displaySelectedContacts();
    }
}

function confirmSelectedContacts() {
    if (selectedContacts.length === 0) {
        showToast('Tidak ada kontak yang dipilih', 'warning');
        return;
    }
    
    let addedCount = 0;
    let skippedCount = 0;
    
    selectedContacts.forEach(contact => {
        const phone = formatPhoneNumber(contact.phone);
        
        // Check if guest already exists
        const exists = guests.some(g => g.whatsapp === phone);
        
        if (!exists && phone) {
            guests.push({
                id: Date.now() + Math.random(),
                name: contact.name,
                whatsapp: phone,
                instagram: '',
                sentWhatsapp: false,
                sentInstagram: false
            });
            addedCount++;
        } else {
            skippedCount++;
        }
    });
    
    if (addedCount > 0) {
        saveData();
        renderGuests();
        updateDashboard();
        closeModals();
        
        let message = `✅ ${addedCount} kontak berhasil ditambahkan!`;
        if (skippedCount > 0) {
            message += ` (${skippedCount} kontak dilewati karena sudah ada)`;
        }
        showToast(message, 'success');
    } else {
        showToast('Semua kontak sudah ada di daftar tamu', 'warning');
    }
    
    selectedContacts = [];
}

function formatPhoneNumber(phone) {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '');
    
    // If starts with 0, replace with 62
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1);
    }
    
    // If starts with +62, remove +
    if (phone.startsWith('+62')) {
        cleaned = '62' + cleaned.substring(2);
    }
    
    // If doesn't start with 62, add it
    if (!cleaned.startsWith('62')) {
        cleaned = '62' + cleaned;
    }
    
    return cleaned;
}

// Modal Functions
function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    selectedContacts = [];
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Listen for template changes to update preview
document.getElementById('whatsappTemplate')?.addEventListener('input', updatePreview);
document.getElementById('instagramTemplate')?.addEventListener('input', updatePreview);

