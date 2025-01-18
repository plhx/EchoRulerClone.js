/**
* @file echoruler.vanilla.js
* @copyright 2025 PlasticHeart
*/

!(root => {
    // 武器IDの定義を追加する
    const { WeaponId } = root.EchoRuler

    Object.assign(WeaponId, {
        NONE: new WeaponId('None'),
        SWORD: new WeaponId('Sword'),
        LONG_SPEAR: new WeaponId('LongSpear'),
        SHORT_SWORD: new WeaponId('ShortSword'),
        LONGBOW: new WeaponId('Longbow'),
        DESTRUCTION: new WeaponId('Destruction'),
        FIRE_BREATHE: new WeaponId('FireBreathe'),
        THUNDER_BREATHE: new WeaponId('ThunderBreathe'),
        POISON_NEEDLE: new WeaponId('PoisonNeedle'),
        SCYTHE: new WeaponId('Scythe'),
        WEB: new WeaponId('Web'),
        FIREBOLT: new WeaponId('Firebolt'),
        ACID_CRAPE: new WeaponId('AcidCrape'),
        POISON_BREATHE: new WeaponId('PoisonBreathe'),
        AQUA_BLADE: new WeaponId('AquaBlade'),
        VORTEX: new WeaponId('Vortex'),
        BEAR_CRUSH: new WeaponId('BearCrush'),
        POISON_BLOW: new WeaponId('PoisonBlow'),
        HUGE_AXE: new WeaponId('HugeAxe'),
        BLOOD_NAIL: new WeaponId('BloodNail'),
        ACID: new WeaponId('Acid'),
        CURSE: new WeaponId('Curse'),
        KILLER_FANG: new WeaponId('KillerFang'),
        ICE_BREATHE: new WeaponId('IceBreathe'),
        COLD_WIND: new WeaponId('ColdWind'),
        SNOW_BULLET: new WeaponId('SnowBullet'),
        CRACK_BLAST: new WeaponId('CrackBlast'),
        WINDSTORM: new WeaponId('Windstorm'),
        THREE_HEAD: new WeaponId('ThreeHead'),
        HOLY_LIGHT: new WeaponId('HolyLight'),
        HORN: new WeaponId('Horn'),
        BULLET: new WeaponId('Bullet'),
        STONE_KNUCKLE: new WeaponId('StoneKnuckle'),
        FANG: new WeaponId('Fang'),
        CLAW: new WeaponId('Claw'),
        LITTLE_BREATHE: new WeaponId('LittleBreathe'),
        VINE: new WeaponId('Vine'),
        // FIXME: サーリッドの語源が不明なので暫定対処として「渇望」を意味するThirstedをあてておく
        THIRSTED: new WeaponId('Thirsted'),
        // FIXME: リ・ファの語源が不明なので暫定対処として単語から想定されるLiPhaをあてておく
        LI_PHA: new WeaponId('LiPha'),
        SHOCK: new WeaponId('Shock'),
        FLUSH_WAVE: new WeaponId('FlushWave'),
        SCISSORS: new WeaponId('Scissors'),
        STONE_CURSE: new WeaponId('StoneCurse'),
        DEADLY_CRY: new WeaponId('DeadlyCry'),
        WET_NAIL: new WeaponId('WetNail'),
        BODY_PRESS: new WeaponId('BodyPress'),
        FLARE_BLADE: new WeaponId('FlareBlade'),
    })
})(this)

!(root => {
    const { Damage, DamageKind, Effect, Element, Targeting, Weapon, WeaponId } = root.EchoRuler

    Weapon.values.push(
        new Weapon(WeaponId.NONE, 'なし', 0, new Damage(0, DamageKind.MATERIAL)),
        new Weapon(WeaponId.SWORD, 'ソード', 1, new Damage(80, DamageKind.MATERIAL)),
        new Weapon(WeaponId.LONG_SPEAR, 'ロングスピア', 2, new Damage(100, DamageKind.MATERIAL)),
        new Weapon(WeaponId.SHORT_SWORD, 'ショートソード', 1, new Damage(60, DamageKind.MATERIAL)),
        new Weapon(WeaponId.LONGBOW, 'ロングボウ', 5, new Damage(60, DamageKind.MATERIAL), {
            targeting: Targeting.LONG_RANGE
        }),
        new Weapon(WeaponId.DESTRUCTION, 'デストラクション', 7, new Damage(120, DamageKind.MAGICAL), {
            targeting: Targeting.LONG_RANGE
        }),
        new Weapon(WeaponId.FIRE_BREATHE, 'ファイアブレス', 1, new Damage(80, DamageKind.ELEMENTAL, Element.FIRE), {
            targeting: Targeting.WIDE
        }),
        new Weapon(WeaponId.THUNDER_BREATHE, 'サンダーブレス', 2, new Damage(80, DamageKind.ELEMENTAL, Element.AIR), {
            targeting: Targeting.PENETRATE
        }),
        new Weapon(WeaponId.POISON_NEEDLE, 'ポイズンニードル', 1, new Damage(60, DamageKind.MATERIAL), {
            effects: new Set([Effect.POISON]),
        }),
        new Weapon(WeaponId.SCYTHE, 'サイズ', 1, new Damage(120, DamageKind.MATERIAL)),
        new Weapon(WeaponId.WEB, 'ウェブ', 5, new Damage(60, DamageKind.MATERIAL), {
            targeting: Targeting.LONG_RANGE,
            effects: new Set([Effect.SLOW])
        }),
        new Weapon(WeaponId.FIREBOLT, 'ファイアボルト', 7, new Damage(40, DamageKind.ELEMENTAL, Element.FIRE), {
            targeting: Targeting.LONG_RANGE,
        }),
        new Weapon(WeaponId.ACID_CRAPE, 'アシッドクレイプ', 1, new Damage(80, DamageKind.ELEMENTAL, Element.WATER)),
        new Weapon(WeaponId.POISON_BREATHE, 'ポイズンブレス', 2, new Damage(20, DamageKind.ELEMENTAL, Element.WATER), {
            targeting: Targeting.PENETRATE,
            effects: new Set([Effect.POISON]),
        }),
        new Weapon(WeaponId.AQUA_BLADE, 'アクアブレイド', 7, new Damage(40, DamageKind.ELEMENTAL, Element.WATER), {
            targeting: Targeting.LONG_RANGE,
        }),
        new Weapon(WeaponId.VORTEX, 'ヴォーテクス', 7, new Damage(40, DamageKind.ELEMENTAL, Element.AIR), {
            targeting: Targeting.LONG_RANGE,
        }),
        new Weapon(WeaponId.BEAR_CRUSH, 'ベアクラッシュ', 1, new Damage(300, DamageKind.MATERIAL), {
            effects: new Set([Effect.STUN]),
        }),
        new Weapon(WeaponId.POISON_BLOW, 'ポイズンブロウ', 1, new Damage(200, DamageKind.MATERIAL), {
            effects: new Set([Effect.POISON]),
        }),
        new Weapon(WeaponId.HUGE_AXE, 'ヒュージアクス', 2, new Damage(400, DamageKind.MATERIAL)),
        new Weapon(WeaponId.BLOOD_NAIL, 'ブラッドネイル', 1, new Damage(200, DamageKind.MATERIAL), {
            effects: new Set([Effect.CURSE]),
        }),
        new Weapon(WeaponId.ACID, 'アシッド', 1, new Damage(20, DamageKind.ELEMENTAL, Element.WATER)),
        new Weapon(WeaponId.CURSE, 'カース', 7, new Damage(80, DamageKind.ELEMENTAL, Element.MIND), {
            effects: new Set([Effect.CURSE]),
        }),
        new Weapon(WeaponId.KILLER_FANG, 'キラーファング', 1, new Damage(200, DamageKind.MATERIAL)),
        new Weapon(WeaponId.ICE_BREATHE, 'アイスブレス', 1, new Damage(80, DamageKind.ELEMENTAL, Element.EARTH), {
            targeting: Targeting.WIDE
        }),
        new Weapon(WeaponId.COLD_WIND, 'コールドウィンド', 2, new Damage(40, DamageKind.ELEMENTAL, Element.EARTH), {
            targeting: Targeting.PENETRATE
        }),
        new Weapon(WeaponId.SNOW_BULLET, 'スノウブリッド', 5, new Damage(40, DamageKind.ELEMENTAL, Element.EARTH)),
        new Weapon(WeaponId.CRACK_BLAST, 'クラックブラスト', 7, new Damage(80, DamageKind.ELEMENTAL, Element.EARTH), {
            targeting: Targeting.ANTI_GROUND,
        }),
        new Weapon(WeaponId.WINDSTORM, 'ウインドストーム', 7, new Damage(80, DamageKind.ELEMENTAL, Element.AIR), {
            targeting: Targeting.ANTI_AIR,
        }),
        new Weapon(WeaponId.THREE_HEAD, '3-Head', 0, new Damage(0, DamageKind.SPECIAL), {
            targeting: Targeting.THREE_HEAD,
        }),
        new Weapon(WeaponId.HOLY_LIGHT, 'ホーリーライト', 7, new Damage(180, DamageKind.MAGICAL), {
            targeting: Targeting.LONG_RANGE,
        }),
        new Weapon(WeaponId.HORN, 'ホーン', 1, new Damage(80, DamageKind.MATERIAL)),
        new Weapon(WeaponId.BULLET, 'ブリッド', 5, new Damage(60, DamageKind.MATERIAL), {
            targeting: Targeting.LONG_RANGE,
        }),
        new Weapon(WeaponId.STONE_KNUCKLE, 'ストーンナックル', 1, new Damage(200, DamageKind.MATERIAL), {
            effects: new Set([Effect.STUN]),
        }),
        new Weapon(WeaponId.FANG, 'ファング', 1, new Damage(80, DamageKind.MATERIAL)),
        new Weapon(WeaponId.CLAW, 'クロウ', 1, new Damage(80, DamageKind.MATERIAL)),
        new Weapon(WeaponId.LITTLE_BREATHE, 'リトルブレス', 1, new Damage(40, DamageKind.ELEMENTAL, Element.FIRE), {
            targeting: Targeting.WIDE
        }),
        new Weapon(WeaponId.VINE, 'ヴァイン', 1, new Damage(80, DamageKind.MATERIAL)),
        new Weapon(WeaponId.THIRSTED, 'サーリッド', 1, new Damage(120, DamageKind.MATERIAL)),
        new Weapon(WeaponId.LI_PHA, 'リ・ファ', 7, new Damage(120, DamageKind.MAGICAL), {
            targeting: Targeting.LONG_RANGE,
        }),
        new Weapon(WeaponId.SHOCK, 'ショック', 2, new Damage(40, DamageKind.ELEMENTAL, Element.AIR), {
            effects: new Set([Effect.STUN]),
        }),
        new Weapon(WeaponId.FLUSH_WAVE, 'フラッシュウェイブ', 7, new Damage(40, DamageKind.ELEMENTAL, Element.WATER), {
            targeting: Targeting.PENETRATE
        }),
        new Weapon(WeaponId.SCISSORS, 'シザー', 1, new Damage(80, DamageKind.MATERIAL)),
        new Weapon(WeaponId.STONE_CURSE, 'ストーンカース', 1, new Damage(80, DamageKind.MATERIAL), {
            effects: new Set([Effect.STONE]),
        }),
        new Weapon(WeaponId.DEADLY_CRY, 'デッドリークライ', 7, new Damage(40, DamageKind.ELEMENTAL, Element.MIND), {
            effects: new Set([Effect.PARALYZE]),
        }),
        new Weapon(WeaponId.WET_NAIL, 'ウェットネイル', 1, new Damage(60, DamageKind.MATERIAL), {
            effects: new Set([Effect.DISEASE]),
        }),
        new Weapon(WeaponId.BODY_PRESS, 'ボディプレス', 1, new Damage(100, DamageKind.MATERIAL)),
        new Weapon(WeaponId.FLARE_BLADE, 'フレアブレイド', 1, new Damage(80, DamageKind.ELEMENTAL, Element.FIRE)),
    )
})(this)

!(root => {
    // 防具IDの定義を追加する
    const { ArmorId } = root.EchoRuler

    Object.assign(ArmorId, {
        NONE: new ArmorId('None'),
        PLATE_MAIL: new ArmorId('PlateMail'),
        BREAST_PLATE: new ArmorId('BreastPlate'),
        HARD_SKIN: new ArmorId('HardSkin'),
        HUSK: new ArmorId('Husk'),
        HARD_SHELL: new ArmorId('HardShell'),
        FIRE_DRAGON_SCALE: new ArmorId('FireDragonScale'),
        THUNDER_DRAGON_SCALE: new ArmorId('ThunderDragonScale'),
        FIRE_FAMILLIAR: new ArmorId('FireFamilliar'),
        FIRE_SKIN: new ArmorId('FireSkin'),
        VISCOUS_LIQUID: new ArmorId('ViscousLiquid'),
        WATER_FAMILLIAR: new ArmorId('WaterFamilliar'),
        AIR_FAMILLIAR: new ArmorId('AirFamilliar'),
        IMAGINARY_AXIS: new ArmorId('ImaginaryAxis'),
        ICE_DRAGON_SCALE: new ArmorId('IceDragonScale'),
        ICE_FAMILLIAR: new ArmorId('IceFamilliar'),
        STONE_BODY: new ArmorId('StoneBody'),
        ASTRAL_BODY: new ArmorId('AstralBody'),
    })
})(this)

!(root => {
    const { Armor, ArmorId, Element } = root.EchoRuler

    Armor.values.push(
        new Armor(ArmorId.NONE, 'なし'),
        new Armor(ArmorId.PLATE_MAIL, 'プレートメイル', { material: 75 }),
        new Armor(ArmorId.BREAST_PLATE, 'ブレストプレート', { material: 50 }),
        new Armor(ArmorId.HARD_SKIN, '硬皮', { material: 25 }),
        new Armor(ArmorId.HUSK, '甲殻', { material: 50 }),
        new Armor(ArmorId.HARD_SHELL, '硬殻', { material: 75 }),
        new Armor(ArmorId.FIRE_DRAGON_SCALE, '炎の竜鱗', { material: 75, element: Element.FIRE }),
        new Armor(ArmorId.THUNDER_DRAGON_SCALE, '雷の竜鱗', { material: 75, element: Element.AIR }),
        new Armor(ArmorId.FIRE_FAMILLIAR, '炎の眷族', { element: Element.FIRE }),
        new Armor(ArmorId.FIRE_SKIN, '炎の硬皮', { material: 50, element: Element.FIRE }),
        new Armor(ArmorId.VISCOUS_LIQUID, '粘性体', { material: 90 }),
        new Armor(ArmorId.WATER_FAMILLIAR, '水の眷族', { element: Element.WATER }),
        new Armor(ArmorId.AIR_FAMILLIAR, '風の眷族', { element: Element.AIR }),
        new Armor(ArmorId.IMAGINARY_AXIS, '虚軸体', { material: 50 }),
        new Armor(ArmorId.ICE_DRAGON_SCALE, '氷の竜鱗', { material: 75, element: Element.EARTH }),
        new Armor(ArmorId.ICE_FAMILLIAR, '氷の眷属', { material: 0, element: Element.EARTH }),
        new Armor(ArmorId.STONE_BODY, 'ストーンボディ', { material: 75 }),
        new Armor(ArmorId.ASTRAL_BODY, 'アストラルボディ', { material: 90 })
    )
})(this)

!(root => {
    // クリーチャーIDの定義を追加する
    const { CreatureId } = root.EchoRuler

    Object.assign(CreatureId, {
        NONE: new CreatureId('None'),
        KNIGHT: new CreatureId('Knight'),
        LANCER: new CreatureId('Lancer'),
        NINJA: new CreatureId('Ninja'),
        ARCHER: new CreatureId('Archer'),
        WIZARD: new CreatureId('Wizard'),
        RED_DRAGON: new CreatureId('RedDragon'),
        BLUE_DRAGON: new CreatureId('BlueDragon'),
        VALKYRIE: new CreatureId('Valkyrie'),
        SCORPION: new CreatureId('Scorpion'),
        MANTIS: new CreatureId('Mantis'),
        BEETLE: new CreatureId('Beetle'),
        SPIDER: new CreatureId('Spider'),
        CERBERUS: new CreatureId('Cerberus'),
        PHOENIX: new CreatureId('Phoenix'),
        LAVA_LIZARD: new CreatureId('LavaLizard'),
        SALAMANDER: new CreatureId('Salamander'),
        GOLEM: new CreatureId('Golem'),
        CHIMERA: new CreatureId('Chimera'),
        SLIME: new CreatureId('Slime'),
        DRAGON_FLY: new CreatureId('DragonFly'),
        MOTH: new CreatureId('Moth'),
        UNDINE: new CreatureId('Undine'),
        TRICERATOPS: new CreatureId('Triceratops'),
        WOLF: new CreatureId('Wolf'),
        GRAY_BEAR: new CreatureId('GrayBear'),
        ELF: new CreatureId('Elf'),
        SYLPH: new CreatureId('Sylph'),
        FALCON: new CreatureId('Falcon'),
        WYVERN: new CreatureId('Wyvern'),
        MINOTAUR: new CreatureId('Minotaur'),
        STAR_VAMPIRE: new CreatureId('StarVampire'),
        SLUG: new CreatureId('Slug'),
        GHOST: new CreatureId('Ghost'),
        JACK_O_LANTERN: new CreatureId("Jacko'Lantern"),
        TRAP_VINE: new CreatureId('TrapVine'),
        DARK_YOUNG: new CreatureId('DarkYoung'),
        OLD_ONE: new CreatureId('OldOne'),
        ASURA: new CreatureId('Asura'),
        FLYING_POLYP: new CreatureId('FlyingPolyp'),
        MAN_O_WAR: new CreatureId("Man-o'-war"),
        WHITE_DRAGON: new CreatureId('WhiteDragon'),
        FREEZE_SOUR: new CreatureId('FreezeSour'),
        SNOW: new CreatureId('Snow'),
        SORCERER: new CreatureId('Sorcerer'),
        SORCERESS: new CreatureId('Sorceress'),
        SEA_DRAKE: new CreatureId('SeaDrake'),
        MERMAID: new CreatureId('Mermaid'),
        CRAB: new CreatureId('Crab'),
        DEEP_PASTE: new CreatureId('DeepPaste'),
        COCKATRICE: new CreatureId('Cockatrice'),
        SKELETON: new CreatureId('Skeleton'),
        MANDRAKE: new CreatureId('Mandrake'),
        ROCKPILE: new CreatureId('Rockpile'),
        ANGEL: new CreatureId('Angel'),
        IMP: new CreatureId('Imp'),
        SNOW_MAN: new CreatureId('SnowMan'),
        ALBINO_PENGUIN: new CreatureId('AlbinoPenguin'),
        SWORD_MASTER: new CreatureId('SwordMaster'),
        RUNE_KNIGHT: new CreatureId('RuneKnight')
    })
})(this)

!(root => {
    const { ArmorId, CreatureId, CreatureSchema, Skill, Trait, WeaponId } = root.EchoRuler

    // クリーチャーの定義を追加する
    CreatureSchema.values.push(
        new CreatureSchema(CreatureId.NONE, 0, WeaponId.NONE, ArmorId.NONE, 0, {
            message: '',
            description: '−',
        }),
        new CreatureSchema(CreatureId.KNIGHT, 200, WeaponId.SWORD, ArmorId.PLATE_MAIL, 32, {
            message: '{name}は剣で斬りつけた！',
            description: '鋼の鎧を身に着けた重装騎士。前衛に立ち、味方を守る盾となる。',
        }),
        new CreatureSchema(CreatureId.LANCER, 180, WeaponId.LONG_SPEAR, ArmorId.BREAST_PLATE, 40, {
            message: '{name}は槍を繰り出す！',
            description: '槍を手に戦うフリーファイター。前衛、中衛から強力な一撃を繰り出す。',
        }),
        new CreatureSchema(CreatureId.NINJA, 120, WeaponId.SHORT_SWORD, ArmorId.NONE, 48, {
            skills: new Set([Skill.FREE_MOVE]),
            message: '{name}は影となり忍び寄る！',
            description: '影に潜み、獲物を狙う暗殺者。中衛から飛び出し、真っ先に攻撃を仕掛ける。',
        }),
        new CreatureSchema(CreatureId.ARCHER, 140, WeaponId.LONGBOW, ArmorId.BREAST_PLATE, 24, {
            message: '{name}は矢を放った！',
            description: '風の加護を受けた弓使い。中衛、後衛から敵の弱点を狙う。',
        }),
        new CreatureSchema(CreatureId.WIZARD, 100, WeaponId.DESTRUCTION, ArmorId.NONE, 16, {
            message: '{name}が呪文を唱える！',
            description: '世の理を知る魔術師。後衛に位置して、呪文を唱える。',
        }),
        new CreatureSchema(CreatureId.RED_DRAGON, 1500, WeaponId.FIRE_BREATHE, ArmorId.FIRE_DRAGON_SCALE, 8, {
            size: 3,
            traits: new Set([Trait.LARGE]),
            message: '{name}の火炎ブレスが大地を覆う！',
            description: '灼熱の炎を宿した紅き竜。',
        }),
        new CreatureSchema(CreatureId.BLUE_DRAGON, 1500, WeaponId.THUNDER_BREATHE, ArmorId.THUNDER_DRAGON_SCALE, 24, {
            size: 3,
            skills: new Set([Skill.FREE_MOVE]),
            traits: new Set([Trait.LARGE, Trait.FLYING]),
            message: '{name}の雷撃が地を疾る！',
            description: '稲妻を身に纏う蒼き竜。',
        }),
        new CreatureSchema(CreatureId.VALKYRIE, 120, WeaponId.LONG_SPEAR, ArmorId.BREAST_PLATE, 40, {
            skills: new Set([Skill.FREE_MOVE, Skill.ATTACK_2]),
            traits: new Set([Trait.FLYING]),
            message: '{name}のすばやい攻撃！',
            description: '戦場の空に現れる武装した乙女。',
        }),
        new CreatureSchema(CreatureId.SCORPION, 50, WeaponId.POISON_NEEDLE, ArmorId.HARD_SKIN, 32, {
            skills: new Set([Skill.HIGH_TARGET]),
            message: '{name}は毒針を飛ばした！',
            description: '猛毒を持った巨大なサソリ。',
        }),
        new CreatureSchema(CreatureId.MANTIS, 50, WeaponId.SCYTHE, ArmorId.NONE, 48, {
            message: '{name}が大鎌を振り下ろす！',
            description: '巨大な鎌を持つカマキリ。',
        }),
        new CreatureSchema(CreatureId.BEETLE, 50, WeaponId.HORN, ArmorId.HUSK, 32, {
            message: '{name}の体当たり！',
            description: '硬い外皮を持つ甲虫。',
        }),
        new CreatureSchema(CreatureId.SPIDER, 50, WeaponId.WEB, ArmorId.NONE, 24, {
            message: '{name}は糸を飛ばした！',
            description: '粘性の糸を飛ばす大蜘蛛。',
        }),
        new CreatureSchema(CreatureId.CERBERUS, 350, WeaponId.KILLER_FANG, ArmorId.FIRE_SKIN, 48, {
            size: 2,
            skills: new Set([Skill.ATTACK_3]),
            traits: new Set([Trait.LARGE]),
            message: '{name}のすばやい攻撃！',
            description: '炎を纏った地獄の番犬。',
        }),
        new CreatureSchema(CreatureId.PHOENIX, 200, WeaponId.FIRE_BREATHE, ArmorId.FIRE_FAMILLIAR, 24, {
            size: 2,
            skills: new Set([Skill.FREE_MOVE]),
            traits: new Set([Trait.NERVELESS, Trait.LARGE, Trait.FLYING]),
            message: '{name}は火炎弾を放った！',
            description: '炎の不死鳥。',
        }),
        new CreatureSchema(CreatureId.LAVA_LIZARD, 100, WeaponId.BULLET, ArmorId.FIRE_FAMILLIAR, 24, {
            message: '{name}は火山弾を放った！',
            description: '溶岩に生息するトカゲ。',
        }),
        new CreatureSchema(CreatureId.SALAMANDER, 50, WeaponId.FIREBOLT, ArmorId.FIRE_FAMILLIAR, 16, {
            traits: new Set([Trait.NERVELESS]),
            message: '{name}は炎を槍と化す！',
            description: '炎の精霊。',
        }),
        new CreatureSchema(CreatureId.GOLEM, 500, WeaponId.STONE_KNUCKLE, ArmorId.STONE_BODY, 24, {
            size: 2,
            traits: new Set([Trait.NERVELESS, Trait.LARGE]),
            message: '{name}の拳がうなる！',
            description: '魔力で動く石の巨像。',
        }),
        new CreatureSchema(CreatureId.CHIMERA, 350, WeaponId.THREE_HEAD, ArmorId.HARD_SKIN, 16, {
            size: 2,
            traits: new Set([Trait.LARGE]),
            message: '{name}は炎を吐き、呪い、牙を剥く！',
            description: '獅子の体に竜の首と山羊の首を持つ、合成魔獣。',
        }),
        new CreatureSchema(CreatureId.SLIME, 120, WeaponId.ACID_CRAPE, ArmorId.VISCOUS_LIQUID, 8, {
            targetraitsting: new Set([Trait.NERVELESS]),
            message: '{name}は強力な酸を分泌する！',
            description: '物理攻撃の効かない不定形生物。',
        }),
        new CreatureSchema(CreatureId.DRAGON_FLY, 30, WeaponId.FIRE_BREATHE, ArmorId.NONE, 24, {
            skills: new Set([Skill.FREE_MOVE]),
            traits: new Set([Trait.FLYING]),
            message: '{name}は炎を吐いた！',
            description: '火炎を飛ばす飛行昆虫。',
        }),
        new CreatureSchema(CreatureId.MOTH, 30, WeaponId.POISON_BREATHE, ArmorId.NONE, 24, {
            skills: new Set([Skill.FREE_MOVE]),
            traits: new Set([Trait.FLYING]),
            message: '{name}は毒の粉を飛ばす！',
            description: '毒の粉を振り撒く蛾。',
        }),
        new CreatureSchema(CreatureId.UNDINE, 50, WeaponId.AQUA_BLADE, ArmorId.WATER_FAMILLIAR, 16, {
            message: '{name}は水を刃と化す！',
            description: '水の精霊。',
        }),
        new CreatureSchema(CreatureId.TRICERATOPS, 500, WeaponId.HORN, ArmorId.HARD_SHELL, 32, {
            size: 2,
            traits: new Set([Trait.LARGE]),
            message: '{name}が突進する！',
            description: '硬い外皮と角を持った草食恐竜。',
        }),
        new CreatureSchema(CreatureId.WOLF, 80, WeaponId.FANG, ArmorId.NONE, 48, {
            skills: new Set([Skill.FREE_MOVE]),
            message: '{name}が影となり地を駆ける！',
            description: '俊敏な狼。',
        }),
        new CreatureSchema(CreatureId.GRAY_BEAR, 500, WeaponId.BEAR_CRUSH, ArmorId.HARD_SKIN, 40, {
            size: 2,
            skills: new Set([Skill.HIGH_TARGET, Skill.ATTACK_2]),
            traits: new Set([Trait.LARGE]),
            message: '{name}の爪が振り下ろされる！',
            description: '巨大な灰色熊。',
        }),
        new CreatureSchema(CreatureId.ELF, 80, WeaponId.LONGBOW, ArmorId.NONE, 24, {
            message: '{name}は矢を放った！',
            description: '弓を操る森の妖精。',
        }),
        new CreatureSchema(CreatureId.SYLPH, 50, WeaponId.VORTEX, ArmorId.AIR_FAMILLIAR, 16, {
            skills: new Set([Skill.FREE_MOVE]),
            traits: new Set([Trait.NERVELESS, Trait.FLYING]),
            message: '{name}は風の刃と化す！',
            description: '風の精霊。',
        }),
        new CreatureSchema(CreatureId.FALCON, 50, WeaponId.CLAW, ArmorId.NONE, 56, {
            skills: new Set([Skill.FREE_MOVE]),
            traits: new Set([Skill.FLYING]),
            message: '{name}が急降下する！',
            description: '大空から獲物を狙う素早い鷹。',
        }),
        new CreatureSchema(CreatureId.WYVERN, 500, WeaponId.POISON_BLOW, ArmorId.NONE, 40, {
            size: 2,
            skills: new Set([Skill.FREE_MOVE]),
            traits: new Set([Trait.LARGE, Trait.FLYING]),
            message: '{name}が強靭な鉤爪で斬り裂く！',
            description: '強力な鉤爪と毒を持つ飛竜。',
        }),
        new CreatureSchema(CreatureId.MINOTAUR, 800, WeaponId.HUGE_AXE, ArmorId.NONE, 32, {
            size: 2,
            traits: new Set([Trait.LARGE]),
            message: '{name}の巨大な斧が振り下ろされる！',
            description: '双頭斧を持った牛頭の怪物。',
        }),
        new CreatureSchema(CreatureId.STAR_VAMPIRE, 500, WeaponId.BLOOD_NAIL, ArmorId.IMAGINARY_AXIS, 40, {
            size: 2,
            skills: new Set([Skill.FREE_MOVE, Skill.ATTACK_2]),
            traits: new Set([Trait.NERVELESS, Trait.LARGE, Trait.FLYING]),
            message: '{name}が血を求める！',
            description: '血を求めさまよう姿無き星の精。',
        }),
        new CreatureSchema(CreatureId.SLUG, 800, WeaponId.ACID, ArmorId.NONE, 8, {
            message: '{name}が獲物を溶かす！',
            description: '巨大なかたつむり。',
        }),
        new CreatureSchema(CreatureId.GHOST, 50, WeaponId.CURSE, ArmorId.ASTRAL_BODY, 16, {
            traits: new Set([Trait.NERVELESS]),
            message: '{name}は苦痛の叫びをあげる！',
            description: 'さまよう死者の霊。',
        }),
        new CreatureSchema(CreatureId.JACK_O_LANTERN, 80, WeaponId.LITTLE_BREATHE, ArmorId.FIRE_FAMILLIAR, 16, {
            traits: new Set([Trait.NERVELESS]),
            message: '{name}の口から火炎が飛び出す！',
            description: 'カボチャの姿で森をさまよう炎の妖精。',
        }),
        new CreatureSchema(CreatureId.TRAP_VINE, 200, WeaponId.VINE, ArmorId.NONE, 40, {
            message: '{name}のツタがうなる！',
            description: '不用意に近づいた獲物を絡め取るツタ植物。',
        }),
        new CreatureSchema(CreatureId.DARK_YOUNG, 2000, WeaponId.THIRSTED, ArmorId.IMAGINARY_AXIS, 40, {
            size: 2,
            skills: new Set([Skill.ATTACK_3]),
            traits: new Set([Trait.NERVELESS, Trait.LARGE]),
            message: '{name}の巨大な口が生け贄を求める！',
            description: 'のたうつ黒い触肢と樹幹のような蹄、緑色の涎を垂らすいくつもの口を持った巨大な塊。',
        }),
        new CreatureSchema(CreatureId.OLD_ONE, 2000, WeaponId.LI_PHA, ArmorId.IMAGINARY_AXIS, 16, {
            size: 2,
            skills: new Set([Skill.ATTACK_2]),
            traits: new Set([Trait.NERVELESS, Trait.LARGE]),
            message: '{name}は不思議な音を発した！',
            description: 'かつては高い知性を持ち、星間をも飛行した古の種族。',
        }),
        new CreatureSchema(CreatureId.ASURA, 600, WeaponId.SWORD, ArmorId.PLATE_MAIL, 32, {
            size: 2,
            skills: new Set([Skill.ATTACK_6]),
            traits: new Set([Trait.LARGE]),
            message: '{name}の多腕が全てを破壊する！',
            description: '武神。',
        }),
        new CreatureSchema(CreatureId.FLYING_POLYP, 2000, WeaponId.NONE, ArmorId.IMAGINARY_AXIS, 16, {
            size: 2,
            traits: new Set([Trait.NERVELESS, Trait.LARGE, Trait.FLYING]),
            message: '{name}の周囲の空間が歪む！',
            description: '...keketaketakekerakeke',
        }),
        new CreatureSchema(CreatureId.MAN_O_WAR, 80, WeaponId.SHOCK, ArmorId.NONE, 16, {
            message: '{name}は雷を発した！',
            description: '電撃で身を守る大くらげ。',
        }),
        new CreatureSchema(CreatureId.WHITE_DRAGON, 2000, WeaponId.ICE_BREATHE, ArmorId.ICE_DRAGON_SCALE, 8, {
            size: 3,
            traits: new Set([Trait.LARGE]),
            message: '{name}のブレスが吹雪となり吹き荒れる！',
            description: '冷気を身に宿す白き竜。',
        }),
        new CreatureSchema(CreatureId.FREEZE_SOUR, 80, WeaponId.COLD_WIND, ArmorId.ICE_FAMILLIAR, 56, {
            skills: new Set([Skill.FREE_MOVE]),
            traits: new Set([Trait.NERVELESS, Trait.FLYING]),
            message: '{name}が凍てつく風を起こす！',
            description: '吹雪の中を飛翔する霊鳥。',
        }),
        new CreatureSchema(CreatureId.SNOW, 80, WeaponId.SNOW_BULLET, ArmorId.ICE_FAMILLIAR, 24, {
            message: '{name}が雪玉を投げつける！',
            description: '雪の妖精。',
        }),
        new CreatureSchema(CreatureId.SORCERER, 100, WeaponId.CRACK_BLAST, ArmorId.NONE, 8, {
            message: '{name}の魔力が大地を揺るがす！',
            description: '魔術師。大地を割り地上の敵に大ダメージ。',
        }),
        new CreatureSchema(CreatureId.SORCERESS, 100, WeaponId.WINDSTORM, ArmorId.NONE, 8, {
            message: '{name}の魔力が天空を引き裂く！',
            description: '魔術師。烈風を操り飛行している敵に大ダメージ。',
        }),
        new CreatureSchema(CreatureId.SEA_DRAKE, 1000, WeaponId.KILLER_FANG, ArmorId.HARD_SKIN, 32, {
            size: 2,
            message: '{name}が無造作に獲物を噛み砕く！',
            description: '強靭な牙を持った海竜。',
        }),
        new CreatureSchema(CreatureId.MERMAID, 100, WeaponId.FLUSH_WAVE, ArmorId.WATER_FAMILLIAR, 16, {
            message: '{name}は波を走らせる！',
            description: '近海に住まう水の妖精。',
        }),
        new CreatureSchema(CreatureId.CRAB, 180, WeaponId.SCISSORS, ArmorId.HARD_SHELL, 32, {
            message: '{name}の巨大なハサミが獲物を襲う！',
            description: '超硬質の外骨格で身を守る巨大なカニ。',
        }),
        new CreatureSchema(CreatureId.DEEP_PASTE, 100, WeaponId.ACID, ArmorId.VISCOUS_LIQUID, 8, {
            traits: new Set([Trait.NERVELESS]),
            message: '{name}が酸を分泌する！',
            description: '森の所々に付着している謎の粘性体。',
        }),
        new CreatureSchema(CreatureId.COCKATRICE, 250, WeaponId.STONE_CURSE, ArmorId.NONE, 32, {
            message: '{name}がくちばしでつつく！',
            description: '雄鶏と蛇の合成魔獣。くちばしの一撃は石化能力を持つ。',
        }),
        new CreatureSchema(CreatureId.SKELETON, 30, WeaponId.SWORD, ArmorId.BREAST_PLATE, 32, {
            skills: new Set([Skill.ATTACK_2]),
            traits: new Set([Trait.NERVELESS]),
            message: '{name}が剣を振るう！',
            description: '死後も戦い続ける狂戦士の骸骨。',
        }),
        new CreatureSchema(CreatureId.MANDRAKE, 30, WeaponId.DEADLY_CRY, ArmorId.NONE, 16, {
            message: '{name}が狂おしく絶叫する！',
            description: '人の姿に似た根を持つ薬草。引き抜こうとすると絶叫する。',
        }),
        new CreatureSchema(CreatureId.ROCKPILE, 100, WeaponId.CLAW, ArmorId.STONE_BODY, 32, {
            message: '{name}が不意をつき爪を走らせる！',
            description: '岩を集めて身を守る謎多き希少生物。',
        }),
        new CreatureSchema(CreatureId.ANGEL, 100, WeaponId.HOLY_LIGHT, ArmorId.NONE, 16, {
            skills: new Set([Skill.FREE_MOVE]),
            traits: new Set([Skill.FLYING]),
            message: '{name}は聖なる裁きを下す！',
            description: '神霊の御使い。',
        }),
        new CreatureSchema(CreatureId.IMP, 50, WeaponId.WET_NAIL, ArmorId.NONE, 40, {
            skills: new Set([Skill.FREE_MOVE]),
            traits: new Set([Trait.FLYING]),
            message: '{name}は不浄な爪で襲い掛かった！',
            description: '性悪な小妖精。',
        }),
        new CreatureSchema(CreatureId.SNOW_MAN, 400, WeaponId.NONE, ArmorId.ICE_FAMILLIAR, 0, {
            traits: new Set([Trait.NERVELESS]),
            message: '{name}は空を見つめている……',
            description: 'ゆきだるま。',
        }),
        new CreatureSchema(CreatureId.ALBINO_PENGUIN, 200, WeaponId.BODY_PRESS, ArmorId.ICE_FAMILLIAR, 32, {
            message: '{name}のフライングボディアタック！',
            description: '巨大で狂暴なペンギン。氷で閉ざされた山脈に住む。',
        }),
        new CreatureSchema(CreatureId.SWORD_MASTER, 180, WeaponId.SWORD, ArmorId.BREAST_PLATE, 32, {
            skills: new Set([Skill.ATTACK_2]),
            message: '{name}のすばやい攻撃！',
            description: '剣聖の素質を秘めた戦士。',
        }),
        new CreatureSchema(CreatureId.RUNE_KNIGHT, 160, WeaponId.FLARE_BLADE, ArmorId.BREAST_PLATE, 32, {
            message: '{name}の霊剣がうなる！',
            description: '霊剣から力を引き出す才能を見出された剣士。',
        })
    )
})(this)

!(root => {
    const { Battle, Cell, Creature, CreatureId, Element, FieldPower } = root.EchoRuler

    class Stage {
        /**
        * @type {Array<Stage>}
        */
        static values = []

        /**
        * @param {Object} args
        * @param {StageId} args.stageId
        * @param {string} args.name
        * @param {Array<Array<StageCreature>>} args.creatures
        * @param {FieldPower} args.power
        * @param {number} args.score
        * @param {Array<CreatureId>} args.prisoners
        * @param {Array<StageId>} args.routes
        * @returns {ThisType}
        */
        constructor({ stageId, name, creatures, power, score, prisoners, routes }) {
            this.stageId = stageId
            this.name = name
            this.creatures = creatures
            this.power = power
            this.score = score
            this.prisoners = prisoners
            this.routes = routes
        }

        /**
        * @param {StageId} stageId
        * @returns {ThisType}
        */
        static get(stageId) {
            const stage = this.values.find(x => x.stageId == stageId)
            if (stage) {
                return stage
            }
            throw new Error(`ステージが見つかりません: ${stageId}`)
        }

        /**
        * 戦闘を生成する
        * @param {number} round
        * @param {Object} options
        * @param {number} options.round
        * @param {FieldPower?} options.power
        * @returns {Battle}
        */
        battle(round, { power } = {}) {
            const creatures = this.creatures[round]
            if (!creatures) {
                throw new Error(`戦闘データが見つかりません: ${round + 1}回戦目`)
            }
            const battle = new Battle((power ?? this.power).clone())
            for (const { cell, creatureId } of creatures) {
                battle.field.set(cell, Creature.create(creatureId))
            }
            return battle
        }

        /**
        * @returns {string}
        */
        toString() {
            return `<${this.constructor.name}: { `
                + `stageId: ${this.stageId}, `
                + `name: ${this.name}, `
                + `creatures: ${this.creatures}, `
                + `power: ${this.power}, `
                + `score: ${this.score}, `
                + `prisoners: ${this.prisoners}, `
                + `routes: ${this.routes} `
                + `}>`
        }
    }

    class StageCreature {
        /**
        * @param {Object} args
        * @param {Cell} args.cell
        * @param {CreatureId} args.creatureId
        * @returns {ThisType}
        */
        constructor({ cell, creatureId }) {
            this.cell = cell
            this.creatureId = creatureId
        }

        /**
        * @returns {string}
        */
        toSring() {
            return `<${this.constructor.name}: { `
                + `cell: ${this.cell}, `
                + `creatureId: ${this.creatureId} `
                + `}>`
        }
    }

    class StageId {
        static DEEP_FOREST = new StageId('A')
        static ROCKY_MOUNTAIN = new StageId('B')
        static DARK_LABYRINTH = new StageId('C')
        static HOWLING_GULF = new StageId('D')
        static MIST_RELICS = new StageId('E')
        static DRUDGE_WOODS = new StageId('F')
        static CARNAGE_FIELD = new StageId('G')
        static HEAVENS_GATE = new StageId('H')
        static CURSED_TOWER = new StageId('I')
        static GLACIAL_SANCTUARY = new StageId('J')
        static VOLCANIC_CAVE = new StageId('K')
        static TEMPEST_CASTLE = new StageId('L')
        static BLIZZARD_WASTES = new StageId('M')

        static values = [
            StageId.DEEP_FOREST,
            StageId.ROCKY_MOUNTAIN,
            StageId.DARK_LABYRINTH,
            StageId.HOWLING_GULF,
            StageId.MIST_RELICS,
            StageId.DRUDGE_WOODS,
            StageId.CARNAGE_FIELD,
            StageId.HEAVENS_GATE,
            StageId.CURSED_TOWER,
            StageId.GLACIAL_SANCTUARY,
            StageId.VOLCANIC_CAVE,
            StageId.TEMPEST_CASTLE,
            StageId.BLIZZARD_WASTES
        ]

        constructor(value) {
            this.value = value
        }

        /**
        * @returns {string}
        */
        toString() {
            return this.value
        }
    }

    Stage.values.push(
        new Stage({
            stageId: StageId.DEEP_FOREST,
            name: '森の守護者',
            creatures: [
                [
                    { cell: new Cell(1, 1), creatureId: CreatureId.ELF },
                    { cell: new Cell(2, 0), creatureId: CreatureId.MANTIS },
                    { cell: new Cell(2, 2), creatureId: CreatureId.MANTIS },
                ],
                [
                    { cell: new Cell(1, 0), creatureId: CreatureId.ELF },
                    { cell: new Cell(1, 2), creatureId: CreatureId.ELF },
                    { cell: new Cell(2, 1), creatureId: CreatureId.DEEP_PASTE },
                ],
                [
                    { cell: new Cell(0, 1), creatureId: CreatureId.UNDINE },
                    { cell: new Cell(1, 0), creatureId: CreatureId.UNDINE },
                    { cell: new Cell(1, 2), creatureId: CreatureId.UNDINE },
                    { cell: new Cell(2, 1), creatureId: CreatureId.ELF },
                ],
                [
                    { cell: new Cell(0, 2), creatureId: CreatureId.UNDINE },
                    { cell: new Cell(2, 1), creatureId: CreatureId.GRAY_BEAR },
                ],
            ],
            power: new FieldPower(Element.WATER, { value: 0 }),
            score: 2000,
            prisoners: [CreatureId.MANTIS, CreatureId.ELF, CreatureId.UNDINE],
            routes: [StageId.ROCKY_MOUNTAIN, StageId.DARK_LABYRINTH]
        }),
        new Stage({
            stageId: StageId.ROCKY_MOUNTAIN,
            name: '岩山の飛竜',
            creatures: [
                [
                    { cell: new Cell(0, 2), creatureId: CreatureId.SYLPH },
                    { cell: new Cell(1, 0), creatureId: CreatureId.SYLPH },
                    { cell: new Cell(2, 1), creatureId: CreatureId.ROCKPILE },
                ],
                [
                    { cell: new Cell(0, 2), creatureId: CreatureId.FALCON },
                    { cell: new Cell(1, 1), creatureId: CreatureId.FALCON },
                    { cell: new Cell(2, 0), creatureId: CreatureId.FALCON },
                ],
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.SYLPH },
                    { cell: new Cell(1, 2), creatureId: CreatureId.WOLF },
                    { cell: new Cell(2, 1), creatureId: CreatureId.ROCKPILE },
                ],
                [
                    { cell: new Cell(1, 1), creatureId: CreatureId.WYVERN },
                    { cell: new Cell(2, 0), creatureId: CreatureId.WOLF },
                    { cell: new Cell(2, 2), creatureId: CreatureId.WOLF },
                ],
            ],
            power: new FieldPower(Element.AIR, { value: 0 }),
            score: 2500,
            prisoners: [CreatureId.WOLF, CreatureId.SYLPH, CreatureId.FALCON],
            routes: [StageId.HOWLING_GULF, StageId.MIST_RELICS]
        }),
        new Stage({
            stageId: StageId.DARK_LABYRINTH,
            name: '迷宮の落胤',
            creatures: [
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.SPIDER },
                    { cell: new Cell(1, 2), creatureId: CreatureId.SPIDER },
                    { cell: new Cell(2, 1), creatureId: CreatureId.SLIME },
                ],
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.SPIDER },
                    { cell: new Cell(1, 1), creatureId: CreatureId.SPIDER },
                    { cell: new Cell(1, 2), creatureId: CreatureId.BEETLE },
                    { cell: new Cell(2, 0), creatureId: CreatureId.BEETLE },
                    { cell: new Cell(2, 2), creatureId: CreatureId.BEETLE },
                ],
                [
                    { cell: new Cell(0, 1), creatureId: CreatureId.SPIDER },
                    { cell: new Cell(1, 0), creatureId: CreatureId.BEETLE },
                    { cell: new Cell(1, 2), creatureId: CreatureId.SCORPION },
                    { cell: new Cell(2, 1), creatureId: CreatureId.SCORPION },
                    { cell: new Cell(2, 2), creatureId: CreatureId.SCORPION },
                ],
                [
                    { cell: new Cell(1, 1), creatureId: CreatureId.MINOTAUR },
                    { cell: new Cell(2, 0), creatureId: CreatureId.BEETLE },
                    { cell: new Cell(2, 2), creatureId: CreatureId.BEETLE },
                ],
            ],
            power: new FieldPower(Element.EARTH, { value: 0 }),
            score: 2700,
            prisoners: [CreatureId.SPIDER, CreatureId.SCORPION, CreatureId.BEETLE],
            routes: [StageId.MIST_RELICS, StageId.DRUDGE_WOODS]
        }),
        new Stage({
            stageId: StageId.HOWLING_GULF,
            name: '岩礁の流影',
            creatures: [
                [
                    { cell: new Cell(1, 0), creatureId: CreatureId.MAN_O_WAR },
                    { cell: new Cell(2, 2), creatureId: CreatureId.MAN_O_WAR },
                ],
                [
                    { cell: new Cell(1, 1), creatureId: CreatureId.MAN_O_WAR },
                    { cell: new Cell(2, 0), creatureId: CreatureId.CRAB },
                    { cell: new Cell(2, 2), creatureId: CreatureId.CRAB },
                ],
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.MERMAID },
                    { cell: new Cell(0, 2), creatureId: CreatureId.MAN_O_WAR },
                    { cell: new Cell(1, 1), creatureId: CreatureId.MAN_O_WAR },
                    { cell: new Cell(2, 0), creatureId: CreatureId.MAN_O_WAR },
                    { cell: new Cell(2, 2), creatureId: CreatureId.CRAB },
                ],
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.MERMAID },
                    { cell: new Cell(0, 2), creatureId: CreatureId.MERMAID },
                    { cell: new Cell(2, 1), creatureId: CreatureId.SEA_DRAKE },
                ],
            ],
            power: new FieldPower(Element.WATER, { value: 10 }),
            score: 3000,
            prisoners: [CreatureId.CRAB, CreatureId.MERMAID, CreatureId.MAN_O_WAR],
            routes: [StageId.CARNAGE_FIELD, StageId.HEAVENS_GATE]
        }),
        new Stage({
            stageId: StageId.MIST_RELICS,
            name: '遺跡の巨像',
            creatures: [
                [
                    { cell: new Cell(0, 1), creatureId: CreatureId.IMP },
                    { cell: new Cell(1, 2), creatureId: CreatureId.IMP },
                    { cell: new Cell(2, 0), creatureId: CreatureId.SLUG },
                ],
                [
                    { cell: new Cell(0, 2), creatureId: CreatureId.JACK_O_LANTERN },
                    { cell: new Cell(1, 0), creatureId: CreatureId.JACK_O_LANTERN },
                    { cell: new Cell(2, 1), creatureId: CreatureId.SLUG },
                ],
                [
                    { cell: new Cell(0, 2), creatureId: CreatureId.GHOST },
                    { cell: new Cell(2, 0), creatureId: CreatureId.GHOST },
                ],
                [
                    { cell: new Cell(0, 2), creatureId: CreatureId.SORCERER },
                    { cell: new Cell(2, 1), creatureId: CreatureId.GOLEM },
                ],
            ],
            power: new FieldPower(Element.MIND, { value: 0 }),
            score: 3200,
            prisoners: [CreatureId.SLUG, CreatureId.SORCERER, CreatureId.JACK_O_LANTERN],
            routes: [StageId.HEAVENS_GATE, StageId.CURSED_TOWER]
        }),
        new Stage({
            stageId: StageId.DRUDGE_WOODS,
            name: '歪んだ大樹',
            creatures: [
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.MANDRAKE },
                    { cell: new Cell(1, 1), creatureId: CreatureId.TRAP_VINE },
                    { cell: new Cell(1, 2), creatureId: CreatureId.MANDRAKE },
                    { cell: new Cell(2, 2), creatureId: CreatureId.TRAP_VINE },
                ],
                [
                    { cell: new Cell(0, 1), creatureId: CreatureId.DRAGON_FLY },
                    { cell: new Cell(1, 0), creatureId: CreatureId.DRAGON_FLY },
                    { cell: new Cell(1, 1), creatureId: CreatureId.DEEP_PASTE },
                    { cell: new Cell(1, 2), creatureId: CreatureId.TRAP_VINE },
                    { cell: new Cell(2, 0), creatureId: CreatureId.TRAP_VINE },
                ],
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.MOTH },
                    { cell: new Cell(0, 2), creatureId: CreatureId.DRAGON_FLY },
                    { cell: new Cell(1, 1), creatureId: CreatureId.MOTH },
                    { cell: new Cell(1, 2), creatureId: CreatureId.DEEP_PASTE },
                    { cell: new Cell(2, 0), creatureId: CreatureId.TRAP_VINE },
                    { cell: new Cell(2, 1), creatureId: CreatureId.MANTIS },
                    { cell: new Cell(2, 2), creatureId: CreatureId.MANTIS },
                ],
                [
                    { cell: new Cell(1, 1), creatureId: CreatureId.DARK_YOUNG },
                    { cell: new Cell(2, 1), creatureId: CreatureId.DEEP_PASTE },
                    { cell: new Cell(2, 2), creatureId: CreatureId.DEEP_PASTE },
                ],
            ],
            power: new FieldPower(Element.EARTH, { value: 0 }),
            score: 3500,
            prisoners: [CreatureId.MANDRAKE, CreatureId.MOTH, CreatureId.DRAGON_FLY],
            routes: [StageId.CURSED_TOWER, StageId.GLACIAL_SANCTUARY]
        }),
        new Stage({
            stageId: StageId.CARNAGE_FIELD,
            name: '多腕の闘鬼',
            creatures: [
                [
                    { cell: new Cell(2, 1), creatureId: CreatureId.KNIGHT },
                ],
                [
                    { cell: new Cell(0, 1), creatureId: CreatureId.SWORD_MASTER },
                    { cell: new Cell(1, 0), creatureId: CreatureId.SWORD_MASTER },
                    { cell: new Cell(1, 2), creatureId: CreatureId.SWORD_MASTER },
                    { cell: new Cell(2, 1), creatureId: CreatureId.SWORD_MASTER },
                ],
                [
                    { cell: new Cell(0, 1), creatureId: CreatureId.SKELETON },
                    { cell: new Cell(1, 0), creatureId: CreatureId.SKELETON },
                    { cell: new Cell(1, 2), creatureId: CreatureId.SKELETON },
                    { cell: new Cell(2, 1), creatureId: CreatureId.SKELETON },
                ],
                [
                    { cell: new Cell(2, 1), creatureId: CreatureId.ASURA },
                ],
            ],
            power: new FieldPower(Element.MIND, { value: 10 }),
            score: 4000,
            prisoners: [CreatureId.KNIGHT, CreatureId.SWORD_MASTER, CreatureId.SKELETON],
            routes: [StageId.VOLCANIC_CAVE, StageId.TEMPEST_CASTLE, StageId.BLIZZARD_WASTES]
        }),
        new Stage({
            stageId: StageId.HEAVENS_GATE,
            name: '天空の戦士',
            creatures: [
                [
                    { cell: new Cell(0, 1), creatureId: CreatureId.ANGEL },
                    { cell: new Cell(1, 0), creatureId: CreatureId.LANCER },
                    { cell: new Cell(2, 2), creatureId: CreatureId.LANCER },
                ],
                [
                    { cell: new Cell(0, 1), creatureId: CreatureId.ARCHER },
                    { cell: new Cell(1, 0), creatureId: CreatureId.ARCHER },
                    { cell: new Cell(1, 2), creatureId: CreatureId.ANGEL },
                    { cell: new Cell(2, 1), creatureId: CreatureId.ANGEL },
                ],
                [
                    { cell: new Cell(0, 2), creatureId: CreatureId.SYLPH },
                    { cell: new Cell(1, 1), creatureId: CreatureId.SYLPH },
                    { cell: new Cell(2, 0), creatureId: CreatureId.VALKYRIE },
                ],
                [
                    { cell: new Cell(1, 0), creatureId: CreatureId.VALKYRIE },
                    { cell: new Cell(1, 1), creatureId: CreatureId.RUNE_KNIGHT },
                    { cell: new Cell(1, 2), creatureId: CreatureId.VALKYRIE },
                    { cell: new Cell(2, 1), creatureId: CreatureId.VALKYRIE },
                ],
            ],
            power: new FieldPower(Element.AIR, { value: 10 }),
            score: 4000,
            prisoners: [CreatureId.RUNE_KNIGHT, CreatureId.VALKYRIE, CreatureId.ANGEL],
            routes: [StageId.VOLCANIC_CAVE, StageId.TEMPEST_CASTLE, StageId.BLIZZARD_WASTES]
        }),
        new Stage({
            stageId: StageId.CURSED_TOWER,
            name: '魔道生命体',
            creatures: [
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.MANDRAKE },
                    { cell: new Cell(0, 1), creatureId: CreatureId.MANDRAKE },
                    { cell: new Cell(1, 2), creatureId: CreatureId.SLIME },
                    { cell: new Cell(2, 1), creatureId: CreatureId.SLIME },
                ],
                [
                    { cell: new Cell(0, 2), creatureId: CreatureId.MANDRAKE },
                    { cell: new Cell(1, 0), creatureId: CreatureId.MANDRAKE },
                    { cell: new Cell(2, 1), creatureId: CreatureId.COCKATRICE },
                ],
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.WIZARD },
                    { cell: new Cell(0, 1), creatureId: CreatureId.WIZARD },
                    { cell: new Cell(0, 2), creatureId: CreatureId.WIZARD },
                    { cell: new Cell(1, 0), creatureId: CreatureId.SALAMANDER },
                    { cell: new Cell(1, 1), creatureId: CreatureId.SALAMANDER },
                    { cell: new Cell(1, 2), creatureId: CreatureId.SALAMANDER },
                    { cell: new Cell(2, 1), creatureId: CreatureId.SLIME },
                ],
                [
                    { cell: new Cell(0, 2), creatureId: CreatureId.SORCERESS },
                    { cell: new Cell(2, 1), creatureId: CreatureId.CHIMERA },
                ],
            ],
            power: new FieldPower(Element.MIND, { value: 0 }),
            score: 4400,
            prisoners: [CreatureId.SORCERESS, CreatureId.MANDRAKE, CreatureId.SLIME],
            routes: [StageId.VOLCANIC_CAVE, StageId.TEMPEST_CASTLE, StageId.BLIZZARD_WASTES]
        }),
        new Stage({
            stageId: StageId.GLACIAL_SANCTUARY,
            name: '古の支配者',
            creatures: [
                [
                    { cell: new Cell(2, 1), creatureId: CreatureId.ALBINO_PENGUIN },
                ],
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.ALBINO_PENGUIN },
                    { cell: new Cell(0, 1), creatureId: CreatureId.ALBINO_PENGUIN },
                    { cell: new Cell(0, 2), creatureId: CreatureId.ALBINO_PENGUIN },
                    { cell: new Cell(1, 0), creatureId: CreatureId.ALBINO_PENGUIN },
                    { cell: new Cell(1, 1), creatureId: CreatureId.ALBINO_PENGUIN },
                    { cell: new Cell(1, 2), creatureId: CreatureId.ALBINO_PENGUIN },
                    { cell: new Cell(2, 0), creatureId: CreatureId.ALBINO_PENGUIN },
                    { cell: new Cell(2, 1), creatureId: CreatureId.ALBINO_PENGUIN },
                    { cell: new Cell(2, 2), creatureId: CreatureId.ALBINO_PENGUIN },
                ],
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.FREEZE_SOUR },
                    { cell: new Cell(0, 2), creatureId: CreatureId.SNOW },
                    { cell: new Cell(1, 1), creatureId: CreatureId.SNOW },
                    { cell: new Cell(1, 2), creatureId: CreatureId.SNOW_MAN },
                    { cell: new Cell(2, 1), creatureId: CreatureId.SNOW_MAN },
                ],
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.SNOW },
                    { cell: new Cell(2, 1), creatureId: CreatureId.OLD_ONE },
                ],
            ],
            power: new FieldPower(Element.EARTH, { value: 20 }),
            score: 4800,
            prisoners: [CreatureId.ALBINO_PENGUIN, CreatureId.SNOW, CreatureId.SNOW_MAN],
            routes: [StageId.VOLCANIC_CAVE, StageId.TEMPEST_CASTLE, StageId.BLIZZARD_WASTES]
        }),
        new Stage({
            stageId: StageId.VOLCANIC_CAVE,
            name: '灼熱の火炎',
            creatures: [
                [
                    { cell: new Cell(1, 1), creatureId: CreatureId.PHOENIX },
                    { cell: new Cell(2, 2), creatureId: CreatureId.SALAMANDER },
                ],
                [
                    { cell: new Cell(0, 1), creatureId: CreatureId.SALAMANDER },
                    { cell: new Cell(1, 0), creatureId: CreatureId.LAVA_LIZARD },
                    { cell: new Cell(1, 2), creatureId: CreatureId.SALAMANDER },
                    { cell: new Cell(2, 0), creatureId: CreatureId.SALAMANDER },
                    { cell: new Cell(2, 2), creatureId: CreatureId.LAVA_LIZARD },
                ],
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.SALAMANDER },
                    { cell: new Cell(2, 1), creatureId: CreatureId.CERBERUS },
                ],
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.SALAMANDER },
                    { cell: new Cell(0, 2), creatureId: CreatureId.SALAMANDER },
                    { cell: new Cell(2, 1), creatureId: CreatureId.RED_DRAGON },
                ],
            ],
            power: new FieldPower(Element.FIRE, { value: 20 }),
            score: 5000,
            prisoners: [],
            routes: []
        }),
        new Stage({
            stageId: StageId.TEMPEST_CASTLE,
            name: '天空の稲妻',
            creatures: [
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.SYLPH },
                    { cell: new Cell(0, 2), creatureId: CreatureId.SYLPH },
                    { cell: new Cell(2, 1), creatureId: CreatureId.WYVERN },
                ],
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.MOTH },
                    { cell: new Cell(0, 2), creatureId: CreatureId.MOTH },
                    { cell: new Cell(1, 1), creatureId: CreatureId.MOTH },
                    { cell: new Cell(2, 0), creatureId: CreatureId.IMP },
                    { cell: new Cell(2, 2), creatureId: CreatureId.IMP },
                ],
                [
                    { cell: new Cell(0, 2), creatureId: CreatureId.FALCON },
                    { cell: new Cell(1, 1), creatureId: CreatureId.FALCON },
                    { cell: new Cell(1, 2), creatureId: CreatureId.FALCON },
                    { cell: new Cell(2, 0), creatureId: CreatureId.FALCON },
                    { cell: new Cell(2, 1), creatureId: CreatureId.FALCON },
                ],
                [
                    { cell: new Cell(1, 1), creatureId: CreatureId.BLUE_DRAGON },
                    { cell: new Cell(2, 0), creatureId: CreatureId.VALKYRIE },
                    { cell: new Cell(2, 2), creatureId: CreatureId.VALKYRIE },
                ],
            ],
            power: new FieldPower(Element.AIR, { value: 40 }),
            score: 6000,
            prisoners: [],
            routes: []
        }),
        new Stage({
            stageId: StageId.BLIZZARD_WASTES,
            name: '白銀の吹雪',
            creatures: [
                [
                    { cell: new Cell(0, 1), creatureId: CreatureId.MERMAID },
                    { cell: new Cell(1, 0), creatureId: CreatureId.CRAB },
                    { cell: new Cell(1, 1), creatureId: CreatureId.ALBINO_PENGUIN },
                    { cell: new Cell(1, 2), creatureId: CreatureId.MERMAID },
                    { cell: new Cell(2, 0), creatureId: CreatureId.ALBINO_PENGUIN },
                    { cell: new Cell(2, 2), creatureId: CreatureId.CRAB },
                ],
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.FREEZE_SOUR },
                    { cell: new Cell(0, 1), creatureId: CreatureId.FREEZE_SOUR },
                    { cell: new Cell(1, 1), creatureId: CreatureId.FREEZE_SOUR },
                    { cell: new Cell(1, 2), creatureId: CreatureId.FREEZE_SOUR },
                    { cell: new Cell(2, 2), creatureId: CreatureId.FREEZE_SOUR },
                ],
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.SNOW },
                    { cell: new Cell(0, 2), creatureId: CreatureId.SNOW },
                    { cell: new Cell(2, 1), creatureId: CreatureId.SEA_DRAKE },
                ],
                [
                    { cell: new Cell(0, 0), creatureId: CreatureId.ALBINO_PENGUIN },
                    { cell: new Cell(2, 1), creatureId: CreatureId.WHITE_DRAGON },
                ],
            ],
            power: new FieldPower(Element.EARTH, { value: 80 }),
            score: 7000,
            prisoners: [],
            routes: []
        }),
    )

    Object.assign(root.EchoRuler, {
        Stage,
        StageCreature,
        StageId,
    })
})(this)

!(root => {
    const { Creature, CreatureId } = root.EchoRuler

    class Party {
        /**
        * @param {Array<Creature>} creatures
        */
        constructor(creatures = []) {
            this.creatures = creatures
        }

        /**
        * 標準の開始構成でパーティを生成する。
        * @returns {Party}
        */
        static standard() {
            return new Party([
                Creature.create(CreatureId.KNIGHT, { entityId: 0 }),
                Creature.create(CreatureId.KNIGHT, { entityId: 1 }),
                Creature.create(CreatureId.LANCER, { entityId: 2 }),
                Creature.create(CreatureId.LANCER, { entityId: 3 }),
                Creature.create(CreatureId.NINJA, { entityId: 4 }),
                Creature.create(CreatureId.NINJA, { entityId: 5 }),
                Creature.create(CreatureId.ARCHER, { entityId: 6 }),
                Creature.create(CreatureId.ARCHER, { entityId: 7 }),
                Creature.create(CreatureId.WIZARD, { entityId: 8 }),
                Creature.create(CreatureId.WIZARD, { entityId: 9 }),
            ])
        }

        /**
        * 考え無しの忍者構成でパーティを生成する。
        * @returns {Party}
        */
        static ninjas() {
            return new Party([
                Creature.create(CreatureId.NINJA, { entityId: 0 }),
                Creature.create(CreatureId.NINJA, { entityId: 1 }),
                Creature.create(CreatureId.NINJA, { entityId: 2 }),
                Creature.create(CreatureId.NINJA, { entityId: 3 }),
                Creature.create(CreatureId.NINJA, { entityId: 4 }),
                Creature.create(CreatureId.NINJA, { entityId: 5 }),
                Creature.create(CreatureId.NINJA, { entityId: 6 }),
                Creature.create(CreatureId.NINJA, { entityId: 7 }),
                Creature.create(CreatureId.NINJA, { entityId: 8 }),
                Creature.create(CreatureId.NINJA, { entityId: 9 }),
            ])
        }

        /**
        * パーティが生き残っているか返す。
        * @returns {boolean}
        */
        get isAlive() {
            return this.creatures.some(x => x.isAlive)
        }

        /**
        * パーティが全滅しているか返す。
        * @returns {boolean}
        */
        get isDead() {
            return this.creatures.every(x => x.isDead)
        }

        /**
        * クローンを返す。
        * @param {Object} options
        * @param {boolean} options.exact
        * @returns {Party}
        */
        clone({ exact = false } = {}) {
            return new Party(this.creatures.map(x => x.clone({ exact })))
        }

        /**
        * パーティを全滅させる。
        */
        eliminate() {
            for (let i = 0; i < this.creatures.length; i++) {
                this.creatures[i].hp = 0
            }
        }

        /**
        * 指定したエンティティIDのクリーチャーを返す。
        * @returns {Creature?}
        */
        get(entityId) {
            return this.creatures.find(x => x.entityId == entityId)
        }

        /**
        * パーティ内の全クリーチャーを治療する。
        */
        heal() {
            for (const creature of this.creatures) {
                creature.heal()
            }
        }

        /**
        * 治療に必要なgpを返す。
        * @returns {number}
        */
        healCost() {
            return this.creatures.map(x => x.healCost()).sum()
        }

        /**
        * 一時的効果を回復する。
        */
        removeEffects() {
            for (const creature of this.creatures) {
                creature.effects.clear()
            }
        }

        /**
        * 指定したエンティティIDの別のクリーチャーに交換する。
        * @param {number} entityId
        * @param {CreatureId} creatureId
        */
        replace(entityId, creatureId) {
            const index = this.creatures.findIndex(x => x.entityId == entityId)
            if (index >= 0) {
                this.creatures[index] = Creature.create(creatureId, { entityId })
            }
        }

        /**
        * @returns {string}
        */
        toString() {
            return `<${this.constructor.name}: ${this.creatures}>`
        }
    }

    Object.assign(root.EchoRuler, { Party })
})(this)
