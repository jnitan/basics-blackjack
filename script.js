// ====== Blackjack game set-up ======
// 1. create a game where the the deck is shuffled, player clicks submits to deal the cards, determine winner
// 2. allow player to hit or stand
// 3. allow computer/dealer to hit or stand based on game rules
// 4. variable value of Ace - 1 or 11
// 5. ends the game or continues

// ====== First version ======
// 1. define player and dealer
// 2. create and shuffle a game deck
// 3. draw 2 cards for player and dealer respectively
// 4. win conditions
//    -- blackjack
//    -- higher hand value
// 5. display hands of both players and dealer and declare winner

// ====== Second version ======
// 1. extra game mode 'hit or stand'
// 2. function for player to input hit or stand

// ====== Third version ======
// 1. Dealer to hit or stand only after player choose to stand
// 2. If dealer hand value is < 17, dealer hits
// 3. If dealer hand value is > 17, dealer stand

// ====== Forth version ======
// 1. If totalHandValue, including an ace, is < 21, ace value is 11
// 2. When totalHandValue, including an ace, is > 21, ace value is 1

/* ====== ====== GLOBAL VARIABLES ====== ====== */

// Declare game modes
var Game_Start = "game start";
var Game_Cards_Drawn = "cards drawn";
var Game_Results_Shown = "results shown";
var Game_Hit_Or_Stand = "hit or stand";
var currentGameMode = Game_Start;

// Declare variables to store player and dealer hands using arrays
var playerHand = [];
var dealerHand = [];

// Declare variable to hold deck of cards
var gameDeck = "empty at the start";

/* ====== ====== CARD DECK GENERATION CODE ====== ====== */
var createDeck = function () {
  // Empty deck array
  var cardDeck = [];
  // Initialise an array of the 4 suits in the deck.
  var suits = ["♢", "♣️", "♡", "♠️"];
  // Use 'while loop' to create card suits
  var suitsIndex = 0;
  while (suitsIndex < suits.length) {
    var currentSuit = suits[suitsIndex];
    // Loop from 1 to 13 to create all cards for a given suit
    var rankCounter = 1;
    while (rankCounter <= 13) {
      var cardName = rankCounter;
      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name

      if (cardName == 1) {
        cardName = "Ace";
      } else if (cardName == 11) {
        cardName = "Jack";
      } else if (cardName == 12) {
        cardName = "Queen";
      } else if (cardName == 13) {
        cardName = "King";
      }
      // Create a new card with the current name, suit and rank
      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };
      // Add new card to the deck
      cardDeck.push(card);
      // Increase rankCounter to interate over the next rank
      rankCounter += 1;
    }
    // Increase the suit index to iterate over the next suit
    suitsIndex += 1;
  }
  // Return the complete card deck
  return cardDeck;
};

// Get a random index ranging from 0 (inclusive) to max (exclusive).
var getRandomIndex = function (size) {
  return Math.floor(Math.random() * size);
};

// Shuffle the elements in the cardDeck array
var shuffleCards = function (cards) {
  // Loop over the card deck array once
  var currentIndex = 0;
  while (currentIndex < cards.length) {
    // Select a random index in the deck
    var randomIndex = getRandomIndex(cards.length);
    // Select the card that corresponds to randomIndex
    var randomCard = cards[randomIndex];
    // Select the card that corresponds to currentIndex
    var currentCard = cards[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
    // Increment currentIndex
    currentIndex = currentIndex + 1;
  }
  // Return the shuffled deck
  return cards;
};

// Shuffle a new deck
var createNewDeck = function () {
  var newDeck = createDeck();
  var shuffledDeck = shuffleCards(newDeck);
  return shuffledDeck;
};

/* ====== ====== CHECK FOR WINNING CONDITIONS ====== ====== */
// Checks for Blackjack
var checkForBlackjack = function (handArray) {
  var playerCardOne = handArray[0];
  var playerCardTwo = handArray[1];
  var isBlackjack = false;

  // If there is a Blackjack, return true
  // 1st card Ace, 2nd card 10 or picture cards
  // 2nd card 10 or picture cards, 2nd card Ace
  if (
    (playerCardOne.name == "Ace" && playerCardTwo.rank >= 10) ||
    (playerCardOne.rank >= 10 && playerCardTwo.name == "Ace")
  ) {
    isBlackjack = true;
  }
  return isBlackjack;
};

// Calculates a hand
var calculateTotalHandValue = function (handArray) {
  var totalHandValue = 0;
  var aceCounter = 0;
  var index = 0;
  while (index < handArray.length) {
    var currentCard = handArray[index];
    // value of king, queen and jack = 10
    if (
      currentCard.name === "Jack" ||
      currentCard.name === "Queen" ||
      currentCard.name === "King"
    ) {
      totalHandValue = totalHandValue + 10;
    } else if (currentCard.name == "Ace") {
      totalHandValue = totalHandValue + 11;
      aceCounter = aceCounter + 1;
    } else {
      totalHandValue = totalHandValue + currentCard.rank;
    }
    index = index + 1;
  }
  index = 0;
  while (index < aceCounter) {
    if (totalHandValue > 21) {
      totalHandValue = totalHandValue - 10;
    }
    index = index + 1;
  }
  return totalHandValue;
};

// Displays the player and dealer hands in a message
var displayPlayerAndDealerHands = function (playerHandArray, dealerHandArray) {
  // Player hand
  var playerMessage = `Player Hand: <br>`;
  var index = 0;
  while (index < playerHandArray.length) {
    playerMessage = `${playerMessage} - ${playerHandArray[index].name} of ${playerHandArray[index].suit} <br>`;
    index = index + 1;
  }

  // Dealer hand
  var dealerMessage = `Dealer Hand: <br>`;
  var index = 0;
  while (index < dealerHandArray.length) {
    dealerMessage = `${dealerMessage} - ${dealerHandArray[index].name} of ${dealerHandArray[index].suit} <br>`;
    index = index + 1;
  }
  return playerMessage + "<br>" + dealerMessage;
};

// Displays the total hand value of the player and the dealer
var displayHandTotalValues = function (playerHandValue, dealerHandValue) {
  var totalHandValueMessage = `<br>Player total hand value: ${playerHandValue} <br>Dealer total hand value: ${dealerHandValue}`;
  return totalHandValueMessage;
};

/* ====== ====== MAIN FUNCTIONS ====== ====== */
var main = function (input) {
  var outputMessage = "";
  // First click
  if (currentGameMode == Game_Start) {
    // create the game deck
    gameDeck = createNewDeck();
    console.log(gameDeck);

    // Deal 2 cards to player and dealer respectively
    playerHand.push(gameDeck.pop());
    playerHand.push(gameDeck.pop());
    dealerHand.push(gameDeck.pop());
    dealerHand.push(gameDeck.pop());

    console.log("player hand ==> ");
    console.log(playerHand);
    console.log("dealer hand ==> ");
    console.log(dealerHand);
    // progress to next state of the game
    currentGameMode = Game_Cards_Drawn;

    // write and return the appropriate output message
    outputMessage = `Everyone has been dealt a card. Click the "Submit" button to evaluate the cards!`;

    return outputMessage;
  }
  // Second click
  if (currentGameMode == Game_Cards_Drawn) {
    // check for blackjack
    // playerHand = [{ name: "Queen", suit: "Clubs", rank: 12 },{ name: "Ace", suit: "Diamonds", rank: 1 },];
    // dealerHand = [{ name: "Ace", suit: "Clubs", rank: 1 },{ name: 10, suit: "Spades", rank: 10 },];
    var playerHasBlackjack = checkForBlackjack(playerHand);
    var dealerHasBlackjack = checkForBlackjack(dealerHand);
    // console.log("Does Player have Blackjack? ==?", playerHasBlackjack);
    // console.log("Does Dealer have Blackjack? ==?", dealerHasBlackjack);

    if (playerHasBlackjack == true || dealerHasBlackjack == true) {
      // both player and dealer has blackjack -> tie
      if (playerHasBlackjack == true && dealerHasBlackjack == true) {
        outputMessage = `It's a tie! Enter 'hit' to draw another card or 'stand' to end the game. <br><br>${displayPlayerAndDealerHands(
          playerHand,
          dealerHand
        )} ${displayHandTotalValues(
          playerHandTotalValue,
          dealerHandTotalValue
        )}`;
        // only player has blackjack -> player wins
      } else if (playerHasBlackjack == true && dealerHasBlackjack == false) {
        outputMessage = `Horray 🎉 You won this round! Enter 'hit' to draw another card or 'stand' to end the game. <br><br>${displayPlayerAndDealerHands(
          playerHand,
          dealerHand
        )} ${displayHandTotalValues(
          playerHandTotalValue,
          dealerHandTotalValue
        )}`;
        // only dealer has blackjack -> dealer wins
      } else {
        outputMessage = `Too bad 😛 The dealer won this round! Enter 'hit' to draw another card or 'stand' to end the game. <br><br>${displayPlayerAndDealerHands(
          playerHand,
          dealerHand
        )} ${displayHandTotalValues(
          playerHandTotalValue,
          dealerHandTotalValue
        )}`;
      }
      console.log(outputMessage);
    } else {
      outputMessage = "Oh no! There is no Blackjack!";
      console.log(outputMessage);
      // no blackjack -> game continues

      var playerHandTotalValue = calculateTotalHandValue(playerHand);
      var dealerHandTotalValue = calculateTotalHandValue(dealerHand);

      console.log("Player total hand value ==?", playerHandTotalValue);
      console.log("Dealer total hand value ==?", dealerHandTotalValue);

      // compare total hand value
      // same value -> tie
      if (playerHandTotalValue === dealerHandTotalValue) {
        outputMessage = `It's a tie! Enter 'hit' to draw another card or 'stand' to end the game. <br><br>${displayPlayerAndDealerHands(
          playerHand,
          dealerHand
        )} ${displayHandTotalValues(
          playerHandTotalValue,
          dealerHandTotalValue
        )}`;
      }
      // player higher value -> player wins
      else if (playerHandTotalValue > dealerHandTotalValue) {
        outputMessage = `Horray 🎉 You won this round! Enter 'hit' to draw another card or 'stand' to end the game. <br><br>${displayPlayerAndDealerHands(
          playerHand,
          dealerHand
        )} ${displayHandTotalValues(
          playerHandTotalValue,
          dealerHandTotalValue
        )}`;
      }
      // dealer higher value -> dealer wins
      else {
        outputMessage = `Too bad 😛 The dealer won this round! Enter 'hit' to draw another card or 'stand' to end the game. <br><br>${displayPlayerAndDealerHands(
          playerHand,
          dealerHand
        )} ${displayHandTotalValues(
          playerHandTotalValue,
          dealerHandTotalValue
        )}`;
      }
      // change game mode
      currentGameMode = Game_Hit_Or_Stand;

      return outputMessage;
    }
  }
  // Function for Hit or Stand
  if ((currentGameMode = Game_Hit_Or_Stand)) {
    // Player Hit
    if (input == "hit") {
      playerHand.push(gameDeck.pop());
      playerHandTotalValue = calculateTotalHandValue(playerHand);
      dealerHandTotalValue = calculateTotalHandValue(dealerHand);
      outputMessage = `${displayPlayerAndDealerHands(
        playerHand,
        dealerHand
      )} <br>You drew another card. Total hand value now is: <br>${displayHandTotalValues(
        playerHandTotalValue,
        dealerHandTotalValue
      )} <br><br>Enter 'hit' to draw another card or 'stand' to end the game.`;
    }
    // Player Stand
    else if (input == "stand") {
      var playerHandTotalValue = calculateTotalHandValue(playerHand);
      var dealerHandTotalValue = calculateTotalHandValue(dealerHand);

      while (dealerHandTotalValue < 17) {
        dealerHand.push(gameDeck.pop());
        dealerHandTotalValue = calculateTotalHandValue(dealerHand);
      }

      // compare total hand value
      // same value -> tie
      if (playerHandTotalValue === dealerHandTotalValue) {
        outputMessage = `It's a tie! Try again. <br><br>${displayPlayerAndDealerHands(
          playerHand,
          dealerHand
        )} ${displayHandTotalValues(
          playerHandTotalValue,
          dealerHandTotalValue
        )}`;
      }
      // player higher value -> player wins
      else if (playerHandTotalValue > dealerHandTotalValue) {
        outputMessage = `Horray 🎉 You won! <br><br>${displayPlayerAndDealerHands(
          playerHand,
          dealerHand
        )} ${displayHandTotalValues(
          playerHandTotalValue,
          dealerHandTotalValue
        )}`;
      }
      // dealer higher value -> dealer wins
      else {
        outputMessage = `Too bad 😛 The dealer won! <br><br>${displayPlayerAndDealerHands(
          playerHand,
          dealerHand
        )} ${displayHandTotalValues(
          playerHandTotalValue,
          dealerHandTotalValue
        )}`;
      }
    }
    //input validation
    else {
      outputMessage = `Wrong input. Please enter only 'hit' or 'stand'. <br><br>${displayPlayerAndDealerHands(
        playerHand,
        dealerHand
      )}`;
    }
    return outputMessage;
  }
};
