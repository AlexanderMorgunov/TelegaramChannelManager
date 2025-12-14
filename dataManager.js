const dataManager = {
  channels: [],

  init(channels) {
    this.channels = channels;
    this.filteredChannels = [...channels];
  },

  filterChannels(searchTerm) {
    if (!searchTerm) {
      this.filteredChannels = [...this.channels];
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    this.filteredChannels = this.channels.filter(
      (channel) =>
        channel.name.toLowerCase().includes(lowerSearchTerm) ||
        channel.profile.toString().includes(lowerSearchTerm) ||
        channel.accountId.includes(lowerSearchTerm)
    );
  },

  addChannel() {
    const newId = Math.max(...this.channels.map((c) => c.id), 0) + 1;
    const newAccountId = generateNumber(10).toString();
    const newProfile = generateNumber(12);

    const newChannel = {
      id: newId,
      name: `Канал ${newId}`,
      funnel: "Воронка",
      stage: "Неразобранное",
      accountId: newAccountId,
      profile: newProfile,
      status: "Авторизуйтесь",
    };

    this.channels.push(newChannel);
    return newChannel;
  },

  deleteChannel(channelId) {
    this.channels = this.channels.filter((c) => c.id !== channelId);
  },

  getChannelById(channelId) {
    return this.channels.find((c) => c.id === channelId);
  },
};
