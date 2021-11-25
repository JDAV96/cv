const FADE_DURATION = 100;
var colors = ["green", "red", "yellow", "blue"];
var currentPattern = [];
var userPatternInput = [];
var currentLevel = 0;
var sequencePresentationInProgress = false;

function nextSequence()
{
  var nextColor = colors[Math.floor((Math.random() * 4))]
  currentPattern.push(nextColor);
  sequencePresentationInProgress = true;
  presentNextInSequence(0);
}

function presentNextInSequence(index)
{
  if (index < currentPattern.length)
  {
    animateAndSound(currentPattern[index], () =>
    {
      presentNextInSequence(++index);
    });
  }
  else
  {
    sequencePresentationInProgress = false;
  }
}

function advanceLevel()
{
  userPatternInput = [];
  $(".main-title").text("Level " + ++currentLevel);
  nextSequence();
}

function checkAnswer()
{
  for (var i = 0; i < userPatternInput.length; i++)
  {
    if (userPatternInput[i] !== currentPattern[i])
    {
      endGame();
      return;
    }
  }

  if (userPatternInput.length === currentPattern.length)
  {
    setTimeout(advanceLevel, FADE_DURATION * 4);
  }

}

function animateButton(buttonIdentifier)
{
  $("#" + buttonIdentifier).fadeOut(FADE_DURATION).fadeIn(FADE_DURATION);
}

function playSound(soundColor)
{
  var audio = new Audio("sounds/" + soundColor + ".mp3");
  audio.play();
}

function animateAndSound(buttonColor, cb)
{
  animateButton(buttonColor);
  playSound(buttonColor);
  setTimeout(cb, FADE_DURATION * 4);
}

function animateAndSoundPress(buttonColor)
{
  playSound(buttonColor);
  $("#" + buttonColor).addClass("pressed");
  setTimeout(() => {$("#" + buttonColor).removeClass("pressed");}, FADE_DURATION);
}

function endGame()
{
  var audio = new Audio("sounds/wrong.mp3");
  audio.play();
  $("body").addClass("game-over");
  setTimeout(() => {$("body").removeClass("game-over");}, FADE_DURATION * 2);
  currentLevel = 0;
  currentPattern = [];
  userPatternInput = [];
  $(".main-title").text("Game Over \n Press any key to play again!");
}

$(".btn").click((e) =>
{
  if (currentLevel > 0 && sequencePresentationInProgress === false)
  {
    var buttonClicked = e.target.id;
    animateAndSoundPress(buttonClicked);
    userPatternInput.push(buttonClicked);
    checkAnswer();
  }
});

$(document).keydown((e) =>
{
  if(currentLevel < 1)
  {
    advanceLevel();
  }
})
