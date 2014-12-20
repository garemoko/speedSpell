//=========CONFIG PANEL============
var configPanelOpen = false,
queryStringParams = TinCan.Utils.parseURL(window.location.href).params,
tincan = null;

if (!$.isEmptyObject(queryStringParams)) {
	tincan = new TinCan (
	        {
	            url: window.location.href,
	            activity: ROOT_ACTIVITY,
	            context: {
	            	registration: queryStringParams.registration,
	            	platform: navigator.userAgent,
	            	context: { 
	            		contextActivities: {
	            			grouping: [
			            		ROOT_ACTIVITY
			            	]
			            }
			        }	            
	            }
	        }
	    );

	tincan.sendStatement({
		verb: {
			id: "http://adlnet.gov/expapi/verbs/initialized",
			display: {en: "initialized"}
		}
	})
}

$(document).ready(function(){
	setupConfigPanel();

	$('#toolbox .cog').click(function(){
		if (configPanelOpen){
			closeConfigPanel();
		} else{ 
			openConfigPanel();
		}
	});

	$('#toolbox .configpanel #new_learner_key').click(function(){
		$('#learner_key').val(TinCan.Utils.getUUID());
	});

	$('#toolbox .configpanel #new_registration').click(function(){
		$('#registration').val(TinCan.Utils.getUUID());
	})

	$('#toolbox .configpanel #save_config').click(function(){
		var thisURL = location.protocol + '//' + location.host + location.pathname, 
		querystringObj = {
			endpoint: $('#lrs_endpoint').val(),
			actor: JSON.stringify({ //TODO: this method is causing the actor name to have spaces replaced with +
				name: $('#learner_name').val(),
				account: {
					name: $('#learner_key').val(),
					homePage: thisURL
				}
			}),
			registration: $('#registration').val()
		};
		if ( (!$.isEmptyObject(queryStringParams)) && (queryStringParams.hasOwnProperty('auth')) && (queryStringParams.auth != '') ){
			querystringObj.auth = queryStringParams.auth;
		} else {
			querystringObj.auth = 'Basic ' + TinCan.Utils.getBase64String($('#lrs_key').val() + ':' + $('#lrs_secret').val());
		}
		window.location = thisURL + '?' + $.param(querystringObj);
	})

	$('#toolbox .configpanel #cancel').click(function(){
		closeConfigPanel();
	})
})

function closeConfigPanel(){
	$('#toolbox .configpanel').hide();
	$('.content').show();
	configPanelOpen = false;
	resetQuiz();
	$('#answer').focus();
}

function openConfigPanel(){
	$('#toolbox .configpanel').show();
	$('.content').hide();
	configPanelOpen = true;
}

function setupConfigPanel(){
	if ($.isEmptyObject(queryStringParams)) {
		$('#registration').val(TinCan.Utils.getUUID());
		$('.lrs_setting').show();
		$('.learner_setting').hide();
	} else {
		var learner= JSON.parse(queryStringParams.actor);
		if (learner.name == ""){
		$('#learner_key').val(TinCan.Utils.getUUID());
		$('#lrs_endpoint').val(queryStringParams.endpoint);
		$('#registration').val(queryStringParams.registration);
		$('.lrs_setting').hide();
		$('.learner_setting').show();
		openConfigPanel();
		} else {
			$('#lrs_endpoint').val(queryStringParams.endpoint);
			$('#learner_name').val(learner.name);
			$('#learner_key').val(learner.account.name);
			$('#registration').val(queryStringParams.registration);
			$('#toolbox .cog').hide();
		}
	}
}

//=========TINCAN FUNCTIONS========