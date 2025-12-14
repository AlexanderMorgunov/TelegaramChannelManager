document.addEventListener("DOMContentLoaded", function () {
  // Инициализация данных
  const initialChannels = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Канал ${i + 1}`,
    funnel: "Воронка",
    stage: "Неразобранное",
    accountId: "4234234324",
    status: "Авторизуйтесь",
    profile: generateNumber(12),
  }));

  dataManager.init(initialChannels);
  uiManager.init();
  eventManager.init();

  // Первоначальный рендер
  uiManager.renderChannels();
});
