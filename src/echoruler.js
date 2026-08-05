/**
* @file echoruler.js
* @copyright 2025 PlasticHeart
*/

!(root => {
    Array.prototype.max = function () {
        return this.reduce((a, b) => Math.max(a, b))
    }

    Array.prototype.min = function() {
        return this.reduce((a, b) => Math.min(a, b))
    }

    Array.prototype.sum = function () {
        return this.reduce((a, b) => a + b, 0)
    }

    Array.prototype.toString = function () {
        return `[${this.map(x => x?.toString() ?? 'null').join(', ')}]`
    }

    Number.prototype.rangeExclusive = function (value) {
        return [...new Array(value - this)].map((_, i) => i + this)
    }

    Number.prototype.rangeInclusive = function (value) {
        return [...new Array(value - this + 1)].map((_, i) => i + this)
    }

    Set.prototype.toString = function () {
        return `{${[...this].map(x => x?.toString() ?? 'null').join(', ')}}`
    }

    /**
    * 防具のオブジェクト。
    */
    class Armor {
        /**
        * 属性距離ごとのダメージ加算倍率。
        * @type {number[]}
        */
        static _DAMAGE_MULTIPLIER = [0.05, 1.0, 2.0, 2.0, 1.0]

        /**
        * @type {Armor[]}
        */
        static values = []

        /**
        * @param {ArmorId} armorId
        * @param {string} name
        * @param {Object} options
        * @param {?number} options.material
        * @param {?number} options.magical
        * @param {?Element} options.element
        */
        constructor(armorId, name, { material, magical, element = null } = {}) {
            this.armorId = armorId
            this.name = name
            this.material = material ?? 0
            this.magical = magical ?? 0
            this.element = element
        }

        /**
        * 防具を返す。
        * @param {ArmorId} armorId
        * @returns {Armor}
        */
        static get(armorId) {
            const armor = this.values.find(x => x.armorId == armorId)
            if (armor) {
                return armor
            }
            throw new Error(`防具が見つかりません: ${armorId}`)
        }

        /**
        * 防具で軽減されたダメージを算出する。
        * @param {Damage} damage
        * @returns {Damage}
        */
        reducedDamage(damage) {
            let value = damage.value
            if (damage.kind == DamageKind.MATERIAL) {
                // 物理攻撃なら物理攻撃の軽減率を適用する
                value *= Math.max(100 - this.material, 0) / 100
            } else if (damage.kind == DamageKind.MAGICAL) {
                // 魔法攻撃なら魔法攻撃の軽減率を適用する
                value *= Math.max(100 - this.magical, 0) / 100
            } else if (damage.kind == DamageKind.ELEMENTAL) {
                // 属性攻撃なら眷属のダメージ補正を適用する
                if (damage.element != null && this.element != null) {
                    const distance = this.element.distanceFrom(damage.element)
                    value *= Armor._DAMAGE_MULTIPLIER[distance]
                }
            } else if (damage.kind == DamageKind.SPECIAL) {
                // 特殊な攻撃なのでここでは軽減しない
            }

            // 端数切捨ては全ての軽減率を適用した後に1回だけ行う
            return damage.clone({ value: Math.floor(value) })
        }

        /**
        * @returns {string}
        */
        toString() {
            return `<${this.constructor.name}: { `
                + `armorId: ${this.armorId}, `
                + `name: ${this.name}, `
                + `material: ${this.material}%, `
                + `magical: ${this.magical}%, `
                + `element: ${this.element} `
                + `}>`
        }
    }

    /**
    * 防具ID。
    */
    class ArmorId {
        /**
        * @param {string} value
        */
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

    /**
    * 戦闘を処理するためのオブジェクト。
    */
    class Battle {
        /**
        * @param {FieldPower} power
        */
        constructor(power) {
            if (!(power instanceof FieldPower)) {
                throw new Error(`フィールドパワーを指定してください: ${power}`)
            }
            this.action = 0
            this.field = new BattleField()
            this.logger = []
            this.power = power
            this.resolved = new Set()
            this.state = BattleState.INITIALIZED
            this.turn = 0
            this.totalDamage = 0
        }

        /**
        * 戦闘が終了するまで実行する。
        * @param {Object} options
        * @param {?number} options.maxTurns
        * @param {function(...args)} options.print
        * @returns {BattleState}
        */
        execute({ maxTurns, print } = {}) {
            while (true) {
                const stateBefore = this.state
                const state = this.next()
                this.print(print ?? (() => {}))
                if (state == BattleState.READY && state == stateBefore) {
                    return state
                }
                if ([BattleState.WIN, BattleState.LOSE].includes(state)) {
                    return state
                }
                if (maxTurns != null && this.turn > maxTurns) {
                    console.warn(this)
                    throw new Error(`最大ターン数を超過しました: ${this.turn}`)
                }
            }
        }

        /**
        * 戦闘を1ステップ進める。
        * @returns {BattleState}
        */
        next() {
            this.logger.length = 0

            // 決着がついていればこれ以上処理しない
            if (this.state == BattleState.WIN || this.state == BattleState.LOSE) {
                return this.state
            }

            // 初期化状態であれば、戦闘準備状態に移行して次のステップへ
            if (this.state == BattleState.INITIALIZED) {
                this.logger.push(new Log({ turn: this.turn, message: '敵出現！' }))
                this.logger.push(new Log({ turn: this.turn, message: '戦闘に参加するキャラを配置して下さい。' }))
                return (this.state = BattleState.READY)
            }

            // 戦闘準備状態であれば、Blue陣営が設定されていることを確認する
            if (this.state == BattleState.READY) {
                // Blue陣営が設定されていれば戦闘開始
                const queue = this.field.queue()
                if (queue.some(x => x.cell.faction == Faction.BLUE)) {
                    this.logger.push(new Log({ turn: this.turn, message: '戦闘開始！' }))
                    return (this.state = BattleState.RESOLVING)
                }
                this.logger.push(new Log({ turn: this.turn, message: '戦闘に参加するキャラを配置して下さい。' }))
                return this.state
            }

            // Blue陣営が全滅していれば敗北とし、Red陣営が全滅していれば勝利とする
            if (this.field.creaturesOf(Faction.BLUE).length == 0) {
                this.logger.push(new Log({ turn: this.turn, message: '壊滅しました……。' }))
                return (this.state = BattleState.LOSE)
            } else if (this.field.creaturesOf(Faction.RED).length == 0) {
                this.logger.push(new Log({ turn: this.turn, message: '撃破！' }))
                return (this.state = BattleState.WIN)
            }

            // 各行動の最初にそれぞれの陣営に前衛がいるか確認して、いなければ前進させる
            for (const faction of Faction.values) {
                this.field.moveForward(faction)
            }

            // 行動順を取得してその順番で攻撃を解決する
            // 戦闘中に位置が変わるので、resolvedで処理済み情報を管理する
            const queue = this.field.queue()

            // まだ行動していないクリーチャーを取得する
            // もしすべてのクリーチャーが行動済みであれば空が取得できるはず
            const q = queue.find(x => !this.resolved.has(x.creature.entityId))
            if (q == null) {
                // Effect.SLOWとEffect.STUNはターンごとに回復する
                for (let i = 0; i < this.field.cells.length; i++) {
                    const creature = this.field.cells[i]
                    if (creature) {
                        creature.effects.delete(Effect.SLOW)
                        creature.effects.delete(Effect.STUN)
                    }
                }
                this.resolved.clear()
                this.turn++
                return this.state
            }

            this.resolved.add(q.creature.entityId)
            this.action++

            // POISON状態であれば、行動前に最大Hpの20%のダメージを受ける
            if (q.creature.effects.has(Effect.POISON)) {
                const damage = Math.floor(q.creature.schema.hp * 0.2)
                q.creature.hp -= damage
                if (q.cell.faction != Faction.BLUE) {
                    this.totalDamage += damage
                }
                this.logger.push(new Log({
                    turn: this.turn,
                    message: `${q.cell.faction}の${q.creature.schema.name}は毒に犯されていく。`,
                    attacker: q.cell
                }))
                this.logger.push(new Log({ turn: this.turn, message: `${damage}のダメージ。` }))

                // 毒によって死亡した場合はこれ以上の処理を打ち切る
                if (q.creature.isDead) {
                    this.field.remove(q.cell)
                    this.logger.push(new Log({
                        turn: this.turn,
                        message: `${q.creature.name}は倒れた。`,
                        attacker: q.cell
                    }))
                    return this.state
                }
            }

            // 攻撃を実行する
            if (q.creature.canAttack) {
                this._attack(q)
            }

            return this.state
        }

        /**
        * 攻撃を実行する
        * @param {BattleQueue} attacker
        */
        _attack(attacker) {
            let totalDamage = 0

            // 攻撃対象がいなかったとしても攻撃ログは表示される
            this.logger.push(new Log({
                turn: this.turn,
                message: `${attacker.cell.faction}の${attacker.creature.schema.attackMessage}`,
                attacker: attacker.cell
            }))

            // 攻撃回数分攻撃を実行する
            for (let i = 0; i < attacker.creature.attacks; i++) {
                // クリーチャーの攻撃対象を取得する
                const targets = this.field.targets(attacker.cell, { chimera: i })

                // 攻撃対象が存在しないなら処理終了
                // Chimeraは射程の異なる攻撃が発生するので、次の攻撃が成功することがある
                if (targets.length == 0) {
                    this.logger.push(new Log({
                        turn: this.turn,
                        message: '何もできない。',
                        attacker: attacker.cell
                    }))
                    continue
                }

                // 攻撃対象ごとにダメージと一時的効果を与える
                for (const defender of targets) {
                    // 実際に受けるダメージを算出して適用する
                    const attackerDamage = this._attackerDamage(attacker, defender, { chimera: i })
                    const damage = defender.creature.schema.armor().reducedDamage(attackerDamage)

                    // ダメージを適用する
                    defender.creature.hp -= damage.value
                    if (defender.cell.faction != Faction.BLUE) {
                        this.totalDamage += damage.value
                    }
                    this.logger.push(new Log({
                        turn: this.turn,
                        message: `${defender.cell.faction}の${defender.creature.name}は${damage.value}のダメージ。`,
                        attacker: attacker.cell,
                        defender: defender.cell
                    }))

                    // 一時的効果を適用する
                    const weapon = attacker.creature.schema.weapon({ chimera: i })
                    for (const effect of weapon.effects) {
                        if (!defender.creature.hasResist(effect)) {
                            defender.creature.effects.add(effect)
                            this.logger.push(new Log({
                                turn: this.turn,
                                message: effect.message(defender.creature.schema.name),
                                attacker: attacker.cell,
                                defender: defender.cell
                            }))
                        }
                    }

                    // 麻痺・石化した場合は即死する
                    if (/*defender.creature.effects.has(Effect.PARALYZE)
                        || */defender.creature.effects.has(Effect.STONE)
                    ) {
                        defender.creature.hp = 0
                    }

                    // 死亡判定をする
                    if (defender.creature.isDead) {
                        this.field.remove(defender.cell)
                        this.logger.push(new Log({
                            turn: this.turn,
                            message: `${defender.creature.name}は倒れた。`,
                            attacker: attacker.cell,
                            defender: defender.cell
                        }))
                    }
                }
            }

            // 元の攻撃力に基づいてフィールドパワーを更新する
            // 実際に攻撃ができたかは関係ない
            for (let i = 0; i < attacker.creature.attacks; i++) {
                const weapon = attacker.creature.schema.weapon({ chimera: i })
                this.power = this.power.updatedPower(weapon.damage)
            }
        }

        /**
        * 攻撃クリーチャーが与えるダメージを返す。
        * @param {BattleQueue} attacker
        * @param {BattleTarget} defender
        * @param {Object} options
        * @param {number} options.chimera
        * @returns {Damage}
        */
        _attackerDamage(attacker, defender, { chimera } = {}) {
            // 基本ダメージは(武器のダメージ + フィールドパワーの増幅分)
            const weapon = attacker.creature.schema.weapon({ chimera })
            const baseDamage = this.power.updatedDamage(weapon.damage)

            // Effect.CURSEがある場合には50%のダメージになる
            let multiplier = 1.0
            if (attacker.creature.effects.has(Effect.CURSE)) {
                multiplier *= 0.5
            }

            // 空中クリーチャーに対するTargeting.ANTI_GROUNDと
            // 地上クリーチャーに対するTargeting.ANTI_AIRは5%のダメージになる
            // Effect.CURSEとは複合する
            const flying = defender.creature.schema.traits.has(Trait.FLYING)
            if (weapon.targeting == Targeting.ANTI_GROUND && flying) {
                multiplier *= 0.05
            } else if (weapon.targeting == Targeting.ANTI_AIR && !flying) {
                multiplier *= 0.05
            }

            // 端数切捨ては防具の軽減率まで適用した後(Armor.reducedDamage)に1回だけ行う
            return baseDamage.clone({ value: baseDamage.value * multiplier })
        }

        /**
        * ログをコンソールに出力する。
        * @param {function(...any)} output
        */
        print(output = console.log) {
            for (const log of this.logger) {
                output(log.message)
            }
        }

        /**
        * 敗北していれば次の戦闘準備をする。
        * @returns {BattleState}
        */
        ready() {
            if (this.state == BattleState.LOSE || this.state == BattleState.READY) {
                this.state = BattleState.READY
                this.action = 0
                this.resolved.clear()
                this.turn = 0
                return (this.state = BattleState.READY)
            }
            throw new Error(`現在は戦闘準備状態に移行できません: ${this.state}`)
        }
    }

    /**
    * 戦闘フィールドを表すオブジェクト。
    * 自軍3x3と敵陣3x3の18マスからなるマップで戦闘する。
    * セル上に登録されたクリーチャーの所有権は持たない。
    */
    class BattleField {
        /**
        * @type {number[]}
        */
        static _DEFAULT_PRIORITY = [9, 6, 3, 1, 4, 7, 8, 5, 2, 2, 5, 8, 7, 4, 1, 3, 6, 9]

        /**
        * @type {number[][]}
        */
        static _SHORT_RANGE = [
            [5, 3, 1, 1, 3, 5, 6, 4, 2, 2, 4, 6, 7, 5, 3, 3, 5, 7],
            [6, 4, 2, 2, 4, 6, 5, 3, 1, 1, 3, 5, 6, 4, 2, 2, 4, 6],
            [7, 5, 3, 3, 5, 7, 6, 4, 2, 2, 4, 6, 5, 3, 1, 1, 3, 5]
        ]

        /**
        * @type {number[][]}
        */
        static _LONG_RANGE = [
            [3, 2, 1, 1, 2, 3, 4, 3, 2, 2, 3, 4, 5, 4, 3, 3, 4, 5],
            [4, 3, 2, 2, 3, 4, 3, 2, 1, 1, 2, 3, 4, 3, 2, 2, 3, 4],
            [5, 4, 3, 3, 4, 5, 4, 3, 2, 2, 3, 4, 3, 2, 1, 1, 2, 3]
        ]

        /**
        * @type {number[][]}
        */
        static _WIDE_RANGE = [
            [3, 2, 1, 1, 2, 3, 3, 2, 1, 1, 2, 3, 3, 2, 1, 1, 2, 3],
            [3, 2, 1, 1, 2, 3, 3, 2, 1, 1, 2, 3, 3, 2, 1, 1, 2, 3],
            [3, 2, 1, 1, 2, 3, 3, 2, 1, 1, 2, 3, 3, 2, 1, 1, 2, 3]
        ]

        /**
        * @type {number[][]}
        */
        static _PENETRATE_RANGE = [
            [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3],
            [2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
            [3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1]
        ]

        /**
        * @type {number[][]}
        */
        static _ALL_RANGE = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]

        constructor() {
            /**
            * @type {(?Creature)[]}
            */
            this.cells = (0).rangeExclusive(3 * 3 * 2).map(_ => null)
        }

        /**
        * 指定した陣営のクリーチャーを返す。
        * @param {Faction} faction
        * @returns {Creature[]}
        */
        creaturesOf(faction) {
            const creatures = []
            for (let i = 0; i < this.cells.length; i++) {
                if (Cell.fromIndex(i).faction == faction && this.cells[i]) {
                    creatures.push(this.cells[i])
                }
            }
            return creatures
        }

        /**
        * 指定した座標のクリーチャーを返す。
        * @param {Cell} cell
        * @returns {?Creature}
        */
        get(cell) {
            return this.cells[cell.index]
        }

        /**
        * 前衛が存在するか返す。
        * @param {Faction} faction
        * @returns {boolean}
        */
        hasForward(faction) {
            if (faction == Faction.BLUE) {
                return !!(this.cells[3] || this.cells[9] || this.cells[15])
            } else if (faction == Faction.RED) {
                return !!(this.cells[2] || this.cells[8] || this.cells[14])
            }
            throw new Error(`不正な陣営です: ${faction}`)
        }

        /**
        * 前衛がいなければ中衛と後衛を前進させる。
        * @param {Faction} faction
        * @returns {boolean}
        */
        moveForward(faction) {
            if (!this.hasForward(faction)) {
                if (faction == Faction.BLUE) {
                    this.cells[3] = this.cells[4]
                    this.cells[4] = this.cells[5]
                    this.cells[5] = null
                    this.cells[9] = this.cells[10]
                    this.cells[10] = this.cells[11]
                    this.cells[11] = null
                    this.cells[15] = this.cells[16]
                    this.cells[16] = this.cells[17]
                    this.cells[17] = null
                    return true
                } else if (faction == Faction.RED) {
                    this.cells[2] = this.cells[1]
                    this.cells[1] = this.cells[0]
                    this.cells[0] = null
                    this.cells[8] = this.cells[7]
                    this.cells[7] = this.cells[6]
                    this.cells[6] = null
                    this.cells[14] = this.cells[13]
                    this.cells[13] = this.cells[12]
                    this.cells[12] = null
                    return true
                }
            }
            return false
        }

        /**
        * 戦闘フィールドに設定されたすべての行動できるクリーチャーを取得して、行動順で返す。
        * @returns {BattleQueue[]}
        */
        queue() {
            let queue = []
            for (let i = 0; i < this.cells.length; i++) {
                const creature = this.cells[i]
                if (creature?.canAttack ?? false) {
                    queue.push(new BattleQueue({ cell: Cell.fromIndex(i), creature }))
                }
            }
            return queue.sort((a, b) => a.compare(b))
        }

        /**
        * 指定した座標のクリーチャーを削除する。
        * @param {Cell} cell
        */
        remove(cell) {
            if(!this.cells[cell.index]) {
                throw new Error(`クリーチャーが見つかりません: ${cell}`)
            }
            this.cells[cell.index] = null
        }

        /**
        * 指定した座標にクリーチャーを設定する。
        * @param {Cell} cell
        * @param {Creature} creature
        */
        set(cell, creature) {
            if (creature.isDead) {
                throw new Error(`死亡しているクリーチャーは配置できません: ${creature}`)
            }
            if (this.cells[cell.index]) {
                throw new Error(`すでにクリーチャーが設定されています: ${cell}`)
            }
            this.cells[cell.index] = creature
        }

        /**
        * 指定した座標にいるクリーチャーの攻撃対象を優先順位付きで返す。
        * @param {Cell} cell
        * @param {Object} options
        * @param {?number} options.chimera
        * @returns {BattleTarget}
        */
        targets(cell, { chimera } = {}) {
            // クリーチャーが存在しないか、死亡しているなら攻撃対象はなし
            const creature = this.get(cell)
            if (creature?.isDead ?? true) {
                return []
            }

            // Chimeraオプションが指定されている場合には、攻撃インデックスによって武器が動的に変わる
            const weapon = creature.schema.weapon({ chimera })

            // Skill.FREE_MOVEがあれば最低射程が3になり、遠距離攻撃扱いになる
            const range = Math.max(weapon.range, creature.schema.skills.has(Skill.FREE_MOVE) ? 3 : 1)
            const isLongRange = weapon.targeting == Targeting.LONG_RANGE
                || creature.schema.skills.has(Skill.FREE_MOVE)

            // 武器のターゲット種別と現在のY座標に応じて攻撃の優先順位テーブルを参照する
            let priority = [0, 0, 0, 0, 0, 0, 0, 0, 0]
            if (weapon.targeting == Targeting.WIDE) {
                priority = BattleField._WIDE_RANGE[cell.y]
            } else if (weapon.targeting == Targeting.PENETRATE) {
                priority = BattleField._PENETRATE_RANGE[cell.y]
            } else if (weapon.targeting == Targeting.ANTI_GROUND) {
                priority = BattleField._ALL_RANGE[cell.y]
            } else if (weapon.targeting == Targeting.ANTI_AIR) {
                priority = BattleField._ALL_RANGE[cell.y]
            } else if (isLongRange) {
                priority = BattleField._LONG_RANGE[cell.y]
            } else {
                priority = BattleField._SHORT_RANGE[cell.y]
            }

            // 射程内の標的を抽出する
            let targets = []
            for (let i = 0; i < priority.length; i++) {
                // RED->BLUE陣営の攻撃は、優先順位テーブルを降順で見る(上に位置する対象が優先する)
                // BLUE->RED陣営の攻撃は、優先順位テーブルを昇順で見る(下に位置する対象が優先する)
                const index = cell.faction == Faction.BLUE ? priority.length - i - 1 : i
                const target = Cell.fromIndex(index)
                const creature = this.get(target)

                // 射程に関わらず敵を取得する
                if (cell.faction != target.faction && creature) {
                    targets.push(new BattleTarget({
                        cell: target,
                        targetPriority: priority[index],
                        cellPriority: BattleField._DEFAULT_PRIORITY[index],
                        creature
                    }))
                }
            }

            // ここでtargetsには優先順位順になった敵が格納されている
            // 元実装ではここから、盤面上に実在する最も近い敵の優先度(nearestPriority)を求め、
            // 射程3以上(またはFreeMove)の攻撃は実効射程にnearestPriority分をそのまま加算し、
            // それ未満の近接攻撃は最も近いランクの敵のみを対象にする
            let targetsInRange = []
            const baseRange = cell.faction == Faction.BLUE
                ? range - (cell.x - 3)
                : range - (2 - cell.x)
            if (baseRange > 0 && targets.length > 0) {
                const nearestPriority = Math.min(...targets.map(x => x.targetPriority))
                if (range >= 3) {
                    // 中〜遠距離: 最も近い敵までの距離をそのまま実効射程に加算する(対象の種別は問わない)
                    const effectiveRange = baseRange + nearestPriority - 1
                    targetsInRange = targets.filter(x => x.targetPriority <= effectiveRange)
                } else {
                    // 近接: 最も近いランクの敵のみが対象になる
                    targetsInRange = targets.filter(x => x.targetPriority == nearestPriority)
                }
            }

            if (targetsInRange.length > 0) {
                const highTarget = creature.schema.skills.has(Skill.HIGH_TARGET)
                if (weapon.targeting == Targeting.WIDE) {
                    // 広域は対象の優先度と同じく、X座標が同じものが対象となる
                    const primaryTarget = [...targetsInRange]
                        .sort((a, b) => a.compareShortRange(b, { highTarget }))[0]
                    targetsInRange = targets.filter(t => t.cell.x == primaryTarget.cell.x)
                } else if (weapon.targeting == Targeting.PENETRATE) {
                    // 貫通は対象の優先度と同じく、Y座標が同じものが対象となる
                    const primaryTarget = [...targetsInRange]
                        .sort((a, b) => a.compareShortRange(b, { highTarget }))[0]
                    targetsInRange = targets.filter(t => t.cell.y == primaryTarget.cell.y)
                } else if (weapon.targeting == Targeting.ANTI_GROUND) {
                    // 対地広域は全体が対象となる
                } else if (weapon.targeting == Targeting.ANTI_AIR) {
                    // 対空貫通は全体が対象となる
                } else if (isLongRange) {
                    targetsInRange = [...targetsInRange]
                        .sort((a, b) => a.compareLongRange(b, { highTarget })).slice(0, 1)
                } else {
                    targetsInRange = [...targetsInRange]
                        .sort((a, b) => a.compareShortRange(b, { highTarget })).slice(0, 1)
                }
            }

            return targetsInRange
        }

        /**
        * @returns {string}
        */
        toString() {
            return `<${this.constructor.name}: ${this.cells}>`
        }
    }

    /**
    * 戦闘の行動順を判定するオブジェクト。
    */
    class BattleQueue {
        /**
        * @param {Object} args
        * @param {Cell} args.cell
        * @param {Creature} args.creature
        */
        constructor({ cell, creature }) {
            this.cell = cell
            this.creature = creature
        }

        /**
        * 攻撃順を決定するための比較関数。
        * @param {BattleQueue} other
        * @returns {number}
        */
        compare(other) {
            if (this.creature.schema.speed == other.creature.schema.speed) {
                return this.cell.priority - other.cell.priority
            }
            return other.creature.schema.speed - this.creature.schema.speed
        }
    }

    /**
    * 戦闘状態を表すオブジェクト。
    */
    class BattleState {
        static INITIALIZED = new BattleState(0)
        static READY = new BattleState(1)
        static RESOLVING = new BattleState(2)
        static WIN = new BattleState(3)
        static LOSE = new BattleState(4)

        /**
        * @param {number} value
        */
        constructor(value) {
            this.value = value
        }

        /**
        * @returns {string}
        */
        get name() {
            return new Map([
                [BattleState.INITIALIZED, '初期化'],
                [BattleState.READY, '戦闘準備'],
                [BattleState.RESOLVING, '戦闘中'],
                [BattleState.WIN, '勝利'],
                [BattleState.LOSE, '敗北']
            ]).get(this)
        }

        /**
        * @returns {string}
        */
        toString() {
            return this.name
        }
    }

    /**
    * 攻撃対象を探索するためのオブジェクト。
    */
    class BattleTarget {
        /**
        * @param {Object} args
        * @param {Cell} args.cell
        * @param {number} args.targetPriority
        * @param {number} args.cellPriority
        * @param {Creature} args.creature
        */
        constructor({ cell, targetPriority, cellPriority, creature }) {
            this.cell = cell
            this.targetPriority = targetPriority
            this.cellPriority = cellPriority
            this.creature = creature
        }

        /**
        * 近接攻撃の攻撃対象の優先順位を決定するための比較関数。
        * @param {BattleTarget} other
        * @param {Object} options
        * @param {boolean} options.highTarget
        * @returns {number}
        */
        compareShortRange(other, { highTarget = false } = {}) {
            if (this.targetPriority == other.targetPriority) {
                if (this.creature.hp == other.creature.hp) {
                    return this.cellPriority - other.cellPriority
                }
                return (this.creature.hp - other.creature.hp) * (highTarget ? -1 : 1)
            }
            return this.targetPriority - other.targetPriority
        }

        /**
        * 遠距離攻撃の攻撃対象の優先順位を決定するための比較関数。
        * @param {BattleTarget} other
        * @param {Object} options
        * @param {boolean} options.highTarget
        * @returns {number}
        */
        compareLongRange(other, { highTarget = false } = {}) {
            if (this.creature.hp == other.creature.hp) {
                if (this.targetPriority == other.targetPriority) {
                    return this.cellPriority - other.cellPriority
                }
                return this.targetPriority - other.targetPriority
            }
            return (this.creature.hp - other.creature.hp) * (highTarget ? -1 : 1)
        }
    }

    /**
    * 2D座標を表現するオブジェクト。
    */
    class Cell {
        /**
        * 座標(x, y)を指定してインスタンスを生成する。
        * @param {number} x
        * @param {number} y
        */
        constructor(x, y) {
            if (!Cell.isValid(x, y)) {
                throw new Error(`不正な座標です: (${x}, ${y})`)
            }
            this.x = x
            this.y = y
        }

        /**
        * 一次元上のインデックスからインスタンスを生成する。
        * @returns {Cell}
        */
        static fromIndex(index) {
            if (!(0 <= index && index <= 17)) {
                throw new Error(`不正なインデックスです: ${index}`)
            }
            return new Cell(index % 6 | 0, index / 6 | 0)
        }

        /**
        * 指定した陣営のランダムな座標を返す。
        * @param {Faction} faction
        * @returns {Cell}
        */
        static random(faction) {
            const index = Math.random() * 9 | 0
            return Cell.with(faction, index % 3 | 0, index / 3 | 0)
        }

        /**
        * 指定した陣営の重複なしのランダムな座標を返す。
        * @param {Faction} faction
        * @param {number} n
        * @returns {Cell[]}
        */
        static samples(faction, n) {
            return (0).rangeExclusive(9).sort(_ => Math.random() - 0.5)
                .slice(0, n)
                .map(index => Cell.with(faction, index % 3 | 0, index / 3 | 0))
        }

        /**
        * 与えられた座標が正しい範囲に収まっているか返す。
        * @param {number} x
        * @param {number} y
        * @returns {boolean}
        */
        static isValid(x, y) {
            return (0 <= x && x <= 5) && (0 <= y && y <= 2)
        }

        /**
        * 陣営と3x3の座標からインスタンスを生成する。
        * @param {Faction} faction
        * @param {number} x
        * @param {number} y
        */
        static with(faction, x, y) {
            if (!(0 <= x && x <= 2) || !(0 <= y && y <= 2)) {
                throw new Error(`不正な座標です: (${x}, ${y})`)
            }
            if (faction == Faction.BLUE) {
                return new Cell(x + 3, y)
            } else if (faction == Faction.RED) {
                return new Cell(x, y)
            }
            throw new Error(`不正な陣営です: ${faction}`)
        }

        /**
        * ソート用の比較関数。
        * @param {Cell} other
        * @returns {number}
        */
        compare(other) {
            if (this.x == other.x) {
                return this.y - other.y
            }
            return this.x - other.x
        }

        /**
        * 陣営を返す。
        * @returns {Faction}
        */
        get faction() {
            return this.x < 3 ? Faction.RED : Faction.BLUE
        }

        /**
        * 一次元上のインデックスを返す。
        * @returns {number}
        */
        get index() {
            return this.x + this.y * 6
        }

        /**
        * セルの優先順位を返す。
        * @returns {number}
        */
        get priority() {
            return [
                17, 11, 5, 1, 7, 13,
                15,  9, 3, 0, 6, 12,
                16, 10, 4, 2, 8, 14
            ][this.index]
        }

        /**
        * クローンを返す。
        * @returns {Cell}
        */
        clone() {
            return new Cell(this.x, this.y)
        }

        /**
        * マンハッタン距離を返す。
        * @param {Cell}
        * @returns {number}
        */
        distance(other) {
            return Math.abs(this.x - other.x) + Math.abs(this.y - other.y)
        }

        /**
        * @returns {string}
        */
        toString() {
            return `(${this.x}, ${this.y})`
        }
    }

    /**
    * クリーチャーのオブジェクト。
    */
    class Creature {
        /**
        * @param {CreatureId} creatureId
        * @param {Object} options
        * @param {?number} options.entityId
        * @param {?number} options.hp
        * @param {?Set<Effect>} options.effects
        */
        constructor(creatureId, { entityId, hp, effects } = {}) {
            this.creatureId = creatureId
            this.entityId = entityId ?? EntityId.next()
            this.schema = CreatureSchema.get(creatureId)
            this.hp = hp ?? this.schema.hp
            this.effects = effects ?? new Set()
        }

        /**
        * クリーチャーを新規作成する。
        * @param {Creature} creatureId
        * @param {Object} options
        * @param {number} options.entityId
        * @returns {Creature}
        */
        static create(creatureId, { entityId } = {}) {
            return new Creature(creatureId, { entityId })
        }

        /**
        * 攻撃回数を返す。
        * @returns {number}
        */
        get attacks() {
            if (!this.canAttack) {
                return 0
            } else if (this.schema.weaponId == WeaponId.NONE) {
                return 0
            } else if (this.schema.skills.has(Skill.ATTACK_6)) {
                return 6
            } else if (this.schema.skills.has(Skill.ATTACK_3)) {
                return 3
            } else if (this.schema.weapon().weaponId == WeaponId.THREE_HEAD) {
                return 3
            } else if (this.schema.skills.has(Skill.ATTACK_2)) {
                return 2
            }
            return 1
        }

        /**
        * クリーチャーが攻撃できるか返す。
        * @returns {boolean}
        */
        get canAttack() {
            return this.isAlive
                && !(this.effects.has(Effect.SLOW) || this.effects.has(Effect.STUN))
        }

        /**
        * クリーチャーが生存しているか返す。
        * @returns {boolean}
        */
        get isAlive() {
            return !this.isDead
        }

        /**
        * クリーチャーが死亡してるか返す。
        * @returns {boolean}
        */
        get isDead() {
            return this.hp <= 0
                //| this.effects.has(Effect.PARALYZE)
                || this.effects.has(Effect.STONE)
        }

        /**
        * クリーチャー名を返す。
        * @returns {string}
        */
        get name() {
            return this.creatureId.toString()
        }

        /**
        * クローンを返す。
        * @param {Object} options
        * @param {boolean} options.exact
        * @returns {Creature}
        */
        clone({ exact = false } = {}) {
            return new Creature(this.creatureId, {
                entityId: exact ? this.entityId : EntityId.next(),
                hp: this.hp,
                effects: new Set([...this.effects])
            })
        }

        /**
        * 状態異常に対する耐性を持っているか返す。
        * @param {Effect} effect
        */
        hasResist(effect) {
            if (this.schema.traits.has(Trait.NERVELESS)) {
                return [
                    Effect.POISON,
                    Effect.CURSE,
                    Effect.PARALYZE,
                    Effect.STONE
                ].includes(effect)
            } else if (this.schema.traits.has(Trait.LARGE)) {
                // 元実装ではChBody(定数)への添字アクセスというバグにより
                // SLOW・STUNへの耐性は一度も機能していなかった(PARALYZE・STONEはバグの影響を受けていない)
                // 本実装ではその実際の挙動を踏襲し、SLOW・STUNは耐性に含めない
                return [
                    Effect.PARALYZE,
                    Effect.STONE
                ].includes(effect)
            }
            return false
        }

        /**
        * 完全に治療する。
        * @returns {number}
        */
        heal() {
            this.hp = this.schema.hp
            this.effects.clear()
        }

        /**
        * 治療に必要なgpを返す。
        * @returns {number}
        */
        healCost() {
            return this.schema.hp - Math.max(this.hp, 0)
        }

        /**
        * @returns {string}
        */
        toString() {
            return `<${this.constructor.name}: { `
                + `creatureId: ${this.creatureId}, `
                + `entityId: ${this.entityId}, `
                + `hp: ${this.hp}, `
                + `effects: ${this.effects} `
                + `}>`
        }
    }

    /**
    * クリーチャーIDのオブジェクト。
    */
    class CreatureId {
        /**
        * @param {string} value
        */
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

    /**
    * クリーチャーの基本情報のオブジェクト。
    */
    class CreatureSchema {
        /**
        * @type {CreatureSchema[]}
        */
        static values = []

        /**
        * @param {CreatureId} creatureId
        * @param {number} hp
        * @param {WeaponId} weaponId
        * @param {ArmorId} armorId
        * @param {number} speed
        * @param {Object} options
        * @param {number} options.size
        * @param {?Set<Skill>} options.skills
        * @param {?Set<Trait>} options.traits
        * @param {?string} options.message
        * @param {?string} options.description
        */
        constructor(creatureId, hp, weaponId, armorId, speed, {
            size = null,
            skills = null,
            traits = null,
            message = null,
            description = null
        } = {}) {
            this.creatureId = creatureId
            this.hp = hp
            this.weaponId = weaponId
            this.armorId = armorId
            this.speed = speed
            this.size = size ?? 1
            this.skills = skills ?? new Set()
            this.traits = traits ?? new Set()
            this.message = message ?? ''
            this.description = description ?? ''
        }

        /**
        * クリーチャー定義を返す。
        * @param {CreatureId} creatureId
        */
        static get(creatureId) {
            const schema = this.values.find(x => x.creatureId == creatureId)
            if (schema) {
                return schema
            }
            throw new Error(`クリーチャー定義が見つかりません: ${creatureId}`)
        }

        /**
        * 攻撃時のメッセージを返す。
        * @returns {string}
        */
        get attackMessage() {
            return this.message.replace('{name}', this.creatureId.toString())
        }

        /**
        * 名前を返す。
        * @returns {string}
        */
        get name() {
            return this.creatureId.toString()
        }

        /**
        * 防具を返す。
        * @returns {Armor}
        */
        armor() {
            return Armor.get(this.armorId)
        }

        /**
        * 武器を返す。
        * @param {Object} options
        * @param {?number} options.chimera
        * @returns {Weapon}
        */
        weapon({ chimera } = {}) {
            return Weapon.get(this.weaponId, { chimera })
        }
    }

    /**
    * ダメージを表現するオブジェクト。ダメージ値・ダメージ種別・属性を持つ。
    */
    class Damage {
        /**
        * @param {Object} args
        * @param {number} value
        * @param {DamageKind} kind
        * @param {?Element} element
        */
        constructor(value, kind, element = null) {
            if (kind == DamageKind.ELEMENTAL && !element) {
                throw new Error(`属性ダメージでは属性の指定が必要です: ${element}`)
            }
            this.value = value
            this.kind = kind
            this.element = kind == DamageKind.ELEMENTAL ? element : null
        }

        /**
        * クローンを返す。
        * @param {Object} options
        * @param {?number} options.value
        * @param {?DamageKind} options.kind
        * @param {?Element} options.element
        * @returns {Damage}
        */
        clone({ value, kind, element } = {}) {
            return new Damage(
                value ?? this.value,
                kind ?? this.kind,
                element ?? this.element
            )
        }

        /**
        * @returns {string}
        */
        toString() {
            return `<${this.constructor.name}: { `
                + `value: ${this.value}, `
                + `kind: ${this.kind}, `
                + `element: ${this.element} `
                + `}>`
        }
    }

    /**
    * ダメージ種別のオブジェクト。
    * 物理・魔法・エネルギー属性の三種類となる。
    */
    class DamageKind {
        static MATERIAL = new DamageKind(0)
        static MAGICAL = new DamageKind(1)
        static ELEMENTAL = new DamageKind(2)

        /**
        * @param {number} value
        */
        constructor(value) {
            this.value = value
        }

        /**
        * 攻撃種別名を返す。
        */
        get name() {
            return new Map([
                [DamageKind.MATERIAL, '物理'],
                [DamageKind.MAGICAL, '魔法'],
                [DamageKind.ELEMENTAL, '属性']
            ]).get(this)
        }

        /**
        * @returns {string}
        */
        toString() {
            return this.name
        }
    }

    /**
    * 戦闘中の一時的効果種別のオブジェクト。
    */
    class Effect {
        // 攻撃力が50%になる
        static CURSE = new Effect(1);

        // FIXME: 元のコードでも未実装
        static DISEASE = new Effect(2);

        // 麻痺で戦闘不能(死亡)
        static PARALYZE = new Effect(3);

        // 毒で毎ターン行動前に最大Hpの20%のダメージを受ける
        static POISON = new Effect(4)

        // ターン内行動不能
        static SLOW = new Effect(5);

        // 石化で戦闘不能(死亡)
        static STONE = new Effect(6);

        // ターン内行動不能
        static STUN = new Effect(7);

        /**
        * @param {number} value
        */
        constructor(value) {
            this.value = value
        }

        /**
        * @returns {string}
        */
        get name() {
            return new Map([
                [Effect.CURSE, '呪縛'],
                [Effect.DISEASE, '病気'],
                [Effect.PARALYZE, '麻痺'],
                [Effect.POISON, '毒'],
                [Effect.SLOW, '鈍化'],
                [Effect.STONE, '石化'],
                [Effect.STUN, '朦朧'],
            ]).get(this)
        }

        /**
        * @returns {string}
        */
        toString() {
            return this.name
        }

        /**
        * 一時的効果を受けたときのメッセージを返す。
        * @param {string} name
        * @returns {string}
        */
        message(name) {
            return new Map([
                [Effect.CURSE, '{name}は生気を失った。'],
                [Effect.DISEASE, '{name}は病気になった。'],
                [Effect.PARALYZE, '{name}は全身が麻痺した！'],
                [Effect.POISON, '{name}は毒に犯された。'],
                [Effect.SLOW, '{name}は糸に絡め取られた。'],
                [Effect.STONE, '{name}はは石化した！'],
                [Effect.STUN, '{name}は朦朧としている。'],
            ]).get(this)?.replace('{name}', name)
        }
    }

    /**
    * エネルギー属性を表すオブジェクト。
    * 火・風・水・地・心で循環する。
    */
    class Element {
        static FIRE = new Element(0)
        static AIR = new Element(1)
        static WATER = new Element(2)
        static EARTH = new Element(3)
        static MIND = new Element(4)

        static values = Object.freeze([
            Element.FIRE,
            Element.AIR,
            Element.WATER,
            Element.EARTH,
            Element.MIND
        ])

        /**
        * @param {number} value
        */
        constructor(value) {
            this.value = value
        }

        /**
        * 属性名を返す。
        * @returns {string}
        */
        get name() {
            return new Map([
                [Element.FIRE, '火'],
                [Element.AIR, '風'],
                [Element.WATER, '水'],
                [Element.EARTH, '地'],
                [Element.MIND, '心'],
            ]).get(this)
        }

        /**
        * 属性名を返す。
        * @returns {string}
        */
        toString() {
            return this.name
        }

        /**
        * @returns {number}
        */
        valueOf() {
            return this.value
        }

        /**
        * 属性から属性の正方向の距離を返す。水->火は3, 心->火は1となる。
        * @param {Element} other
        * @returns {number}
        */
        distanceFrom(other) {
            const diff = this.valueOf() - other.valueOf()
            return (diff + Element.values.length) % Element.values.length
        }
    }

    /**
    * 個々のクリーチャーを一意に識別するエンティティIDを払い出すオブジェクト。
    */
    class EntityId {
        static _value = 100

        /**
        * 新しいエンティティIDを返す。
        * @returns {number}
        */
        static next() {
            return this._value++
        }

        /**
        * エンティティIDのシード値を変更する。
        * @param {number} value
        */
        static seed(value) {
            this._value = value
        }
    }

    /**
    * 陣営を表現するオブジェクト。
    * Blue(プレイヤー側)とRed(CPU側)のふたつが存在する。
    */
    class Faction {
        static BLUE = new Faction(0)
        static RED = new Faction(1)

        /**
        * @type {Faction[]}
        */
        static values = Object.freeze([Faction.BLUE, Faction.RED])

        /**
        * @type {Map<Faction, {x: number, y: number}[]>}
        */
        static _PATHS = new Map([
            [Faction.BLUE, [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: -1, y: 0 }]],
            [Faction.RED, [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 0 }]]
        ])

        /**
        * @param {number} value
        */
        constructor(value) {
            this.value = value
        }

        /**
        * @param {Faction}
        * @returns {{x: number, y: number, distance: number}[]}
        */
        static paths(faction) {
            return this._PATHS.get(faction)
        }

        /**
        * 陣営名を返す。
        * @returns {string}
        */
        get name() {
            return new Map([
                [Faction.BLUE, 'Blue'],
                [Faction.RED, 'Red']
            ]).get(this)
        }

        /**
        * @returns {string}
        */
        toString() {
            return this.name
        }
    }

    /**
    * フィールドパワーを管理するオブジェクト。
    */
    class FieldPower {
        /**
        * 属性距離ごとのフィールドパワー加算倍率。
        * @type {number[]}
        */
        static _DAMAGE_MULTIPLIER = [1.0, 2.0, 4.0, 0.0, 0.5]

        /**
        * @param {Element} element
        * @param {Object} options
        * @param {number} options.value
        */
        constructor(element, { value = 0 } = {}) {
            this.element = element
            this.value = value
        }

        /**
        * クローンを返す。
        * @param {Object} options
        * @param {?Element} options.element
        * @param {?number} options.value
        * @returns {FieldPower}
        */
        clone({ element, value } = {}) {
            return new FieldPower(element ?? this.element, { value: value ?? this.value })
        }

        /**
        * @returns {string}
        */
        toString() {
            return `<${this.constructor.name}: { element: ${this.element}, value: ${this.value} }>`
        }

        /**
        * フィールドパワーで強化したダメージを返す。
        * @param {Damage} damage
        * @returns {Damage}
        */
        updatedDamage(damage) {
            if (damage.kind == DamageKind.ELEMENTAL) {
                const distance = damage.element.distanceFrom(this.element)
                const damageBonus = this.value * FieldPower._DAMAGE_MULTIPLIER[distance]
                return damage.clone({ value: damage.value + damageBonus })
            }
            return damage.clone()
        }

        /**
        * ダメージで増幅・リセットされたフィールドパワーを返す。
        * フィールドパワーと異なる属性攻撃が発生すると、フィールドパワーはその属性に切り替わる。
        * @param {Damage} damage
        * @returns {FieldPower}
        */
        updatedPower(damage) {
            if (damage.kind == DamageKind.ELEMENTAL) {
                const distance = damage.element.distanceFrom(this.element)
                return this.clone({
                    element: damage.element,
                    value: this.value * FieldPower._DAMAGE_MULTIPLIER[distance]
                        + damage.value * FieldPower._DAMAGE_MULTIPLIER[distance] / 10
                })
            }
            return this.clone()
        }
    }

    /**
    * 戦闘ログのオブジェクト。
    */
    class Log {
        /**
        * @param {Object} options
        * @param {number} options.turn
        * @param {string} options.message
        * @param {?Cell} options.attacker
        * @param {?Cell} options.defender
        */
        constructor({ turn, message, attacker, defender } = {}) {
            this.turn = turn
            this.message = message
            this.attacker = attacker
            this.defender = defender
        }

        /**
        * @returns {string}
        */
        toString() {
            return `<${this.constructor.name}: { `
                + `turn: ${this.turn}, `
                + `message: ${this.message}, `
                + `attacker: ${this.attacker}, `
                + `defender: ${this.defender} `
                + `}>`
        }
    }

    /**
    * クリーチャーのスキル種別のオブジェクト。
    */
    class Skill {
        static FREE_MOVE = new Skill(1)
        static ATTACK_2 = new Skill(2)
        static ATTACK_3 = new Skill(3)
        static HIGH_TARGET = new Skill(4)
        static ATTACK_6 = new Skill(5)

        /**
        * @param {number} value
        */
        constructor(value) {
            this.value = value
        }

        /**
        * スキル名称を返す。
        * @returns {string}
        */
        get name() {
            return new Map([
                [Skill.FREE_MOVE, '中距離攻撃'],
                [Skill.ATTACK_2, '2回攻撃'],
                [Skill.ATTACK_3, '3回攻撃'],
                [Skill.HIGH_TARGET, 'HPが高い敵を攻撃'],
                [Skill.ATTACK_6, '6回攻撃'],
            ]).get(this)
        }

        /**
        * @returns {string}
        */
        toString() {
            return this.name
        }
    }

    /**
    * 攻撃対象種別のオブジェクト。それぞれは競合しない。
    */
    class Targeting {
        static LONG_RANGE = new Targeting(1)
        static WIDE = new Targeting(2)
        static PENETRATE = new Targeting(3)
        static ANTI_GROUND = new Targeting(4)
        static ANTI_AIR = new Targeting(5)
        static THREE_HEAD = new Targeting(6)

        /**
        * @param {number} value
        */
        constructor(value) {
            this.value = value
        }

        /**
        * 攻撃対象種別名を返す。
        * @returns {string}
        */
        get name() {
            return new Map([
                [Targeting.LONG_RANGE, '遠距離'],
                [Targeting.WIDE, '広域'],
                [Targeting.PENETRATE, '貫通'],
                [Targeting.ANTI_GROUND, '対地広域'],
                [Targeting.ANTI_AIR, '対空貫通'],
                [Targeting.THREE_HEAD, '三連撃'],
            ]).get(this)
        }

        /**
        * @returns {string}
        */
        toString() {
            return this.name
        }
    }

    /**
    * クリーチャー特性種別のオブジェクト。
    */
    class Trait {
        static NERVELESS = new Trait(1)
        static LARGE = new Trait(2)
        static FLYING = new Trait(3)

        /**
        * @param {number} value
        */
        constructor(value) {
            this.value = value
        }

        /**
        * 特性名を返す。
        * @returns {string}
        */
        get name() {
            return new Map([
                [Trait.NERVELESS, '無神経生物'],
                [Trait.LARGE, '大型'],
                [Trait.FLYING, '飛行'],
            ]).get(this)
        }

        /**
        * @returns {string}
        */
        toString() {
            return this.name
        }
    }

    /**
    * 武器のオブジェクト。
    */
    class Weapon {
        /**
        * @type {Weapon[]}
        */
        static values = []

        /**
        * @param {WeaponId} weaponId
        * @param {string} name
        * @param {number} range
        * @param {Damage} damage
        * @param {Object} options
        * @param {?Targeting} options.targeting
        * @param {?Set<Effect>} options.effects
        */
        constructor(weaponId, name, range, damage, { targeting, effects } = {}) {
            this.weaponId = weaponId
            this.name = name
            this.range = range
            this.damage = damage
            this.targeting = targeting
            this.effects = effects ?? new Set()
        }

        /**
        * 武器を返す。
        * @param {WeaponId} weaponId
        * @param {Object} options
        * @param {number} options.chimera
        */
        static get(weaponId, { chimera } = {}) {
            // ChimeraのTHREE_HEADは実際に使われることはなく、
            // それぞれFIRE_BREATHE, DESTRUCTION, KILLER_FANGの三連撃となる
            if (weaponId == WeaponId.THREE_HEAD && chimera != null) {
                weaponId = [
                    WeaponId.FIRE_BREATHE,
                    WeaponId.DESTRUCTION,
                    WeaponId.KILLER_FANG
                ][chimera]
            }

            const weapon = this.values.find(x => x.weaponId == weaponId)
            if (weapon) {
                return weapon
            }
            throw new Error(`武器が見つかりません: ${weaponId}`)
        }

        /**
        * @returns {string}
        */
        toString() {
            return `<${this.constructor.name}: { `
                + `weaponId: ${this.weaponId}, `
                + `name: ${this.name}, `
                + `range: ${this.range}, `
                + `damage: ${this.damage}, `
                + `targeting: ${this.targeting}, `
                + `effects: ${this.effects} `
                + `}>`
        }
    }

    /**
    * 武器ID。
    */
    class WeaponId {
        /**
        * @param {string} value
        */
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

    root.EchoRuler = {
        Armor,
        ArmorId,
        Battle,
        BattleField,
        BattleQueue,
        BattleState,
        Cell,
        Creature,
        CreatureId,
        CreatureSchema,
        Damage,
        DamageKind,
        Effect,
        Element,
        EntityId,
        Faction,
        FieldPower,
        Log,
        Skill,
        Targeting,
        Trait,
        Weapon,
        WeaponId
    }
})(globalThis)
