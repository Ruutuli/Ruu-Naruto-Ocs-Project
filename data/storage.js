// LocalStorage wrapper for Naruto OC Website
const STORAGE_KEY = 'naruto-oc-website';

class Storage {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const defaultData = {
        version: "1.0",
        ocs: [],
        clans: [],
        stories: [],
        lore: []
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    }
  }

  getData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { version: "1.0", ocs: [], clans: [], stories: [], lore: [] };
  }

  saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // OC Methods
  saveOC(oc) {
    const data = this.getData();
    const index = data.ocs.findIndex(o => o.id === oc.id);
    if (index >= 0) {
      data.ocs[index] = oc;
    } else {
      data.ocs.push(oc);
    }
    this.saveData(data);
    return oc;
  }

  getOC(id) {
    const data = this.getData();
    return data.ocs.find(oc => oc.id === id) || null;
  }

  getAllOCs() {
    const data = this.getData();
    return data.ocs || [];
  }

  deleteOC(id) {
    const data = this.getData();
    data.ocs = data.ocs.filter(oc => oc.id !== id);
    // Remove from clan members
    data.clans.forEach(clan => {
      clan.members = clan.members.filter(memberId => memberId !== id);
    });
    // Remove from story characters
    data.stories.forEach(story => {
      story.characters = story.characters.filter(charId => charId !== id);
    });
    // Remove from lore relatedOCs
    data.lore.forEach(lore => {
      lore.relatedOCs = lore.relatedOCs.filter(ocId => ocId !== id);
    });
    this.saveData(data);
  }

  clearAllOCs() {
    const data = this.getData();
    data.ocs = [];
    // Clear OC references from clans
    data.clans.forEach(clan => {
      clan.members = [];
    });
    // Clear OC references from stories
    data.stories.forEach(story => {
      story.characters = [];
    });
    // Clear OC references from lore
    data.lore.forEach(lore => {
      lore.relatedOCs = [];
    });
    this.saveData(data);
  }

  clearAllClans() {
    const data = this.getData();
    data.clans = [];
    // Clear clan references from OCs
    data.ocs.forEach(oc => {
      oc.clanId = null;
    });
    // Clear clan references from lore
    data.lore.forEach(lore => {
      lore.relatedClans = [];
    });
    this.saveData(data);
  }

  clearAllStories() {
    const data = this.getData();
    data.stories = [];
    this.saveData(data);
  }

  clearAllLore() {
    const data = this.getData();
    data.lore = [];
    this.saveData(data);
  }

  // Clan Methods
  saveClan(clan) {
    const data = this.getData();
    const index = data.clans.findIndex(c => c.id === clan.id);
    if (index >= 0) {
      data.clans[index] = clan;
    } else {
      data.clans.push(clan);
    }
    this.saveData(data);
    return clan;
  }

  getClan(id) {
    const data = this.getData();
    return data.clans.find(clan => clan.id === id) || null;
  }

  getAllClans() {
    const data = this.getData();
    return data.clans || [];
  }

  deleteClan(id) {
    const data = this.getData();
    data.clans = data.clans.filter(clan => clan.id !== id);
    // Remove clanId from OCs
    data.ocs.forEach(oc => {
      if (oc.clanId === id) {
        oc.clanId = null;
      }
    });
    // Remove from lore relatedClans
    data.lore.forEach(lore => {
      lore.relatedClans = lore.relatedClans.filter(clanId => clanId !== id);
    });
    this.saveData(data);
  }

  // Story Methods
  saveStory(story) {
    const data = this.getData();
    const index = data.stories.findIndex(s => s.id === story.id);
    if (index >= 0) {
      data.stories[index] = story;
    } else {
      data.stories.push(story);
    }
    this.saveData(data);
    return story;
  }

  getStory(id) {
    const data = this.getData();
    return data.stories.find(story => story.id === id) || null;
  }

  getAllStories() {
    const data = this.getData();
    return data.stories || [];
  }

  deleteStory(id) {
    const data = this.getData();
    data.stories = data.stories.filter(story => story.id !== id);
    this.saveData(data);
  }

  // Lore Methods
  saveLore(lore) {
    const data = this.getData();
    const index = data.lore.findIndex(l => l.id === lore.id);
    if (index >= 0) {
      data.lore[index] = lore;
    } else {
      data.lore.push(lore);
    }
    this.saveData(data);
    return lore;
  }

  getLore(id) {
    const data = this.getData();
    return data.lore.find(l => l.id === id) || null;
  }

  getAllLore() {
    const data = this.getData();
    return data.lore || [];
  }

  deleteLore(id) {
    const data = this.getData();
    data.lore = data.lore.filter(l => l.id !== id);
    this.saveData(data);
  }

  // Clear all data
  clearAllData() {
    const defaultData = {
      version: "1.0",
      ocs: [],
      clans: [],
      stories: [],
      lore: []
    };
    this.saveData(defaultData);
  }
}

// Export singleton instance
const storage = new Storage();
export default storage;

