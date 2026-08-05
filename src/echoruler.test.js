/**
* @file echoruler.test.js
* @copyright 2025 PlasticHeart
*/

import { describe, expect, it } from 'vitest'
import './echoruler.js'
import './echoruler.vanilla.js'

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
} = globalThis.EchoRuler

describe('Battle', () => {
    it('武器を持たないクリーチャーが正しく処理される', () => {
        const snowMan = Creature.create(CreatureId.SNOW_MAN)
        const knight = Creature.create(CreatureId.KNIGHT)
        const battle = new Battle(new FieldPower(Element.WATER))
        battle.field.set(Cell.with(Faction.RED, 2, 1), snowMan)
        battle.field.set(Cell.with(Faction.BLUE, 0, 1), knight)
        battle.next()
        battle.next()
        battle.next()
        battle.next()
        expect(snowMan.hp).toBe(400 - 80)
        expect(knight.hp).toBe(200)
    })

    it('近接攻撃: Mantisは攻撃ができない', () => {
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
        expect(undine.isAlive).toBe(true)
    })

    it('近接攻撃: BLUE陣営の攻撃は正面・下・上の順番に優先する', () => {
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
        expect(undine.isDead).toBe(true)
    })

    it('近接攻撃: 攻撃の優先順位はRockpile(2), Sylph(3)であり、LancerはRockpileを攻撃する', () => {
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
        expect(sylph.hp).toBe(50)
        expect(rockpile.hp).toBe(75)
    })

    it('近接攻撃: 攻撃の優先順位はUndine(3), Sylph(3)であり、下が優先されるのでKnightはUndineを攻撃する', () => {
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
        expect(undine.isDead).toBe(true)
    })

    it('近接攻撃: 攻撃の優先順位はRockpile(3), Sylph(3)であり、Hpが低い方が優先されるのでKnightはSylphを攻撃する', () => {
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
        expect(sylph.isDead).toBe(true)
    })

    it('近接攻撃: 攻撃の優先順位はRockpile(2), Sylph(3)だが、NinjaはFREE_MOVEを持つのでSylphを攻撃する', () => {
        // +----------+----------+----------+ +----------+----------+----------+
        // |          | Sylph    |          | | Ninja    |          |          |
        // +----------+----------+----------+ +----------+----------+----------+
        // |          |          |          | |          |          |          |
        // +----------+----------+----------+ +----------+----------+----------+
        // |          |          | Rockpile | |          |          |          |
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
        expect(sylph.isDead).toBe(true)
    })

    it('近接攻撃: RED陣営の攻撃は正面・上・下の順番に優先する', () => {
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
        expect(sylph.isDead).toBe(true)
    })

    it('遠距離攻撃: ArcherはUndineに攻撃が届かない(Undineが1行目にいる場合)', () => {
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
        expect(slime0.hp).toBe(114)
    })

    it('遠距離攻撃: ArcherはUndineに攻撃が届かない(Undineが2行目にいる場合)', () => {
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
        expect(slime0.hp).toBe(114)
    })

    it('遠距離攻撃: ArcherはUndineに攻撃が届く', () => {
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
        expect(undine.isDead).toBe(true)
    })

    it('遠距離攻撃: ArcherはSpiderを攻撃する', () => {
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
        expect(spider.isAlive).toBe(true)
    })

    it('遠距離攻撃: NinjaはDeepPasteを攻撃する', () => {
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
        expect(deepPaste.hp).toBe(94)
    })

    it('遠距離攻撃が正しく処理される', () => {
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
        expect(sorcerer.isDead).toBe(true)
    })

    it('広域攻撃が正しく処理される(火属性で地の眷属に攻撃するのでダメージは200%の80ダメージになる)', () => {
        // +----------+----------+----------+ +----------+----------+----------+
        // | Wizard   | Wizard   | Wizard   | |          |          |          |
        // +----------+----------+----------+ +----------+----------+----------+
        // | Wizard   | Wizard   | Wizard   | | DragonFly|          |          |
        // +----------+----------+----------+ +----------+----------+----------+
        // | Wizard   | Wizard   | Wizard   | |          |          |          |
        // +----------+----------+----------+ +----------+----------+----------+
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
        expect(wizards[0].hp).toBe(100)
        expect(wizards[1].hp).toBe(100)
        expect(wizards[2].hp).toBe(100)
        expect(wizards[3].hp).toBe(100)
        expect(wizards[4].hp).toBe(100)
        expect(wizards[5].hp).toBe(100)
        expect(wizards[6].hp).toBe(20)
        expect(wizards[7].hp).toBe(20)
        expect(wizards[8].hp).toBe(20)
    })

    it('貫通攻撃が正しく処理される(水属性で地の眷属に攻撃するのでダメージは100%の40ダメージになる)', () => {
        // +----------+----------+----------+ +----------+----------+----------+
        // | SnowMan  | SnowMan  | SnowMan  | |          |          |          |
        // +----------+----------+----------+ +----------+----------+----------+
        // | SnowMan  | SnowMan  | SnowMan  | | Mermaid  |          |          |
        // +----------+----------+----------+ +----------+----------+----------+
        // | SnowMan  | SnowMan  | SnowMan  | |          |          |          |
        // +----------+----------+----------+ +----------+----------+----------+
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
        expect(snowMans[0].hp).toBe(400)
        expect(snowMans[1].hp).toBe(360)
        expect(snowMans[2].hp).toBe(400)
        expect(snowMans[3].hp).toBe(400)
        expect(snowMans[4].hp).toBe(360)
        expect(snowMans[5].hp).toBe(400)
        expect(snowMans[6].hp).toBe(400)
        expect(snowMans[7].hp).toBe(360)
        expect(snowMans[8].hp).toBe(400)
    })

    it('対地広域が正しく処理される(地属性で地の眷属に攻撃するのでダメージは5%の4ダメージになる)', () => {
        // +----------+----------+----------+ +----------+----------+----------+
        // | SnowMan  | SnowMan  | SnowMan  | |          |          |          |
        // +----------+----------+----------+ +----------+----------+----------+
        // | SnowMan  | SnowMan  | SnowMan  | | Sorcerer |          |          |
        // +----------+----------+----------+ +----------+----------+----------+
        // | SnowMan  | SnowMan  | SnowMan  | |          |          |          |
        // +----------+----------+----------+ +----------+----------+----------+
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
        expect(snowMans[0].hp).toBe(396)
        expect(snowMans[1].hp).toBe(396)
        expect(snowMans[2].hp).toBe(396)
        expect(snowMans[3].hp).toBe(396)
        expect(snowMans[4].hp).toBe(396)
        expect(snowMans[5].hp).toBe(396)
        expect(snowMans[6].hp).toBe(396)
        expect(snowMans[7].hp).toBe(396)
        expect(snowMans[8].hp).toBe(396)
    })

    it('対地広域が正しく処理される(風属性で地の眷属に攻撃するのでダメージは200%の160ダメージになるが、地上クリーチャーに対する対空攻撃なのでダメージは5%で8ダメージになる)', () => {
        // +----------+----------+----------+ +----------+----------+----------+
        // | SnowMan  | SnowMan  | SnowMan  | |          |          |          |
        // +----------+----------+----------+ +----------+----------+----------+
        // | SnowMan  | SnowMan  | SnowMan  | | Sorceress           |          |
        // +----------+----------+----------+ +----------+----------+----------+
        // | SnowMan  | SnowMan  | SnowMan  | |          |          |          |
        // +----------+----------+----------+ +----------+----------+----------+
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
        expect(snowMans[0].hp).toBe(392)
        expect(snowMans[1].hp).toBe(392)
        expect(snowMans[2].hp).toBe(392)
        expect(snowMans[3].hp).toBe(392)
        expect(snowMans[4].hp).toBe(392)
        expect(snowMans[5].hp).toBe(392)
        expect(snowMans[6].hp).toBe(392)
        expect(snowMans[7].hp).toBe(392)
        expect(snowMans[8].hp).toBe(392)
    })

    it('属性攻撃が正しく行われる', () => {
        // +----------+----------+----------+ +----------+----------+----------+
        // |          |          |          | |          |          |          |
        // +----------+----------+----------+ +----------+----------+----------+
        // |          |          | DeepPaste| | Archer   |          |          |
        // +----------+----------+----------+ +----------+----------+----------+
        // |          |          |          | |          |          |          |
        // +----------+----------+----------+ +----------+----------+----------+
        const deepPaste = Creature.create(CreatureId.DEEP_PASTE)
        const archer = Creature.create(CreatureId.ARCHER)
        const battle = new Battle(new FieldPower(Element.WATER, { value: 8 }))
        battle.field.set(Cell.with(Faction.RED, 2, 1), deepPaste)
        battle.field.set(Cell.with(Faction.BLUE, 0, 1), archer)
        battle.next()
        battle.next()
        battle.next()
        battle.next()
        expect(archer.hp).toBe(112)
        expect(battle.power.element).toBe(Element.WATER)
        expect(battle.power.value).toBe(10)
    })

    it('属性攻撃はなにもできなくてもフィールドパワーが蓄積する', () => {
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
        const archer = Creature.create(CreatureId.ARCHER)
        const battle = new Battle(new FieldPower(Element.WATER, { value: 0 }))
        battle.field.set(Cell.with(Faction.RED, 0, 1), deepPaste0)
        battle.field.set(Cell.with(Faction.RED, 1, 1), deepPaste1)
        battle.field.set(Cell.with(Faction.RED, 2, 1), deepPaste2)
        battle.field.set(Cell.with(Faction.BLUE, 0, 1), archer)
        for (let i = 0; i < 9; i++) {
            battle.next()
        }
        expect(archer.hp).toBe(140 - 20 - 26)
        expect(battle.power.element).toBe(Element.WATER)
        expect(battle.power.value).toBe(8)
    })

    // 全ステージの初期対戦カードが生成できるかの確認用。CI では実行しない
    it.skip('すべての戦闘が生成できる', () => {
        for (const stageId of StageId.values) {
            const stage = Stage.get(stageId)
            for (let i = 0; i < 4; i++) {
                const battle = stage.battle({ nth: i })
                console.log(`${stageId}.${stage.name} ${i + 1}戦目 = ${battle}`)
            }
        }
    })
})
