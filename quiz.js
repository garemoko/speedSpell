Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

var refreshIntervalId, seconds = DURATION, score = 0, incorrect=0, processKeyup;

if (IGNORECASE){
	processKeyup = processKeyup_ignorecase;
} else {
	processKeyup = processKeyup_casesensitive;
}

$(document).ready(function(){
	$.each(WORDS, function( index, word ) {
		$('body').append('<audio id="audio-'+word+'" src="words/'+word+'.m4a" preload="auto"></audio>');
	});
	resetQuiz();
	$('#restart').click(resetQuiz);
	$('#answer').keyup(processKeyup);

})

function processKeyup_ignorecase (event) {
	var lentocompare = $('#answer').val().length,
	answerChar = $('#answer').attr('data-correctanswer').substring((lentocompare -1),lentocompare).toLowerCase(),
	responseChar = $('#answer').val().substring((lentocompare -1),lentocompare).toLowerCase(),
	word = $('#answer').attr('data-correctanswer');
	if (answerChar != responseChar) {
		//console.log({s:answerChar,a:responseChar});
		answerWrong(word);
		$('#answer').val('');
	}
	else {
		if ($('#answer').val().toLowerCase() == word.toLowerCase())
		{
			answerCorrect();
			resetQuestion();
		}
	}		
}

function processKeyup_casesensitive (event) {
	var lentocompare = $('#answer').val().length,
	answerChar = $('#answer').attr('data-correctanswer').substring((lentocompare -1),lentocompare),
	responseChar = $('#answer').val().substring((lentocompare -1),lentocompare),
	word = $('#answer').attr('data-correctanswer');
	if (answerChar != responseChar) {
		//console.log({s:answerChar,a:responseChar});
		answerWrong(word);
		$('#answer').val('');
	}
	else {
		if ($('#answer').val() == word)
		{
			answerCorrect();
			resetQuestion();
		}
	}
}

function resetQuestion(){
	var word = WORDS.randomElement();
	if (SHOWWORD){
		$('#question').text("Spell '" + word + "'");
	}
	else 
	{
		$('#question').text("Listen!");
	}
	$('#answer').attr('data-correctanswer', word);
	$('#answer').val('');
	$('#audio-' + word)[0].play();
	$('#answer').focus()
}

function resetQuiz(){
	resetQuestion();
	score = 0;
	incorrect = 0;
	seconds = DURATION;
	$('#score').html(score);
	$('#timer').html(seconds);
	$('#accuracy').html('');
	$('#feedback').hide();
	$('#quiz').show();
	refreshIntervalId = setInterval(tick, 1000);
}

function tick(){
	seconds--;
	$('#timer').html(seconds);
	
	if (seconds == 0){
		clearInterval(refreshIntervalId);
		$('body').css('background-color', '#333');
		$('#quiz').hide();
		$('#feedback').show();
	}
}


function calculateAnswer(question){
	var math = mathjs();
	return math.eval(question);
}

function answerCorrect(){
	$('body').css('background-color', '#22aa22');
	score++;
	$('#score').html(score);
	updateAccuracy();
}

function answerWrong(word){
	$('body').css('background-color', '#aa2222');
	$('#audio-' + word)[0].play();
	incorrect++;
	updateAccuracy();
	
}

function updateAccuracy(){
	var accuracyPerc = Math.round(score/(score+incorrect)*100)
	$('#accuracy').html(accuracyPerc + '%');
}