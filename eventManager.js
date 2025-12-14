const eventManager = {
  editingChannel: null,

  init() {
    uiManager.elements.addChannelBtn.addEventListener("click", () =>
      this.handleAddChannel()
    );
    uiManager.elements.modalSaveBtn.addEventListener("click", () =>
      this.handleSaveChannel()
    );
    uiManager.elements.closeModalBtn.addEventListener("click", () =>
      this.handleCloseModal()
    );
    uiManager.elements.cancelBtn.addEventListener("click", () =>
      this.handleCloseModal()
    );
    uiManager.elements.searchInput.addEventListener("input", (e) =>
      this.handleSearch(e)
    );
    uiManager.elements.modal.addEventListener("click", (e) =>
      this.handleModalClick(e)
    );
  },

  handleAddChannel() {
    this.editingChannel = null;
    uiManager.elements.modalTitle.textContent = "Добавить новый канал";
    const newId = Math.max(...dataManager.channels.map((c) => c.id), 0) + 1;
    uiManager.elements.channelIdDisplay.textContent = newId;
    uiManager.generateQRCode();
    uiManager.elements.modal.style.display = "block";
  },

  handleSaveChannel() {
    if (this.editingChannel) {
      // Редактирование существующего канала
    } else {
      dataManager.addChannel();
    }

    dataManager.filterChannels(uiManager.elements.searchInput.value);
    uiManager.renderChannels();
    this.handleCloseModal();
  },

  handleSearch(e) {
    dataManager.filterChannels(e.target.value);
    uiManager.renderChannels();
  },

  handleModalClick(e) {
    if (e.target === uiManager.elements.modal) {
      this.handleCloseModal();
    }
  },

  handleCloseModal() {
    uiManager.elements.modal.style.display = "none";
    this.editingChannel = null;
  },

  showChannelActions(channelId, triggerElement) {
    const existingMenu = document.querySelector(".channel-menu");
    if (existingMenu) existingMenu.remove();

    const menu = document.createElement("div");
    menu.className = "channel-menu";
    menu.innerHTML = `
      <div class="menu-item settings" data-id="${channelId}">Настройки</div>
      <div class="menu-item delete-channel" data-id="${channelId}">Удалить сессию</div>
    `;

    const rect = triggerElement.getBoundingClientRect();
    menu.style.top = rect.bottom + "px";
    menu.style.left = rect.left + "px";

    document.body.appendChild(menu);

    menu.querySelectorAll(".menu-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const channelId = parseInt(item.getAttribute("data-id"));
        if (item.classList.contains("settings")) {
          uiManager.showSettingsModal(channelId);
        } else if (item.classList.contains("delete-channel")) {
          dataManager.deleteChannel(channelId);
          dataManager.filterChannels(uiManager.elements.searchInput.value);
          uiManager.renderChannels();
        }
        menu.remove();
      });
    });

    setTimeout(() => {
      document.addEventListener("click", function closeMenu(e) {
        if (!menu.contains(e.target) && !triggerElement.contains(e.target)) {
          menu.remove();
          document.removeEventListener("click", closeMenu);
        }
      });
    }, 0);
  },
};
