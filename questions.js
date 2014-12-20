var questionList = []; 

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function buildQuestionSet(){
	//=============Spellings==========
	var WORDS = [
		"I",
		"up",
		"look",
		"we",
		"like",
		"and",
		"on",
		"at",
		"for",
		"he",
		"is",
		"said",
	],
	IGNORECASE_SPELLINGS = IGNORECASE,
	SHOWWORD=false,
	MAXSPELLS=20;

	$.each(WORDS, function(index, word){
		if (index == MAXSPELLS){
			return false;
		}
		var question = {
			id: 'spelling_' + word,
			audio: word,
			correctResponses: [word],
			ignoreCase: IGNORECASE_SPELLINGS
		};
		if (SHOWWORD) {
			question.text = "Spell" + word;
		} else {
			question.text = "Listen!";
		}
		questionList.push(question);
	});

	//=============Maths==========

	var mathQuestions = [],
	MAXSUMS = 20;
	//add a number between 0 and 2 to a number between 1 and 10
	mathQuestions.push.apply(mathQuestions,generateQuestions(10,0,2,0,10,['+']));
	//Add two equal numbers between 0 and 10 together
	mathQuestions.push.apply(mathQuestions,generateQuestions(10,0,10,0,0,['+']));

	mathQuestions = shuffle(mathQuestions);

	$.each(mathQuestions, function(index, sum){
		if (index == MAXSUMS){
			return false;
		}
		var question = {
			id: 'math_' + sum,
			correctResponses: [calculateAnswer(sum)],
			text: (sum.replace('*','x') + '='),
			sum: sum
		};
		questionList.push(question);
	});


	//generate an array of sums within specified parameters
	//TODO: ensure this works for all operands
	function generateQuestions(maxX,minX,maxY,minY,maxDiff,operands)
	{
		var rtnQuestions = [];
		for (var x=minX;x<=maxX;x++)
		{ 
			for (var y=minY;y<=maxY;y++)
			{
				for (var o=0;o<operands.length;o++)
				{
					if (getDiff(x,y) <= maxDiff)
					{
						//shuffle order
						if ((Math.random() < 0.5) == 1)
						{
							rtnQuestions.push(x + operands[o] + y);
						}
						else
						{
							rtnQuestions.push(y + operands[o] + x);
						}
					}
				}
			}
		}
		
		return rtnQuestions; 
	}

	function getDiff(num1, num2){
	  if (num1 > num2) {
	    return num1-num2;
		}
	  else {
	    return num2-num1;
		}
	}

	//calculate the answer to a sum
	function calculateAnswer(question){
		var math = mathjs();
		return math.eval(question);
	}


	//=============General Knowledge==========

	//push any bespoke questions to questionList here

	// RETURN THE FULL LIST
	return questionList;
}
