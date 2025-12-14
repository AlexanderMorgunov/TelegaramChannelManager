const uiManager = {
  elements: {},

  init() {
    this.elements.channelsList = document.getElementById("channels-list");
    this.elements.addChannelBtn = document.querySelector(".add-channel-btn");
    this.elements.modal = document.getElementById("channel-modal");
    this.elements.modalTitle = document.getElementById("modal-title");
    this.elements.modalSaveBtn = document.getElementById("modal-save-btn");
    this.elements.closeModalBtn = document.querySelector(".close-modal");
    this.elements.cancelBtn = document.querySelector(".cancel-btn");
    this.elements.qrCode = document.getElementById("qr-code");
    this.elements.channelIdDisplay =
      document.getElementById("channel-id-display");
    this.elements.searchInput = document.querySelector(".search-input");
  },

  renderChannels() {
    this.elements.channelsList.innerHTML = "";

    if (dataManager.filteredChannels.length === 0) {
      const message = document.createElement("tr");
      message.innerHTML = `
        <td colspan="5" style="text-align: center; padding: 20px;">
          Ничего не найдено по вашему запросу
        </td>
      `;
      this.elements.channelsList.appendChild(message);
      return;
    }

    dataManager.filteredChannels.forEach((channel) => {
      const row = this.createChannelRow(channel);
      this.elements.channelsList.appendChild(row);
    });

    this.attachActionHandlers();
  },

  createChannelRow(channel) {
    const row = document.createElement("tr");
    const statusClass =
      channel.status === "Авторизуйтесь" ? "unauthorized" : "authorized";

    row.innerHTML = `
      <td class="channel-name">${channel.name}</td>
      <td>${channel.funnel}<br>${channel.stage}</td>
      <td><div>Профиль: ${channel.profile}</div></td>
      <td><span class="status ${statusClass}">${channel.status}</span></td>
      <td class="actions">
        <div class="action-div" data-id="${channel.id}">&#8942;</div>
      </td>
    `;

    return row;
  },

  attachActionHandlers() {
    document.querySelectorAll(".action-div").forEach((div) => {
      div.addEventListener("click", (e) => {
        e.stopPropagation();
        const channelId = parseInt(div.getAttribute("data-id"));
        eventManager.showChannelActions(channelId, div);
      });
    });
  },

  showSettingsModal(channelId) {
    const channel = dataManager.getChannelById(channelId);
    if (!channel) return;

    eventManager.editingChannel = channel;
    this.elements.modalTitle.textContent = "Редактировать канал";
    this.elements.channelIdDisplay.textContent = channel.id;
    this.generateQRCode();
    this.elements.modal.style.display = "block";
  },

  generateQRCode() {
    const canvas = document.createElement("canvas");
    canvas.width = 250;
    canvas.height = 250;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 250, 250);
    ctx.fillStyle = "black";

    for (let i = 0; i < 250; i += 10) {
      for (let j = 0; j < 250; j += 10) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i, j, 10, 10);
        }
      }
    }

    ctx.strokeRect(10, 10, 230, 230);

    this.elements.qrCode.innerHTML = "";
    this.elements.qrCode.appendChild(canvas);
  },

  closeModal() {
    this.elements.modal.style.display = "none";
    eventManager.editingChannel = null;
  },
};

// Добавляем стили для мобильной адаптации
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    /* Мобильная адаптация */
    @media (max-width: 768px) {
      .main-content {
        overflow-x: auto; /* Горизонтальная прокрутка на мобильных */
      }
      
      .channels-table {
        width: 100%;
        min-width: 600px; /* Минимальная ширина для прокрутки */
      }
      
      .channels-table th,
      .channels-table td {
        padding: 8px;
        font-size: 14px;
      }
      
      .channel-name {
        font-size: 14px;
      }
      
      .status {
        font-size: 12px;
        padding: 4px 8px;
      }
      
      .actions {
        white-space: nowrap;
      }
      
      .action-div {
        font-size: 18px;
      }
      
      /* Для очень маленьких экранов можно скрыть некоторые столбцы */
      @media (max-width: 480px) {
        .channels-table th:nth-child(3),
        .channels-table td:nth-child(3) {
          display: none;
        }
        
        .channels-table th:nth-child(4),
        .channels-table td:nth-child(4) {
          display: none;
        }
      }
    }
  `;
  document.head.appendChild(style);
}
