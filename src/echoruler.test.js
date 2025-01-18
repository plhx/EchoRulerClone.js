/**
* @file echoruler.test.js
* @copyright 2025 PlasticHeart
*/

!(root => {
    const {
        Battle,
        Cell,
        Creature,
        CreatureId,
        Element,
        Faction,
        FieldPower,
        Stage,
        StageId
    } = root.EchoRuler

    if (true) {
        if (true) {
            // 武器を持たないクリーチャーが正しく処理されるかのテスト
            const snowMan = Creature.create(CreatureId.SNOW_MAN)
            const knight = Creature.create(CreatureId.KNIGHT)
            const battle = new Battle(new FieldPower(Element.WATER))
            battle.field.set(Cell.with(Faction.RED, 2, 1), snowMan)
            battle.field.set(Cell.with(Faction.BLUE, 0, 1), knight)
            battle.next()
            battle.next()
            battle.next()
            battle.next()
            console.assert(snowMan.hp == 400 - 80)
            console.assert(knight.hp == 200)
        }
        if (true) {
            // 近接攻撃が正しく実行されるかのテスト
            // Mantisは攻撃ができない
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          | Undine   | |          | Mantis   |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | | Knight   |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            const undine = Creature.create(CreatureId.UNDINE)
            const mantis = Creature.create(CreatureId.MANTIS)
            const knight = Creature.create(CreatureId.KNIGHT)
            const battle = new Battle(new FieldPower(Element.WATER))
            battle.field.set(Cell.with(Faction.RED, 2, 0), undine)
            battle.field.set(Cell.with(Faction.BLUE, 1, 0), mantis)
            battle.field.set(Cell.with(Faction.BLUE, 0, 1), knight)
            battle.next()
            battle.next()
            battle.next()
            console.assert(undine.isAlive)
        }
        if (true) {
            // 近接攻撃が正しく実行されるかのテスト
            // BLUE陣営の攻撃は正面・下・上の順番に優先する
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          | Mantis   | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | | Ninja    |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          | Undine   | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            const mantis = Creature.create(CreatureId.MANTIS)
            const undine = Creature.create(CreatureId.UNDINE)
            const ninja = Creature.create(CreatureId.NINJA)
            const battle = new Battle(new FieldPower(Element.WATER))
            battle.field.set(Cell.with(Faction.RED, 2, 0), mantis)
            battle.field.set(Cell.with(Faction.RED, 2, 2), undine)
            battle.field.set(Cell.with(Faction.BLUE, 0, 1), ninja)
            battle.next()
            battle.next()
            battle.next()
            console.assert(undine.isDead)
        }
        if (true) {
            // 近接攻撃が正しく実行されるかのテスト
            // 攻撃の優先順位はRockpile(2), Sylph(3)であり、LancerはRockpileを攻撃する
            // +----------+----------+----------+ +----------+----------+----------+
            // |          | Sylph    |          | | Lancer   |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          | Rockpile | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            const lancer = Creature.create(CreatureId.LANCER)
            const rockpile = Creature.create(CreatureId.ROCKPILE)
            const sylph = Creature.create(CreatureId.SYLPH)
            const battle = new Battle(new FieldPower(Element.WATER))
            battle.field.set(Cell.with(Faction.RED, 1, 0), sylph)
            battle.field.set(Cell.with(Faction.RED, 2, 1), rockpile)
            battle.field.set(Cell.with(Faction.BLUE, 0, 0), lancer)
            battle.next()
            battle.next()
            battle.next()
            console.assert(sylph.hp == 50)
            console.assert(rockpile.hp == 75)
        }
        if (true) {
            // 近接攻撃が正しく実行されるかのテスト
            // 攻撃の優先順位はUndine(3), Sylph(3)であり、下が優先されるのでKnightはUndineを攻撃する
            // +----------+----------+----------+ +----------+----------+----------+
            // |          | Sylph    |          | | Knight   |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          | Undine   | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            const sylph = Creature.create(CreatureId.SYLPH)
            const undine = Creature.create(CreatureId.UNDINE)
            const knight = Creature.create(CreatureId.KNIGHT)
            const battle = new Battle(new FieldPower(Element.WATER))
            battle.field.set(Cell.with(Faction.RED, 1, 0), sylph)
            battle.field.set(Cell.with(Faction.RED, 2, 2), undine)
            battle.field.set(Cell.with(Faction.BLUE, 0, 0), knight)
            battle.next()
            battle.next()
            battle.next()
            console.assert(undine.isDead)
        }
        if (true) {
            // 近接攻撃が正しく実行されるかのテスト
            // 攻撃の優先順位はRockpile(3), Sylph(3)であり、Hpが低い方が優先されるのでKnightはSylphを攻撃する
            // +----------+----------+----------+ +----------+----------+----------+
            // |          | Sylph    |          | | Knight   |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          | Rockpile | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            const sylph = Creature.create(CreatureId.SYLPH)
            const rockpile = Creature.create(CreatureId.ROCKPILE)
            const knight = Creature.create(CreatureId.KNIGHT)
            const battle = new Battle(new FieldPower(Element.WATER))
            battle.field.set(Cell.with(Faction.RED, 1, 0), sylph)
            battle.field.set(Cell.with(Faction.RED, 2, 2), rockpile)
            battle.field.set(Cell.with(Faction.BLUE, 0, 0), knight)
            battle.next()
            battle.next()
            battle.next()
            console.assert(sylph.isDead)
        }
        if (true) {
            // 近接攻撃が正しく実行されるかのテスト
            // 攻撃の優先順位はRockpile(2), Sylph(3)だが、NinjaはFREE_MOVEを持つのでSylphを攻撃する
            // +----------+----------+----------+ +----------+----------+----------+
            // |          | Sylph    |          | | Ninja    |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          | Rockpile | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            const sylph = Creature.create(CreatureId.SYLPH)
            const rockpile = Creature.create(CreatureId.ROCKPILE)
            const ninja = Creature.create(CreatureId.NINJA)
            const battle = new Battle(new FieldPower(Element.WATER))
            battle.field.set(Cell.with(Faction.RED, 1, 0), sylph)
            battle.field.set(Cell.with(Faction.RED, 2, 2), rockpile)
            battle.field.set(Cell.with(Faction.BLUE, 0, 0), ninja)
            battle.next()
            battle.next()
            battle.next()
            console.assert(sylph.isDead)
        }
        if (true) {
            // 近接攻撃が正しく実行されるかのテスト
            // RED陣営の攻撃は正面・上・下の順番に優先する
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | | Sylph    |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          | Ninja    | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | | Undine   |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            const ninja = Creature.create(CreatureId.NINJA)
            const sylph = Creature.create(CreatureId.SYLPH)
            const undine = Creature.create(CreatureId.UNDINE)
            const battle = new Battle(new FieldPower(Element.WATER))
            battle.field.set(Cell.with(Faction.RED, 2, 1), ninja)
            battle.field.set(Cell.with(Faction.BLUE, 0, 0), sylph)
            battle.field.set(Cell.with(Faction.BLUE, 0, 2), undine)
            battle.next()
            battle.next()
            battle.next()
            console.assert(sylph.isDead)
        }
        if (true) {
            // 遠距離攻撃が正しく実行されるかのテスト
            // ArcherはUndineに攻撃が届かない
            // +----------+----------+----------+ +----------+----------+----------+
            // | Undine   |          |          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          | Slime    | | Slime    |          | Archer   |
            // +----------+----------+----------+ +----------+----------+----------+
            const slime0 = Creature.create(CreatureId.SLIME)
            const slime1 = Creature.create(CreatureId.SLIME)
            const undine = Creature.create(CreatureId.UNDINE)
            const archer = Creature.create(CreatureId.ARCHER)
            const battle = new Battle(new FieldPower(Element.WATER))
            battle.field.set(Cell.with(Faction.RED, 0, 0), undine)
            battle.field.set(Cell.with(Faction.RED, 2, 2), slime0)
            battle.field.set(Cell.with(Faction.BLUE, 0, 2), slime1)
            battle.field.set(Cell.with(Faction.BLUE, 2, 2), archer)
            battle.next()
            battle.next()
            battle.next()
            console.assert(slime0.hp == 114)
        }
        if (true) {
            // 遠距離攻撃が正しく実行されるかのテスト
            // ArcherはUndineに攻撃が届かない
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // | Undine   |          |          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          | Slime    | | Slime    |          | Archer   |
            // +----------+----------+----------+ +----------+----------+----------+
            const slime0 = Creature.create(CreatureId.SLIME)
            const slime1 = Creature.create(CreatureId.SLIME)
            const undine = Creature.create(CreatureId.UNDINE)
            const archer = Creature.create(CreatureId.ARCHER)
            const battle = new Battle(new FieldPower(Element.WATER))
            battle.field.set(Cell.with(Faction.RED, 0, 1), undine)
            battle.field.set(Cell.with(Faction.RED, 2, 2), slime0)
            battle.field.set(Cell.with(Faction.BLUE, 0, 2), slime1)
            battle.field.set(Cell.with(Faction.BLUE, 2, 2), archer)
            battle.next()
            battle.next()
            battle.next()
            console.assert(slime0.hp == 114)
        }
        if (true) {
            // 遠距離攻撃が正しく実行されるかのテスト
            // ArcherはUndineに攻撃が届く
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // | Undine   |          | Slime    | | Slime    |          | Archer   |
            // +----------+----------+----------+ +----------+----------+----------+
            const slime0 = Creature.create(CreatureId.SLIME)
            const slime1 = Creature.create(CreatureId.SLIME)
            const undine = Creature.create(CreatureId.UNDINE)
            const archer = Creature.create(CreatureId.ARCHER)
            const battle = new Battle(new FieldPower(Element.WATER))
            battle.field.set(Cell.with(Faction.RED, 0, 2), undine)
            battle.field.set(Cell.with(Faction.RED, 2, 2), slime0)
            battle.field.set(Cell.with(Faction.BLUE, 0, 2), slime1)
            battle.field.set(Cell.with(Faction.BLUE, 2, 2), archer)
            battle.next()
            battle.next()
            battle.next()
            console.assert(undine.isDead)
        }
        if (true) {
            // 遠距離攻撃が正しく実行されるかのテスト
            // ArcherはSpiderを攻撃する
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          | Beetle   | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          | Spider   |          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | | Archer   |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            const beetle = Creature.create(CreatureId.BEETLE)
            const spider = Creature.create(CreatureId.SPIDER)
            const archer = Creature.create(CreatureId.ARCHER)
            const battle = new Battle(new FieldPower(Element.WATER))
            battle.field.set(Cell.with(Faction.RED, 2, 0), beetle)
            battle.field.set(Cell.with(Faction.RED, 1, 1), spider)
            battle.field.set(Cell.with(Faction.BLUE, 0, 2), archer)
            battle.next()
            battle.next()
            battle.next()
            battle.next()
            console.assert(spider.isAlive)
        }
        if (true) {
            // 遠距離攻撃が正しく実行されるかのテスト
            // NinjaはDeepPasteを攻撃する
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          | TrapVine | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          | DeepPaste|          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          | TrapVine |          | | Knight   | Ninja    |          |
            // +----------+----------+----------+ +----------+----------+----------+
            const deepPaste = Creature.create(CreatureId.DEEP_PASTE)
            const trapVine0 = Creature.create(CreatureId.TRAP_VINE)
            const trapVine1 = Creature.create(CreatureId.TRAP_VINE)
            const knight = Creature.create(CreatureId.TRAP_VINE)
            const ninja = Creature.create(CreatureId.NINJA)
            const battle = new Battle(new FieldPower(Element.WATER))
            battle.field.set(Cell.with(Faction.RED, 2, 0), trapVine0)
            battle.field.set(Cell.with(Faction.RED, 1, 1), deepPaste)
            battle.field.set(Cell.with(Faction.RED, 1, 2), trapVine1)
            battle.field.set(Cell.with(Faction.BLUE, 0, 2), knight)
            battle.field.set(Cell.with(Faction.BLUE, 1, 2), ninja)
            battle.next()
            battle.next()
            battle.next()
            console.assert(deepPaste.hp == 94)
        }
        if (true) {
            // 遠距離攻撃が正しく処理されるかのテスト
            // +----------+----------+----------+ +----------+----------+----------+
            // | Sorcerer |          |          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          | SnowMan  | | SnowMan  |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | |          |          | Wizard   |
            // +----------+----------+----------+ +----------+----------+----------+
            const sorcerer = Creature.create(CreatureId.SORCERER)
            const wizard = Creature.create(CreatureId.WIZARD)
            const snowMan0 = Creature.create(CreatureId.SNOW_MAN)
            const snowMan1 = Creature.create(CreatureId.SNOW_MAN)
            const battle = new Battle(new FieldPower(Element.WATER))
            battle.field.set(Cell.with(Faction.RED, 0, 0), sorcerer)
            battle.field.set(Cell.with(Faction.RED, 2, 1), snowMan0)
            battle.field.set(Cell.with(Faction.BLUE, 0, 1), snowMan1)
            battle.field.set(Cell.with(Faction.BLUE, 2, 2), wizard)
            battle.next()
            battle.next()
            battle.next()
            console.assert(sorcerer.isDead)
        }
        if (true) {
            // 広域攻撃が正しく処理されるかのテスト
            // +----------+----------+----------+ +----------+----------+----------+
            // | Wizard   | Wizard   | Wizard   | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // | Wizard   | Wizard   | Wizard   | | DragonFly|          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // | Wizard   | Wizard   | Wizard   | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // 火属性で地の眷属に攻撃するのでダメージは200%の80ダメージになる
            const wizards = (0).rangeExclusive(9).map(_ => Creature.create(CreatureId.WIZARD))
            const dragonFly = Creature.create(CreatureId.DRAGON_FLY)
            const battle = new Battle(new FieldPower(Element.FIRE))
            battle.field.set(Cell.with(Faction.RED, 0, 0), wizards[0])
            battle.field.set(Cell.with(Faction.RED, 0, 1), wizards[1])
            battle.field.set(Cell.with(Faction.RED, 0, 2), wizards[2])
            battle.field.set(Cell.with(Faction.RED, 1, 0), wizards[3])
            battle.field.set(Cell.with(Faction.RED, 1, 1), wizards[4])
            battle.field.set(Cell.with(Faction.RED, 1, 2), wizards[5])
            battle.field.set(Cell.with(Faction.RED, 2, 0), wizards[6])
            battle.field.set(Cell.with(Faction.RED, 2, 1), wizards[7])
            battle.field.set(Cell.with(Faction.RED, 2, 2), wizards[8])
            battle.field.set(Cell.with(Faction.BLUE, 0, 1), dragonFly)
            battle.next()
            battle.next()
            battle.next()
            console.assert(wizards[0].hp == 100)
            console.assert(wizards[1].hp == 100)
            console.assert(wizards[2].hp == 100)
            console.assert(wizards[3].hp == 100)
            console.assert(wizards[4].hp == 100)
            console.assert(wizards[5].hp == 100)
            console.assert(wizards[6].hp == 20)
            console.assert(wizards[7].hp == 20)
            console.assert(wizards[8].hp == 20)
        }
        if (true) {
            // 貫通攻撃が正しく処理されるかのテスト
            // +----------+----------+----------+ +----------+----------+----------+
            // | SnowMan  | SnowMan  | SnowMan  | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // | SnowMan  | SnowMan  | SnowMan  | | Mermaid  |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // | SnowMan  | SnowMan  | SnowMan  | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // 水属性で地の眷属に攻撃するのでダメージは100%の40ダメージになる
            const snowMans = (0).rangeExclusive(9).map(_ => Creature.create(CreatureId.SNOW_MAN))
            const mermaid = Creature.create(CreatureId.MERMAID)
            const battle = new Battle(new FieldPower(Element.WATER))
            battle.field.set(Cell.with(Faction.RED, 0, 0), snowMans[0])
            battle.field.set(Cell.with(Faction.RED, 0, 1), snowMans[1])
            battle.field.set(Cell.with(Faction.RED, 0, 2), snowMans[2])
            battle.field.set(Cell.with(Faction.RED, 1, 0), snowMans[3])
            battle.field.set(Cell.with(Faction.RED, 1, 1), snowMans[4])
            battle.field.set(Cell.with(Faction.RED, 1, 2), snowMans[5])
            battle.field.set(Cell.with(Faction.RED, 2, 0), snowMans[6])
            battle.field.set(Cell.with(Faction.RED, 2, 1), snowMans[7])
            battle.field.set(Cell.with(Faction.RED, 2, 2), snowMans[8])
            battle.field.set(Cell.with(Faction.BLUE, 0, 1), mermaid)
            battle.next()
            battle.next()
            battle.next()
            console.assert(snowMans[0].hp == 400)
            console.assert(snowMans[1].hp == 360)
            console.assert(snowMans[2].hp == 400)
            console.assert(snowMans[3].hp == 400)
            console.assert(snowMans[4].hp == 360)
            console.assert(snowMans[5].hp == 400)
            console.assert(snowMans[6].hp == 400)
            console.assert(snowMans[7].hp == 360)
            console.assert(snowMans[8].hp == 400)
        }
        if (true) {
            // 対地広域が正しく処理されるかのテスト
            // +----------+----------+----------+ +----------+----------+----------+
            // | SnowMan  | SnowMan  | SnowMan  | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // | SnowMan  | SnowMan  | SnowMan  | | Sorcerer |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // | SnowMan  | SnowMan  | SnowMan  | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // 地属性で地の眷属に攻撃するのでダメージは5%の4ダメージになる
            const snowMans = (0).rangeExclusive(9).map(_ => Creature.create(CreatureId.SNOW_MAN))
            const sorcerer = Creature.create(CreatureId.SORCERER)
            const battle = new Battle(new FieldPower(Element.WATER))
            battle.field.set(Cell.with(Faction.RED, 0, 0), snowMans[0])
            battle.field.set(Cell.with(Faction.RED, 0, 1), snowMans[1])
            battle.field.set(Cell.with(Faction.RED, 0, 2), snowMans[2])
            battle.field.set(Cell.with(Faction.RED, 1, 0), snowMans[3])
            battle.field.set(Cell.with(Faction.RED, 1, 1), snowMans[4])
            battle.field.set(Cell.with(Faction.RED, 1, 2), snowMans[5])
            battle.field.set(Cell.with(Faction.RED, 2, 0), snowMans[6])
            battle.field.set(Cell.with(Faction.RED, 2, 1), snowMans[7])
            battle.field.set(Cell.with(Faction.RED, 2, 2), snowMans[8])
            battle.field.set(Cell.with(Faction.BLUE, 0, 1), sorcerer)
            battle.next()
            battle.next()
            battle.next()
            console.assert(snowMans[0].hp == 396)
            console.assert(snowMans[1].hp == 396)
            console.assert(snowMans[2].hp == 396)
            console.assert(snowMans[3].hp == 396)
            console.assert(snowMans[4].hp == 396)
            console.assert(snowMans[5].hp == 396)
            console.assert(snowMans[6].hp == 396)
            console.assert(snowMans[7].hp == 396)
            console.assert(snowMans[8].hp == 396)
        }
        if (true) {
            // 対地広域が正しく処理されるかのテスト
            // +----------+----------+----------+ +----------+----------+----------+
            // | SnowMan  | SnowMan  | SnowMan  | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // | SnowMan  | SnowMan  | SnowMan  | | Sorceress           |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // | SnowMan  | SnowMan  | SnowMan  | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // 風属性で地の眷属に攻撃するのでダメージは200%の160ダメージになる
            // ただし、地上クリーチャーに対する対空攻撃なのでダメージは5%で8ダメージになる
            const snowMans = (0).rangeExclusive(9).map(_ => Creature.create(CreatureId.SNOW_MAN))
            const sorceress = Creature.create(CreatureId.SORCERESS)
            const battle = new Battle(new FieldPower(Element.WATER))
            battle.field.set(Cell.with(Faction.RED, 0, 0), snowMans[0])
            battle.field.set(Cell.with(Faction.RED, 0, 1), snowMans[1])
            battle.field.set(Cell.with(Faction.RED, 0, 2), snowMans[2])
            battle.field.set(Cell.with(Faction.RED, 1, 0), snowMans[3])
            battle.field.set(Cell.with(Faction.RED, 1, 1), snowMans[4])
            battle.field.set(Cell.with(Faction.RED, 1, 2), snowMans[5])
            battle.field.set(Cell.with(Faction.RED, 2, 0), snowMans[6])
            battle.field.set(Cell.with(Faction.RED, 2, 1), snowMans[7])
            battle.field.set(Cell.with(Faction.RED, 2, 2), snowMans[8])
            battle.field.set(Cell.with(Faction.BLUE, 0, 1), sorceress)
            battle.next()
            battle.next()
            battle.next()
            console.assert(snowMans[0].hp == 392)
            console.assert(snowMans[1].hp == 392)
            console.assert(snowMans[2].hp == 392)
            console.assert(snowMans[3].hp == 392)
            console.assert(snowMans[4].hp == 392)
            console.assert(snowMans[5].hp == 392)
            console.assert(snowMans[6].hp == 392)
            console.assert(snowMans[7].hp == 392)
            console.assert(snowMans[8].hp == 392)
        }
        if (true) {
            // 属性攻撃が正しく行われるかのテスト
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          | DeepPaste| | Archer   |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            const deepPaste = Creature.create(CreatureId.DEEP_PASTE)
            const archer = Creature.create(CreatureId.ARCHER )
            const battle = new Battle(new FieldPower(Element.WATER, { value: 8 }))
            battle.field.set(Cell.with(Faction.RED, 2, 1), deepPaste)
            battle.field.set(Cell.with(Faction.BLUE, 0, 1), archer)
            battle.next()
            battle.next()
            battle.next()
            battle.next()
            console.assert(archer.hp == 112)
            console.assert(battle.power.element == Element.WATER)
            console.assert(battle.power.value == 10)
        }
        if (true) {
            // 属性攻撃はなにもできなくてもフィールドパワーが蓄積するテスト
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // | DeepPaste| DeepPaste| DeepPaste| | Archer   |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            // |          |          |          | |          |          |          |
            // +----------+----------+----------+ +----------+----------+----------+
            const deepPaste0 = Creature.create(CreatureId.DEEP_PASTE)
            const deepPaste1 = Creature.create(CreatureId.DEEP_PASTE)
            const deepPaste2 = Creature.create(CreatureId.DEEP_PASTE)
            const archer = Creature.create(CreatureId.ARCHER )
            const battle = new Battle(new FieldPower(Element.WATER, { value: 0 }))
            battle.field.set(Cell.with(Faction.RED, 0, 1), deepPaste0)
            battle.field.set(Cell.with(Faction.RED, 1, 1), deepPaste1)
            battle.field.set(Cell.with(Faction.RED, 2, 1), deepPaste2)
            battle.field.set(Cell.with(Faction.BLUE, 0, 1), archer)
            for (let i = 0; i < 9; i++) {
                battle.next()
            }
            console.assert(archer.hp == 140 - 20 - 26)
            console.assert(battle.power.element == Element.WATER)
            console.assert(battle.power.value == 8)
        }
    }

    if (false) {
        // すべての戦闘が生成できるかのテスト
        for (const stageId of StageId.values) {
            const stage = Stage.get(stageId)
            for (let i = 0; i < 4; i++) {
                const battle = stage.battle({ nth: i })
                console.log(`${stageId}.${stage.name} ${i + 1}戦目 = ${battle}`)
            }
        }
    }
})(this)
