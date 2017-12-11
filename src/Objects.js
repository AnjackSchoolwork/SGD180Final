
/*
* Entity class
* Base class for enemies and NPCs
* All entites have sprites and (x, y) coordinates
* Sprite image should already be loaded in startup.js
*/
class Entity {
	/*
	* Creates a new instance of Entity, with sprite using the specified image
	* at the specified coordinates.
	* 
	* @param {object}	game	- Phaser.Game object
	* @param {int}		x		- X coordinate of entity
	* @param {int}		y		- Y coordinate of entity
	* @param {string}	image	- (Phaser) ID of image to use for sprite
	*/
	constructor(game, group, x, y, image) {
		// Sprite
		this.sprite = group.create(x, y, image)
		this.sprite.entity = this
		this.sprite.anchor.set(0.5, 1)

		// Initialize properties
		this.health = 100


		// Load SFX
		this.hurt_sound = game.add.audio('Hit')
	}

	get health() {
		return this._health
	}

	set health(new_value) {
		this._health = new_value
	}

	

	/*
	* Anything that deals damage to this entity should use this method to do so.
	* 
	* @param {string}	dmg_type	- Name of the type of damage being dealt.
	* @param {number}	dmg_amt		- Amount of damage in points.
	*/
	handleDamage(dmg_type, dmg_amt) {
		this.displayDamageEffect()
		this.health -= dmg_amt
		this.hurt_sound.play()
	}

	/*
	* Flash the sprite red to show that we took damage.
	*/
	displayDamageEffect() {
		this.sprite.tint = 0xff4444
		setTimeout(function (p_sprite) {
			p_sprite.tint = 0xFFFFFF

			// Calling it here to ensure damage is visible before sprite is killed
			p_sprite.entity.dieIfDead()
		}, 100, this.sprite)
	}

	// Did you die?
	dieIfDead() {
		if (this.health <= 0) {
			this.destroy()
		}
	}

	// Remove references to this object
	destroy() {
		this.sprite.destroy()
	}

	/*
	* This is the entry point for Entity AI.
	* This calls detection and action functions.
	* 
	* @param {object}	game	- Reference to Phaser.Game object
	* @param {object}	map		- Reference to tilemap object
	* @param {object}	player	- Reference to player object
	*/
	think(game, map, player) {
	}
}

class MobileEntity extends Entity {
	constructor(game, group, x, y, image) {
		super(game, group, x, y, image)

		this.base_speed = 75

		// Start in motion, with gravity
		this.is_moving = true
		this.sprite.body.gravity.y = 1600
		this.sprite.body.velocity.x = this.base_speed
		this.sprite.body.immovable = true
	}


	get is_moving() {
		return this._is_moving
	}

	set is_moving(new_value) {
		this._is_moving = new_value
	}

	get speed() {
		return this._base_speed
	}

	set speed(new_value) {
		this._base_speed = new_value
	}

	set velocity_x(new_velocity) {
		this.sprite.body.velocity.x = new_velocity
	}

	set velocity_y(new_velocity) {
		this.sprite.body.velocity.y = new_velocity
	}

	goLeft() {
		this.velocity_x = (-1 * this.base_speed)
	}

	goRight() {
		this.velocity_x = this.base_speed
	}

	/*
	* Checks for a tile at the bottom-right corner of this entity's sprite.
	* Reverses direction if no tile is found.
	* 
	* @param {object}	map		- Reference to the collision tilemap
	*/
	edgeCheck(map) {
		// Direction indicator will be negative if we are moving left. Positive otherwise.
		var direction_indicator = this.sprite.body.velocity.x / Math.abs(this.sprite.body.velocity.x)
		// This will subtract half of the width if direction_indicator is negative or add otherwise.
		if (map.getTileWorldXY(this.sprite.x + ((this.sprite.width / 2) * direction_indicator), this.sprite.y) == null) {
			// Reverse the sign of the velocity to maintain speed in opposite direction.
			this.sprite.body.velocity.x *= -1
		}
	}

	wallCheck() {
		if (this.sprite.body.blocked.left) {
			this.sprite.body.velocity.x = this.base_speed
		}
		if (this.sprite.body.blocked.right) {
			this.sprite.body.velocity.x = -1 * this.base_speed
		}
	}

	// TODO: Make this generic
	selectAnimation() {
		if (this.sprite.body.velocity.x > 0) {
			this.sprite.animations.play("walk_right")
		}
		else if (this.sprite.body.velocity.x < 0) {
			this.sprite.animations.play("walk_left")
		}
		else {
			this.sprite.animations.play("idle")
		}
	}

	/*
	* This is the entry point for Entity AI.
	* This calls detection and action functions.
	* 
	* @param {object}	game	- Reference to Phaser.Game object
	* @param {object}	map		- Reference to tilemap object
	* @param {object}	player	- Reference to player object
	*/
	think(game, map, player) {
		// Walkies
		this.edgeCheck(map)
		this.wallCheck()
		this.selectAnimation()
	}
}

/*
*/
class Player {
	constructor(game, x, y, image) {

		// Reference to Phaser.Game object
		this.game = game

		// Build sprite
		this.sprite = game.add.sprite(x, y, image)
		this.sprite.entity = this
		this.sprite.anchor.set(0.5, 1)
		game.physics.arcade.enable(this.sprite)
		this.sprite.body.gravity.y = 1600
		this.sprite.body.maxVelocity = 100

		// Initialize variables
		this.health = 100
		this.base_speed = 250
		this.jump_impulse = 700
		this.fire_rate = 300 // Miliseconds
		this.last_fired = Date.now()
		this.fired_bullets = {}

		// Hook events
		game.input.onDown.add(this.click_handler, this, 0, game)
		game.input.onUp.add(this.unShoot)

		// Inventory

		// Keys carried by player
		this.key_ring = []

		// Load SFX
		this.hurt_sound = this.game.add.audio('Hit')
		this.shoot_sound = this.game.add.audio('Shoot')
		this.jump_sound = this.game.add.audio('Jump')

		// In case we fall out of the map due to Phaser's "superb" physics engine
		this.sprite.checkWorldBounds = true
		this.sprite.events.onOutOfBounds.add(function () {
			this.health = 0
			this.dieIfDead()
		}, this)
	}

	get x() {
		return this.sprite.x
	}

	get y() {
		return this.sprite.y
	}

	get health() {
		return this._health
	}

	set health(new_value) {
		this._health = new_value
	}

	get speed() {
		return this._base_speed
	}

	set speed(new_value) {
		this._speed = new_value
	}

	// Move the player
	set velocity_x(new_velocity) {
		this.sprite.body.velocity.x = new_velocity
	}

	set velocity_y(new_velocity) {
		this.sprite.body.velocity.y = new_velocity
	}

	goLeft() {
		this.velocity_x = (-1 * this.base_speed)
	}

	goRight() {
		this.velocity_x = this.base_speed
	}

	jump() {
		this.velocity_y = (-1 * this.jump_impulse)
		this.jump_sound.play()
	}

	/*
	* Flash the sprite red to show that we took damage.
	*/
	displayDamageEffect() {
		this.sprite.tint = 0xff4444
		setTimeout(function (p_sprite) {
			p_sprite.tint = 0xFFFFFF

			// Calling it here to ensure damage is visible before sprite is killed
			p_sprite.entity.dieIfDead()
		}, 100, this.sprite)
	}

	// TODO: Figure out why x movement isn't happening
	flinch(from_entity) {
		this.displayDamageEffect()
		if (this.sprite.x > from_entity.x) {
			this.sprite.body.velocity = new Phaser.Point(1000, -150)
		}
		else {
			this.sprite.body.velocity = new Phaser.Point(-1000, -150)
		}
		this.hurt_sound.play()
	}

	// Mouse
	click_handler(pointer, pointer_event, game) {
		this.shoot(game)
	}

	// Weapon controls
	shoot(game) {
		if (!this.firing) {
			this.fireBullet(game)
			this.shoot_sound.play()
		}
	}

	unShoot(game) {
		player.firing = false
	}

	/*
	* Creates a bullet sprite and sets its rotation and velocity.
	* @param {object}	game		- Reference to Phaser.Game object
	* @param {number}	target_x	- X-coordinate of target
	* @param {number}	target_y	- Y-coordinate of target
	* @param {string}	type		- Type of ammo to fire
	*/
	fireBullet(game) {
		// TODO: Make bullet source (x, y) dynamic
		var temp_bullet = this.fired_bullets.create(this.x, this.y - (this.sprite.height / 2), 'test_bullet')
		temp_bullet.anchor.set(0.5, 0.5)
		temp_bullet.rotation = game.physics.arcade.angleToPointer(temp_bullet)
		game.physics.arcade.moveToPointer(temp_bullet, 700)
		this.firing = true
	}

	handleDamage(type, amount) {
		this.health -= amount
		this.dieIfDead()
	}

	dieIfDead() {
		if (this.health <= 0) {
			this.sprite.kill()
			this.game.state.start('Game Over', true, false, this.game.controls, "You died.")
		}
	}
}

class PickUp extends Entity{
	constructor(game, group, x, y, image) {
		super(game, group, x, y, image)
		
	}

}

/*
* This will handle the basic user interface.
*/
class GameUI {
	constructor(game, player) {
		this.game = game
		this.player = player

		var x = this.game.camera.x
		var y = this.game.camera.y

		this.graphics = this.game.add.graphics(x, y)
		// This makes the drawn objects follow the camera
		this.graphics.fixedToCamera = true

		this.text_style = {
			fontSize: '24px',
			fill: '#fff',
			boundsAlignH: 'center',
			boundsAlignV: 'middle'
		}

		this.graphics.beginFill(0x000000, 1)
		this.graphics.drawRect(x, y, 200, 40)
		this.graphics.endFill()

		this.health_label = this.game.add.text(0, 0, 'Health', this.text_style)
		this.health_label.setTextBounds(x, y, 200, 40)
		this.health_label.fixedToCamera = true

		this.update()
	}

	// Redraw health bar
	update() {
		this.graphics.clear()

		this.graphics.beginFill(0x33ff33, 0.75)
		this.graphics.drawRect(0, 0, this.player.health * 2, 40)
		this.graphics.endFill()

		this.graphics.lineStyle(2, 0xffffff, 1)
		this.graphics.drawRect(0, 0, 200, 40)
	}
}