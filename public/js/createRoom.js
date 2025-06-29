document.addEventListener('DOMContentLoaded', function() {
    // 1. Đúng selector checkbox theo pug: usersId[]
    const checkboxes = document.querySelectorAll('input[name="usersId[]"]');
    const selectedCount = document.getElementById('selectedCount');
    const selectedList = document.getElementById('selectedMembersList');
    const searchInput = document.getElementById('memberSearch');
    const searchBtn = document.getElementById('searchBtn');

    // Hàm tạo username động
    function toUsername(str) {
        return '@' + str
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '');
    }

    // Tự động hiển thị username dưới tên ở danh sách thành viên
    document.querySelectorAll('.form-check-label').forEach(label => {
        const nameEl = label.querySelector('.fw-bold');
        if (!nameEl) return;
        if (!label.querySelector('.text-muted')) {
            const username = toUsername(nameEl.textContent);
            const unameEl = document.createElement('div');
            unameEl.className = 'text-muted small';
            unameEl.textContent = username;
            nameEl.parentNode.appendChild(unameEl);
        }
    });

    // Hàm cập nhật giao diện "thành viên đã chọn"
    function updateSelectedMembers() {
        const selected = Array.from(checkboxes).filter(cb => cb.checked);
        selectedCount.textContent = selected.length;
        selectedList.innerHTML = '';

        selected.forEach(checkbox => {
            const label = checkbox.nextElementSibling;
            const name = label.querySelector('.fw-bold').textContent;
            const username = toUsername(name);

            const badge = document.createElement('span');
            badge.className = 'badge selected-member-badge me-2 mb-2 d-flex align-items-center';
            badge.innerHTML = `
                <span class="fw-bold">${name}</span>
                <small class="ms-2">${username}</small>
                <i class="fas fa-times ms-2 remove-member" style="cursor:pointer;" data-value="${checkbox.value}" title="Bỏ chọn"></i>
            `;
            selectedList.appendChild(badge);
        });

        // Bắt sự kiện xoá thành viên khỏi danh sách đã chọn
        selectedList.querySelectorAll('.remove-member').forEach(btn => {
            btn.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const checkbox = document.querySelector(`input[name="usersId[]"][value="${value}"]`);
                if (checkbox) {
                    checkbox.checked = false;
                    updateSelectedMembers();
                }
            });
        });
    }

    // Bắt sự kiện khi tích/bỏ tích checkbox thành viên
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedMembers);
    });

    // Chức năng tìm kiếm thành viên
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const memberItems = document.querySelectorAll('.form-check');
        memberItems.forEach(item => {
            const name = item.querySelector('.fw-bold').textContent.toLowerCase();
            const username = toUsername(name);
            if (
                searchTerm === '' ||
                name.includes(searchTerm) ||
                username.includes(searchTerm)
            ) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
    searchBtn.addEventListener('click', performSearch);

    // Chức năng chọn tất cả / bỏ chọn tất cả
    function createSelectAllButton() {
        const selectAllBtn = document.createElement('button');
        selectAllBtn.type = 'button';
        selectAllBtn.className = 'btn btn-sm btn-outline-secondary me-2';
        selectAllBtn.innerHTML = '<i class="fas fa-check-square me-1"></i> Chọn tất cả';

        const clearAllBtn = document.createElement('button');
        clearAllBtn.type = 'button';
        clearAllBtn.className = 'btn btn-sm btn-outline-danger';
        clearAllBtn.innerHTML = '<i class="fas fa-times me-1"></i> Bỏ chọn';

        // Thêm nút vào DOM
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'mb-3';
        buttonContainer.appendChild(selectAllBtn);
        buttonContainer.appendChild(clearAllBtn);

        const memberListTitle = document.querySelector('.member-list h6');
        memberListTitle.parentNode.insertBefore(buttonContainer, memberListTitle.nextSibling);

        // Sự kiện chọn tất cả
        selectAllBtn.addEventListener('click', function() {
            const visibleCheckboxes = Array.from(checkboxes).filter(cb =>
                cb.closest('.form-check').style.display !== 'none'
            );
            visibleCheckboxes.forEach(cb => cb.checked = true);
            updateSelectedMembers();
        });

        // Sự kiện bỏ chọn tất cả
        clearAllBtn.addEventListener('click', function() {
            checkboxes.forEach(cb => cb.checked = false);
            updateSelectedMembers();
        });
    }
    createSelectAllButton();

    // Validate form trước khi submit
    const form = document.getElementById('createRoomForm');
    form.addEventListener('submit', function(e) {
        const roomName = document.getElementById('title').value.trim();
        const selectedMembers = Array.from(checkboxes).filter(cb => cb.checked);

        if (!roomName) {
            e.preventDefault();
            alert('Vui lòng nhập tên phòng!');
            document.getElementById('title').focus();
            return;
        }

        if (selectedMembers.length === 0) {
            e.preventDefault();
            if (confirm('Bạn chưa chọn thành viên nào. Bạn có muốn tạo phòng trống không?')) {
                form.submit();
            }
            return;
        }

        // Loading state khi tạo phòng
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Đang tạo...';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 3000);
    });

    // Lần đầu tải trang, cập nhật trạng thái thành viên đã chọn (nếu có reload, giữ trạng thái)
    updateSelectedMembers();
});
