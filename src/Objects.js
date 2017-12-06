
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
		game.physics.arcade.enable(this.sprite)

		// Initialize properties
		this.health = 100
		this.base_speed = 75

		// Start in motion, with gravity
		this.is_moving = true
		this.sprite.body.gravity.y = 1600
		this.sprite.body.velocity.x = this.base_speed

		// Load animations
		// TODO: Make this more generic
		this.sprite.animations.add("walk_left", [0, 1, 2, 3, 4, 5], 10, true)
		this.sprite.animations.add("walk_right", [6, 7, 8, 9, 10, 11], 10, true)
		this.sprite.animations.add("idle", [12, 13, 14, 15, 16, 17], 5, true)

		this.sprite.animations.play("walk_left")
	}

	get is_moving() {
		return this._is_moving
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
		this._base_speed = new_value
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
		if ((this.sprite.body.blocked.left && this.sprite.body.velocity.x < 0) ||
			(this.sprite.body.blocked.right && this.sprite.body.velocity.x > 0)) {
			this.sprite.body.velocity.x *= -1
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

		// Build sprite
		this.sprite = game.add.sprite(x, y, image)
		this.sprite.entity = this

		this.sprite.anchor.set(0.5, 1)
		game.physics.arcade.enable(this.sprite)

		this.sprite.body.gravity.y = 1600

		// Initialize variables
		this.health = 100
		this.base_speed = 250
		this.jump_impulse = 700

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
		this._velocity_x(-1 * this.base_speed)
	}

	goRight() {
		this._velocity_x(this.base_speed)
	}

	jump() {
		this._velocity_y(-1 * this.jump_impulse)
	}

}