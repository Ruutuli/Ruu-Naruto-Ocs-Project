// ============================================
// DATA TYPES
// ============================================

interface Character {
    id: string;
    firstName: string;
    lastName: string;
    firstNameKanji?: string;
    lastNameKanji?: string;
    image: string;
    village: string;
    villageCrest?: string;
    level: number;
    rank: string;
    rankImage?: string;
    clan?: string;
    clanCrest?: string;
    stats: {
        intelligence: number;
        stamina: number;
        strength: number;
        speed: number;
        ninjutsu: number;
        genjutsu: number;
        taijutsu: number;
        handSeals: number;
    };
    info: {
        aliases?: string[];
        dateOfBirth?: string;
        age?: number;
        bloodType?: string;
        gender?: string;
        madeGenin?: string;
        madeChunin?: string;
        bodyType?: string;
        height?: string;
        weight?: string;
    };
    affinities: string[];
    strategy: {
        team: string;
        alone: string;
        fieldPosition: string;
        effectiveDistance: string;
        specialty: string;
        notableAbilities: string;
    };
    personality: {
        likes: string[];
        dislikes: string[];
        demeanor: {
            charisma: number;
            extraversion: number;
            energy: number;
            empathy: number;
            impulsivity: number;
            neuroticism: number;
            intuition: number;
            observation: number;
            sensitivity: number;
            generosity: number;
            respectForAuthority: number;
        };
    };
    associates: {
        name: string;
        link?: string;
        image?: string;
        description: string;
    }[];
    abilities: {
        type: 'Taijutsu' | 'Ninjutsu' | 'Genjutsu' | 'Fuinjutsu';
        style: string;
        rank?: string;
        baseStyle?: string;
        mastery?: number;
        difficulty?: number;
        chakraIntensity?: number;
        description: string;
    }[];
    history: {
        period: 'Childhood' | 'Adolescence' | 'Adulthood';
        content: string;
    }[];
    appearance: {
        image: string;
        colors: string[];
        gear: {
            name: string;
            category: string;
            size?: string;
            material: string;
            use: string;
            information: string[];
            icon?: string;
        }[];
    };
}

interface Clan {
    id: string;
    name: string;
    kanji?: string;
    symbol?: string;
    village: string;
    description: string;
    kekkeiGenkai?: string;
    history: string;
    members: string[];
    techniques: string[];
}

interface HistoryEvent {
    id: string;
    title: string;
    date: string;
    description: string;
    category: 'War' | 'Peace' | 'Discovery' | 'Other';
    relatedCharacters?: string[];
    relatedClans?: string[];
}

interface Fanfiction {
    id: string;
    title: string;
    characterIds: string[];
    chapter?: number;
    content: string;
    dateWritten?: string;
    tags?: string[];
}

// ============================================
// DATA MANAGER
// ============================================

class DataManager {
    private characters: Character[] = [];
    private clans: Clan[] = [];
    private historyEvents: HistoryEvent[] = [];
    private fanfictions: Fanfiction[] = [];

    constructor() {
        this.loadFromLocalStorage();
    }

    addCharacter(character: Character): void {
        this.characters.push(character);
        this.saveToLocalStorage();
    }

    getCharacter(id: string): Character | undefined {
        return this.characters.find(c => c.id === id);
    }

    getAllCharacters(): Character[] {
        return this.characters;
    }

    searchCharacters(query: string): Character[] {
        const lowerQuery = query.toLowerCase();
        return this.characters.filter(c => 
            c.firstName.toLowerCase().includes(lowerQuery) ||
            c.lastName.toLowerCase().includes(lowerQuery) ||
            c.village.toLowerCase().includes(lowerQuery) ||
            c.rank.toLowerCase().includes(lowerQuery)
        );
    }

    updateCharacter(id: string, updates: Partial<Character>): void {
        const index = this.characters.findIndex(c => c.id === id);
        if (index !== -1) {
            this.characters[index] = { ...this.characters[index], ...updates };
            this.saveToLocalStorage();
        }
    }

    deleteCharacter(id: string): void {
        this.characters = this.characters.filter(c => c.id !== id);
        this.saveToLocalStorage();
    }

    addClan(clan: Clan): void {
        this.clans.push(clan);
        this.saveToLocalStorage();
    }

    getClan(id: string): Clan | undefined {
        return this.clans.find(c => c.id === id);
    }

    getAllClans(): Clan[] {
        return this.clans;
    }

    addHistoryEvent(event: HistoryEvent): void {
        this.historyEvents.push(event);
        this.saveToLocalStorage();
    }

    getAllHistoryEvents(): HistoryEvent[] {
        return this.historyEvents.sort((a, b) => a.date.localeCompare(b.date));
    }

    addFanfiction(fanfiction: Fanfiction): void {
        this.fanfictions.push(fanfiction);
        this.saveToLocalStorage();
    }

    getFanfiction(id: string): Fanfiction | undefined {
        return this.fanfictions.find(f => f.id === id);
    }

    getAllFanfictions(): Fanfiction[] {
        return this.fanfictions.sort((a, b) => {
            if (a.dateWritten && b.dateWritten) {
                return b.dateWritten.localeCompare(a.dateWritten);
            }
            return 0;
        });
    }

    getFanfictionsByCharacter(characterId: string): Fanfiction[] {
        return this.fanfictions.filter(f => f.characterIds.includes(characterId));
    }

    private saveToLocalStorage(): void {
        localStorage.setItem('narutoOC_characters', JSON.stringify(this.characters));
        localStorage.setItem('narutoOC_clans', JSON.stringify(this.clans));
        localStorage.setItem('narutoOC_history', JSON.stringify(this.historyEvents));
        localStorage.setItem('narutoOC_fanfictions', JSON.stringify(this.fanfictions));
    }

    private loadFromLocalStorage(): void {
        const charactersData = localStorage.getItem('narutoOC_characters');
        const clansData = localStorage.getItem('narutoOC_clans');
        const historyData = localStorage.getItem('narutoOC_history');
        const fanfictionsData = localStorage.getItem('narutoOC_fanfictions');

        if (charactersData) {
            this.characters = JSON.parse(charactersData);
        }
        if (clansData) {
            this.clans = JSON.parse(clansData);
        }
        if (historyData) {
            this.historyEvents = JSON.parse(historyData);
        }
        if (fanfictionsData) {
            this.fanfictions = JSON.parse(fanfictionsData);
        }
    }

    getStats() {
        return {
            characterCount: this.characters.length,
            clanCount: this.clans.length,
            villageCount: new Set(this.characters.map(c => c.village)).size,
            jutsuCount: this.characters.reduce((sum, c) => sum + c.abilities.length, 0)
        };
    }
}

// ============================================
// UI RENDERER
// ============================================

class UIRenderer {
    private dataManager: DataManager;

    constructor(dataManager: DataManager) {
        this.dataManager = dataManager;
    }


    // Stat bar rendering - using Font Awesome icons as fallback
    renderStatBar(value: number, max: number = 5): string {
        let html = '';
        for (let i = 1; i <= max; i++) {
            if (i <= value) {
                html += '<i class="fas fa-rectangle-wide"></i>';
            } else {
                html += '<i class="far fa-rectangle-wide"></i>';
            }
        }
        return html;
    }

    renderTraitBar(value: number, max: number = 5): string {
        let html = '';
        for (let i = 1; i <= max; i++) {
            if (i <= value) {
                html += '<i class="fas fa-circle"></i>';
            } else {
                html += '<i class="far fa-circle"></i>';
            }
        }
        return html;
    }

    renderStarRating(value: number, max: number = 5): string {
        let html = '';
        for (let i = 1; i <= max; i++) {
            if (i <= value) {
                html += '<i class="fa-solid fa-star"></i>';
            } else {
                html += '<i class="fa-regular fa-star"></i>';
            }
        }
        return html;
    }

    renderCharacterCard(character: Character): string {
        const villageCrest = this.getVillageCrest(character.village);
        return `
            <div class="col-md-4 mb-4">
                <div class="card scroll-card h-100">
                    <img src="${character.image}" class="card-img-top" alt="${character.firstName} ${character.lastName}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${character.firstName} ${character.lastName}</h5>
                        <p class="card-text">
                            <strong>Village:</strong> ${character.village}
                            ${villageCrest ? `<img src="${villageCrest}" alt="${character.village}" style="height: 20px; margin-left: 5px;">` : ''}<br>
                            <strong>Rank:</strong> ${character.rank}
                        </p>
                        <button class="btn btn-custom" onclick="showCharacterDetail('${character.id}')">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getVillageCrest(village: string): string | null {
        const villageMap: { [key: string]: string } = {
            'Konohagakure': 'images/konoha.png',
            'Sunagakure': 'images/suna.png',
            'Kirigakure': 'images/kiri.png',
            'Kumogakure': 'images/kumo.png',
            'Iwagakure': 'images/iwa.png',
            'Amegakure': 'images/ame.png',
            'Kusagakure': 'images/kusa.png',
            'Takigakure': 'images/taki.png',
            'Otogakure': 'images/oto.png',
            'Uzushiogakure': 'images/uzu.png',
            'Hoshigakure': 'images/hoshi.png',
            'Getsugakure': 'images/getsu.png',
            'Yugakure': 'images/yuga.png'
        };
        return villageMap[village] || null;
    }

    renderCharacterDetail(character: Character): void {
        // Name
        document.getElementById('character-lastname')!.textContent = character.lastName;
        document.getElementById('character-firstname')!.textContent = character.firstName;
        if (character.lastNameKanji) {
            document.getElementById('character-lastname-kanji')!.textContent = character.lastNameKanji;
        }
        if (character.firstNameKanji) {
            document.getElementById('character-firstname-kanji')!.textContent = character.firstNameKanji;
        }
        
        // Image
        document.getElementById('character-image')!.setAttribute('src', character.image);

        // Badges (Rank, Clan, Village)
        const badgesHtml = `
            <img src="${character.rankImage || 'images/hourglass.png'}" class="character-badge" title="Rank: ${character.rank}" data-bs-toggle="tooltip">
            ${character.clanCrest ? `<img src="${character.clanCrest}" class="character-badge" title="Clan: ${character.clan}" data-bs-toggle="tooltip">` : ''}
            <img src="${this.getVillageCrest(character.village) || 'images/konoha.png'}" class="character-badge" title="Village: ${character.village}" data-bs-toggle="tooltip">
        `;
        document.getElementById('character-badges')!.innerHTML = badgesHtml;

        // Stats
        const statsHtml = `
            <div class="flex-column">
                <p class="stat-row">
                    <span class="stat-label">Intelligence</span>
                    <span class="stat-bars">${this.renderStatBar(character.stats.intelligence)}</span>
                </p>
                <p class="stat-row">
                    <span class="stat-label">Stamina</span>
                    <span class="stat-bars">${this.renderStatBar(character.stats.stamina)}</span>
                </p>
                <p class="stat-row">
                    <span class="stat-label">Strength</span>
                    <span class="stat-bars">${this.renderStatBar(character.stats.strength)}</span>
                </p>
                <p class="stat-row">
                    <span class="stat-label">Speed</span>
                    <span class="stat-bars">${this.renderStatBar(character.stats.speed)}</span>
                </p>
                <p class="stat-row">
                    <span class="stat-label">Ninjutsu</span>
                    <span class="stat-bars">${this.renderStatBar(character.stats.ninjutsu)}</span>
                </p>
                <p class="stat-row">
                    <span class="stat-label">Genjutsu</span>
                    <span class="stat-bars">${this.renderStatBar(character.stats.genjutsu)}</span>
                </p>
                <p class="stat-row">
                    <span class="stat-label">Taijutsu</span>
                    <span class="stat-bars">${this.renderStatBar(character.stats.taijutsu)}</span>
                </p>
                <p class="stat-row">
                    <span class="stat-label">Hand Seals</span>
                    <span class="stat-bars">${this.renderStatBar(character.stats.handSeals)}</span>
                </p>
            </div>
        `;
        document.getElementById('character-stats')!.innerHTML = statsHtml;

        // Info Table
        const infoHtml = this.renderInfoTable(character.info);
        document.getElementById('character-info')!.innerHTML = infoHtml;

        // Affinities
        const affinitiesHtml = character.affinities.map(aff => {
            const letter = aff.charAt(0).toUpperCase();
            return `
                <span class="fa-stack fa-2x" data-bs-toggle="tooltip" title="${aff}" style="color: var(--color-teal);">
                    <i class="fas fa-square fa-stack-2x"></i>
                    <i class="fas fa-${letter.toLowerCase()} fa-stack-1x fa-inverse"></i>
                </span>
            `;
        }).join('');
        document.getElementById('character-affinities')!.innerHTML = affinitiesHtml;

        // Strategy
        document.getElementById('strategy-team')!.textContent = character.strategy.team;
        document.getElementById('strategy-alone')!.textContent = character.strategy.alone;
        document.getElementById('field-position')!.textContent = character.strategy.fieldPosition;
        document.getElementById('effective-distance')!.textContent = character.strategy.effectiveDistance;
        document.getElementById('specialty')!.textContent = character.strategy.specialty;
        document.getElementById('notable-abilities')!.textContent = character.strategy.notableAbilities;

        // Personality
        const likesHtml = character.personality.likes.map(like => 
            `<li><span class="fa-li"><i class="fas fa-check-square"></i></span>${like}</li>`
        ).join('');
        document.getElementById('character-likes')!.innerHTML = likesHtml;

        const dislikesHtml = character.personality.dislikes.map(dislike => 
            `<li><span class="fa-li"><i class="fas fa-square-xmark"></i></span>${dislike}</li>`
        ).join('');
        document.getElementById('character-dislikes')!.innerHTML = dislikesHtml;

        // Demeanor
        const demeanor = character.personality.demeanor;
        const demeanorHtml = `
            <div class="row trait-row">
                <div class="col-7">charisma</div>
                <div class="col trait-bars">${this.renderTraitBar(demeanor.charisma)}</div>
            </div>
            <div class="row trait-row">
                <div class="col-7">extraversion</div>
                <div class="col trait-bars">${this.renderTraitBar(demeanor.extraversion)}</div>
            </div>
            <div class="row trait-row">
                <div class="col-7">energy</div>
                <div class="col trait-bars">${this.renderTraitBar(demeanor.energy)}</div>
            </div>
            <div class="row trait-row">
                <div class="col-7">empathy</div>
                <div class="col trait-bars">${this.renderTraitBar(demeanor.empathy)}</div>
            </div>
            <div class="row trait-row">
                <div class="col-7">impulsivity</div>
                <div class="col trait-bars">${this.renderTraitBar(demeanor.impulsivity)}</div>
            </div>
            <div class="row trait-row">
                <div class="col-7">neuroticism</div>
                <div class="col trait-bars">${this.renderTraitBar(demeanor.neuroticism)}</div>
            </div>
            <div class="row trait-row">
                <div class="col-7">intuition</div>
                <div class="col trait-bars">${this.renderTraitBar(demeanor.intuition)}</div>
            </div>
            <div class="row trait-row">
                <div class="col-7">observation</div>
                <div class="col trait-bars">${this.renderTraitBar(demeanor.observation)}</div>
            </div>
            <div class="row trait-row">
                <div class="col-7">sensitivity</div>
                <div class="col trait-bars">${this.renderTraitBar(demeanor.sensitivity)}</div>
            </div>
            <div class="row trait-row">
                <div class="col-7">generosity</div>
                <div class="col trait-bars">${this.renderTraitBar(demeanor.generosity)}</div>
            </div>
            <div class="row trait-row">
                <div class="col-7">respect for authority</div>
                <div class="col trait-bars">${this.renderTraitBar(demeanor.respectForAuthority)}</div>
            </div>
        `;
        document.getElementById('character-demeanor')!.innerHTML = demeanorHtml;

        // Associates
        const associatesHtml = character.associates.map(assoc => `
            <div class="m-1 p-1">
                <p class="text-justify">
                    ${assoc.image ? `<img src="${assoc.image}" class="float-left img-thumbnail w-25 mr-2 mt-2" alt="${assoc.name}">` : ''}
                    ${assoc.link ? `<a class="text-uppercase" href="${assoc.link}">${assoc.name}</a>` : `<span class="text-uppercase">${assoc.name}</span>`}
                    <br>${assoc.description}
                </p>
            </div>
        `).join('');
        document.getElementById('character-associates')!.innerHTML = associatesHtml;

        // Abilities
        const abilitiesHtml = character.abilities.map(ability => {
            let metaHtml = '';
            if (ability.type === 'Taijutsu') {
                metaHtml = `
                    <div class="ability-meta">
                        <span>Base Style: </span>
                        <span>${ability.baseStyle || 'N/A'}</span>
                    </div>
                    <div class="ability-meta">
                        <span>Mastery: </span>
                        <span>${this.renderStarRating(ability.mastery || 0)}</span>
                    </div>
                `;
            } else {
                metaHtml = `
                    <div class="ability-meta">
                        <span>Difficulty: </span>
                        <span>${this.renderStarRating(ability.difficulty || 0)}</span>
                    </div>
                    <div class="ability-meta">
                        <span>Chakra Intensity: </span>
                        <span>${this.renderStarRating(ability.chakraIntensity || 0)}</span>
                    </div>
                `;
            }
            return `
                <h3 class="section-header-small">${ability.type}</h3>
                <div class="ability-section">
                    <div class="p-3">
                        <h5 class="ability-title">Style: ${ability.style} ${ability.rank ? `<small class="float-end">${ability.rank}</small>` : ''}</h5>
                        ${metaHtml}
                        <p class="text-justify">${ability.description}</p>
                    </div>
                </div>
            `;
        }).join('');
        document.getElementById('character-abilities')!.innerHTML = abilitiesHtml;

        // History
        const historyHtml = character.history.map(period => {
            const id = `history-${period.period.toLowerCase()}-${character.id}`;
            return `
                <div class="col-12 mb-1">
                    <a href="#${id}" data-bs-toggle="collapse" class="text-decoration-none text-white history-header">
                        <h3 class="w-100 text-white text-center text-uppercase p-2 mb-0">
                            ${period.period}
                        </h3>
                    </a>
                    <div id="${id}" class="collapse history-content">
                        <p>${period.content}</p>
                    </div>
                </div>
            `;
        }).join('');
        document.getElementById('character-history')!.innerHTML = historyHtml;

        // Appearance
        document.getElementById('appearance-image')!.setAttribute('src', character.appearance.image);
        const colorsHtml = character.appearance.colors.map(color => 
            `<div class="color-swatch" style="background-color: ${color};"></div>`
        ).join('');
        document.getElementById('character-colors')!.innerHTML = colorsHtml;

        // Gear - with weapon image support
        const gearImageMap: { [key: string]: string } = {
            'kunai': 'images/kunai.png',
            'kunai2': 'images/kunai2.png',
            'shuriken': 'images/shuriken.png',
            'sword': 'images/sword.png',
            'nunchuck': 'images/nunchuck.png',
            'ball': 'images/ball.png',
            'ball2': 'images/ball2.png',
            'glove': 'images/glove.png',
            'ryo': 'images/ryo.png',
            'headband': 'images/headband blank.png'
        };
        
        const gearHtml = character.appearance.gear.map(item => {
            const gearImageKey = item.name.toLowerCase().replace(/\s+/g, '');
            const gearImage = gearImageMap[gearImageKey] || (item.icon ? null : 'images/kunai.png');
            const iconHtml = gearImage 
                ? `<img src="${gearImage}" alt="${item.name}" class="gear-image">`
                : `<i class="${item.icon || 'far fa-fan'} gear-icon"></i>`;
            
            return `
                <div class="col m-2 gear-item">
                    <div class="p-2 justify-content-between">
                        <div class="gear-badge">
                            ${iconHtml}
                        </div>
                        <div class="gear-info">
                            <span class="gear-name">${item.name}</span>
                            <hr class="m-0">
                            <span class="gear-category">${item.category} ${item.size ? `<small><em>(${item.size})</em></small>` : ''}. ${item.material}, ${item.use}.</span>
                        </div>
                    </div>
                    <ul class="gear-info-list">
                        ${item.information.map(info => `<li>${info}</li>`).join('')}
                    </ul>
                </div>
            `;
        }).join('');
        document.getElementById('character-gear')!.innerHTML = gearHtml;
    }

    renderInfoTable(info: Character['info']): string {
        interface InfoRow {
            label: string;
            small: string;
            secondLabel?: string;
            secondSmall?: string;
        }
        const rows: Array<InfoRow> = [];
        if (info.aliases && info.aliases.length > 0) {
            rows.push({ label: info.aliases.join(', '), small: 'aliases' });
        }
        if (info.dateOfBirth) {
            rows.push({ label: info.dateOfBirth, small: 'date of birth' });
        }
        if (info.age) {
            rows.push({ label: info.age.toString(), small: 'age' });
        }
        if (info.bloodType) {
            rows.push({ label: info.bloodType, small: 'blood type' });
        }
        if (info.gender) {
            rows.push({ label: info.gender, small: 'gender' });
        }
        if (info.madeGenin || info.madeChunin) {
            rows.push({ 
                label: info.madeGenin || 'N/A', 
                small: 'made genin',
                secondLabel: info.madeChunin || 'N/A',
                secondSmall: 'made chunin'
            });
        }
        if (info.bodyType) {
            rows.push({ label: info.bodyType, small: 'body type' });
        }
        if (info.height || info.weight) {
            rows.push({ 
                label: info.height || 'N/A', 
                small: 'height',
                secondLabel: info.weight || 'N/A',
                secondSmall: 'weight'
            });
        }

        return rows.map(row => {
            if (row.secondLabel) {
                return `
                    <div class="row no-gutters align-items-center m-0 info-row">
                        <div class="col text-uppercase p-1 info-label">${row.label}</div>
                        <div class="col-3 font-italic text-center info-label-small">${row.small}</div>
                        <div class="col text-uppercase p-1 info-label">${row.secondLabel}</div>
                        <div class="col-3 font-italic text-center info-label-small">${row.secondSmall}</div>
                    </div>
                `;
            }
            return `
                <div class="row no-gutters align-items-center m-0 info-row">
                    <div class="col text-uppercase p-1 info-label">${row.label}</div>
                    <div class="col-3 font-italic text-center info-label-small">${row.small}</div>
                </div>
            `;
        }).join('');
    }

    renderCharacterList(characters: Character[]): void {
        const grid = document.getElementById('character-grid');
        if (grid) {
            grid.innerHTML = characters.map(c => this.renderCharacterCard(c)).join('');
        }
    }

    renderClanCard(clan: Clan): string {
        return `
            <div class="col-md-6 mb-4">
                <div class="card scroll-card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${clan.name}</h5>
                        ${clan.kanji ? `<p class="text-muted">${clan.kanji}</p>` : ''}
                        <p class="card-text">
                            <strong>Village:</strong> ${clan.village}<br>
                            ${clan.kekkeiGenkai ? `<strong>Kekkei Genkai:</strong> ${clan.kekkeiGenkai}<br>` : ''}
                        </p>
                        <p class="card-text">${clan.description}</p>
                        <button class="btn btn-custom" onclick="showClanDetail('${clan.id}')">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderClanDetail(clan: Clan): void {
        document.getElementById('clan-name')!.textContent = clan.name;
        const kanjiEl = document.getElementById('clan-kanji');
        if (kanjiEl) {
            kanjiEl.textContent = clan.kanji || '';
            kanjiEl.style.display = clan.kanji ? 'block' : 'none';
        }
        
        const symbolEl = document.getElementById('clan-symbol');
        if (symbolEl && clan.symbol) {
            symbolEl.innerHTML = `<img src="${clan.symbol}" alt="${clan.name} Symbol" style="max-width: 200px;">`;
        }
        
        document.getElementById('clan-village')!.textContent = clan.village;
        
        const kekkeiRow = document.getElementById('clan-kekkei-genkai-row');
        const kekkeiValue = document.getElementById('clan-kekkei-genkai');
        if (clan.kekkeiGenkai && kekkeiRow && kekkeiValue) {
            kekkeiRow.style.display = 'flex';
            kekkeiValue.textContent = clan.kekkeiGenkai;
        } else if (kekkeiRow) {
            kekkeiRow.style.display = 'none';
        }
        
        document.getElementById('clan-member-count')!.textContent = clan.members.length.toString();
        document.getElementById('clan-technique-count')!.textContent = clan.techniques.length.toString();
        document.getElementById('clan-description')!.textContent = clan.description;
        document.getElementById('clan-history')!.textContent = clan.history;
        
        const membersHtml = clan.members.map(member => 
            `<li><span class="fa-li"><i class="fas fa-user-ninja"></i></span>${member}</li>`
        ).join('');
        document.getElementById('clan-members')!.innerHTML = membersHtml;
        
        const techniquesHtml = clan.techniques.map(technique => 
            `<li><span class="fa-li"><i class="fas fa-scroll"></i></span>${technique}</li>`
        ).join('');
        document.getElementById('clan-techniques')!.innerHTML = techniquesHtml;
    }

    renderHistoryEvent(event: HistoryEvent): string {
        return `
            <div class="col-12 mb-3" data-category="${event.category}">
                <div class="card scroll-card">
                    <div class="card-header section-header-dark">
                        <h5 class="mb-0">${event.title}</h5>
                        <small>${event.date}</small>
                    </div>
                    <div class="card-body">
                        <p>${event.description}</p>
                        ${event.relatedCharacters && event.relatedCharacters.length > 0 ? 
                            `<p><strong>Related Characters:</strong> ${event.relatedCharacters.join(', ')}</p>` : ''}
                        ${event.relatedClans && event.relatedClans.length > 0 ? 
                            `<p><strong>Related Clans:</strong> ${event.relatedClans.join(', ')}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    renderFanfictionCard(fanfiction: Fanfiction): string {
        const dm = (window as any).dataManager;
        const characterNames = fanfiction.characterIds.map(id => {
            const char = dm.getCharacter(id);
            return char ? `${char.firstName} ${char.lastName}` : id;
        }).join(', ');
        
        return `
            <div class="col-md-6 mb-4">
                <div class="card scroll-card h-100">
                    <div class="card-header section-header-dark">
                        <h5 class="mb-0">${fanfiction.title}</h5>
                        ${fanfiction.chapter ? `<small>Chapter ${fanfiction.chapter}</small>` : ''}
                        ${fanfiction.dateWritten ? `<small>${fanfiction.dateWritten}</small>` : ''}
                    </div>
                    <div class="card-body">
                        <p><strong>Characters:</strong> ${characterNames}</p>
                        <p class="text-truncate">${fanfiction.content.substring(0, 150)}...</p>
                        ${fanfiction.tags && fanfiction.tags.length > 0 ? 
                            `<p><small><strong>Tags:</strong> ${fanfiction.tags.join(', ')}</small></p>` : ''}
                        <button class="btn btn-custom" onclick="showFanfictionDetail('${fanfiction.id}')">
                            Read More
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderFanfictionDetail(fanfiction: Fanfiction): void {
        document.getElementById('fanfiction-title')!.textContent = fanfiction.title;
        if (fanfiction.chapter) {
            document.getElementById('fanfiction-chapter')!.textContent = `Chapter ${fanfiction.chapter}`;
            document.getElementById('fanfiction-chapter')!.style.display = 'block';
        } else {
            document.getElementById('fanfiction-chapter')!.style.display = 'none';
        }
        if (fanfiction.dateWritten) {
            document.getElementById('fanfiction-date')!.textContent = fanfiction.dateWritten;
            document.getElementById('fanfiction-date')!.style.display = 'block';
        } else {
            document.getElementById('fanfiction-date')!.style.display = 'none';
        }
        
        const dm = (window as any).dataManager;
        const characterNames = fanfiction.characterIds.map(id => {
            const char = dm.getCharacter(id);
            return char ? `${char.firstName} ${char.lastName}` : id;
        }).join(', ');
        document.getElementById('fanfiction-characters')!.textContent = characterNames;
        
        document.getElementById('fanfiction-content')!.innerHTML = fanfiction.content.split('\n').map(p => `<p>${p}</p>`).join('');
        
        if (fanfiction.tags && fanfiction.tags.length > 0) {
            const tagsHtml = fanfiction.tags.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('');
            document.getElementById('fanfiction-tags')!.innerHTML = tagsHtml;
            document.getElementById('fanfiction-tags-container')!.style.display = 'block';
        } else {
            document.getElementById('fanfiction-tags-container')!.style.display = 'none';
        }
    }
}

// ============================================
// INITIALIZE
// ============================================

const dataManager = new DataManager();
const uiRenderer = new UIRenderer(dataManager);

// Global functions for HTML
(window as any).loadCharacterDetail = (id: string) => {
    const character = dataManager.getCharacter(id);
    if (character) {
        uiRenderer.renderCharacterDetail(character);
    }
};

(window as any).showCharacterList = () => {
    const characters = dataManager.getAllCharacters();
    uiRenderer.renderCharacterList(characters);
};

(window as any).loadClanDetail = (id: string) => {
    const clan = dataManager.getClan(id);
    if (clan) {
        uiRenderer.renderClanDetail(clan);
    }
};

(window as any).showFanfictionDetail = (id: string) => {
    document.getElementById('fanfiction-list')!.style.display = 'none';
    document.getElementById('fanfiction-detail')!.style.display = 'block';
    const fanfiction = dataManager.getFanfiction(id);
    if (fanfiction) {
        uiRenderer.renderFanfictionDetail(fanfiction);
    }
};

(window as any).showFanfictionList = () => {
    document.getElementById('fanfiction-list')!.style.display = 'block';
    document.getElementById('fanfiction-detail')!.style.display = 'none';
};

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

function initialize() {
    // Update stats on index page
    const stats = dataManager.getStats();
    const characterCountEl = document.getElementById('character-count');
    const clanCountEl = document.getElementById('clan-count');
    const villageCountEl = document.getElementById('village-count');
    const jutsuCountEl = document.getElementById('jutsu-count');

    if (characterCountEl) characterCountEl.textContent = stats.characterCount.toString();
    if (clanCountEl) clanCountEl.textContent = stats.clanCount.toString();
    if (villageCountEl) villageCountEl.textContent = stats.villageCount.toString();
    if (jutsuCountEl) jutsuCountEl.textContent = stats.jutsuCount.toString();

    // Load character list if on characters page
    if (document.getElementById('character-grid')) {
        const characters = dataManager.getAllCharacters();
        uiRenderer.renderCharacterList(characters);

        // Search functionality
        const searchInput = document.getElementById('character-search') as HTMLInputElement;
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = (e.target as HTMLInputElement).value;
                const results = dataManager.searchCharacters(query);
                uiRenderer.renderCharacterList(results);
            });
        }
    }

    // Load clan list if on clans page
    if (document.getElementById('clan-grid')) {
        const clans = dataManager.getAllClans();
        const clanGrid = document.getElementById('clan-grid');
        if (clanGrid) {
            clanGrid.innerHTML = clans.map(c => uiRenderer.renderClanCard(c)).join('');
        }
    }

    // Load history if on history page
    if (document.getElementById('history-timeline')) {
        const events = dataManager.getAllHistoryEvents();
        const timeline = document.getElementById('history-timeline');
        if (timeline) {
            timeline.innerHTML = events.map(e => uiRenderer.renderHistoryEvent(e)).join('');
        }
    }

    // Load fanfictions if on fanfiction page
    if (document.getElementById('fanfiction-grid')) {
        const fanfictions = dataManager.getAllFanfictions();
        const grid = document.getElementById('fanfiction-grid');
        if (grid) {
            grid.innerHTML = fanfictions.map(f => uiRenderer.renderFanfictionCard(f)).join('');
        }
    }
}

// Export for use in other files
(window as any).dataManager = dataManager;
(window as any).uiRenderer = uiRenderer;
