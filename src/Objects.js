
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
		this.is_moving = true
		this.sprite.body.gravity.y = 1600
		this.sprite.body.velocity.x = 75

		// Load animations
		this.sprite.animations.add("walk_left", [0, 1, 2, 3, 4, 5], 10, true)
		this.sprite.animations.add("walk_right", [6, 7, 8, 9, 10, 11], 10, true)
		this.sprite.animations.add("idle", [12, 13, 14, 15, 16, 17], 5, true)

		this.sprite.animations.play("walk_left")
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

