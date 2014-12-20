Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

var refreshIntervalId, seconds = DURATION, score = 0, incorrect=0, processKeyup, QUESTIONS=[];

if (IGNORECASE){
	processKeyup = processKeyup_ignorecase;
} else {
	processKeyup = processKeyup_casesensitive;
}

$(document).ready(function(){
	resetQuiz();
	$('#restart').click(resetQuiz);
	$('#answer').keyup(processKeyup);

})

function processKeyup(event){
	var ignoreCaseStr = $('#answer').attr('data-ignoreCase'),
	ignoreCaseBoo = IGNORECASE;

	if (ignoreCaseStr =="true"){
		ignoreCaseBoo = true;
	} else if (ignoreCaseStr =="false") {
		ignoreCaseBoo = false;
	}

	if (ignoreCaseBoo){
		processKeyup_ignorecase(event);
	} else  {
		processKeyup_casesensitive(event);
	}
}

function processKeyup_ignorecase (event) {
	var lentocompare = $('#answer').val().length,
	answerChar = $('#answer').attr('data-correctanswer').substring((lentocompare -1),lentocompare).toLowerCase(),
	responseChar = $('#answer').val().substring((lentocompare -1),lentocompare).toLowerCase(),
	correctAnswer = $('#answer').attr('data-correctanswer');
	if (answerChar != responseChar) {
		answerWrong(correctAnswer);
		$('#answer').val('');
	}
	else {
		if ($('#answer').val().toLowerCase() == correctAnswer.toLowerCase())
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
	correctAnswer = $('#answer').attr('data-correctanswer');
	if (answerChar != responseChar) {
		answerWrong(correctAnswer);
		$('#answer').val('');
	}
	else {
		if ($('#answer').val() == correctAnswer)
		{
			answerCorrect();
			resetQuestion();
		}
	}
}

function resetQuestion(){
	var question = QUESTIONS.randomElement();
	$('#question').text(question.text);
	$('#answer').attr('data-correctanswer', question.correctResponses[0]); //TODO: handle multiple right answers
	$('#answer').attr('data-ignoreCase', question.ignoreCase);
	$('#answer').val('');
	if (question.hasOwnProperty('audio')) {
		$('#audio-' + question.audio)[0].play();
	}
	$('#answer').focus()
}

function resetQuiz(){
	QUESTIONS = buildQuestionSet();
	$('audio').remove();
	$.each(QUESTIONS, function( index, question ) {
		if (question.hasOwnProperty('audio')) {
			$('body').append('<audio id="audio-'+question.audio+'" src="words/'+question.audio+AUDIO_EXT+'" preload="auto"></audio>');
		}
	});
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

function answerCorrect(){
	$('body').css('background-color', '#22aa22');
	score++;
	$('#score').html(score);
	updateAccuracy();
}

function answerWrong(word){
	$('body').css('background-color', '#aa2222');
	var matchingAudio = $('#audio-' + word);
	if (matchingAudio.length > 0) {
		matchingAudio[0].play();
	} 
	incorrect++;
	updateAccuracy();
	
}

function updateAccuracy(){
	var accuracyPerc = Math.round(score/(score+incorrect)*100)
	$('#accuracy').html(accuracyPerc + '%');
}