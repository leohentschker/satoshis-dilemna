pragma solidity ^0.4.4;

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract SatoshisDilemna {

	struct Game {
		bytes32 user1SubmissionHash;
		bytes32 user2SubmissionHash;
		uint256 value;
		uint256 timestamp;
		bool finished;
	}

	mapping (string => Game) games;

	function setSubmissionHash(string gameID, bytes32 submissionHash) payable returns(bool success) {

		// get the associated game
		Game memory game = games[gameID];

		// set the timestamp
		if (game.timestamp == 0) {
			game.timestamp = now;
		}

		// set the value of the game
		if (game.value == 0) {
			game.value = msg.value;
		} else {
			require(msg.value >= game.value);
		}

		// set on of the submission hashes and return
		if (game.user1SubmissionHash == '') {
			game.user1SubmissionHash == submissionHash;
			return true;
		}
		if (game.user2SubmissionHash == '') {
			game.user1SubmissionHash == submissionHash;
			return true;
		}

		// error if the game is already done
		return false;
	}

	function finishGame(string gameID, address user1, string user1Action, address user2, string user2Action)
	{
		Game memory game = games[gameID];
		require(!game.finished);

		game.finished = true;

		// use a zksnark to prove we know the correct result
		require(
			sha256(gameID, user1, user1Action) == game.user1SubmissionHash &&
			sha256(gameID, user2, user2Action) == game.user1SubmissionHash
		);

		if (sha256(user1Action) == sha256("betray")) {

			if (sha256(user2Action) == sha256("collude")) {
				user1.transfer(game.value);
			}
		} else {

			if (sha256(user2Action) == sha256("collude")) {
				user1.transfer(game.value / 2);
				user2.transfer(game.value / 2);
			} else {
				user2.transfer(game.value);
			}
		}
	}
}
