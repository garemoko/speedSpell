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

	//we don't want tincanjs to pass 'lockedConfig' or any other addiitonal qs parameters to the LRS
	tincan.recordStores[0].extended = null;

	tincan.sendStatement({
		verb: {
			id: "http://adlnet.gov/expapi/verbs/initialized",
			display: {en: "initialized"}
		}
	})
}

$(document).ready(function(){
	$('#learner_key').val(TinCan.Utils.getUUID());
	$('#registration').val(TinCan.Utils.getUUID());

	processQueryString();

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
			actor: JSON.stringify({
				name: $('#learner_name').val(),
				account: {
					name: $('#learner_key').val(),
					homePage: thisURL
				}
			}),
			registration: $('#registration').val(),
			lockedConfig: $('#lock_settings').is(':checked')
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
	$('#lrs_endpoint').focus();
}

function processQueryString(){
	if (!$.isEmptyObject(queryStringParams)) {
		var learner= JSON.parse(queryStringParams.actor)
		if (queryStringParams.lockedConfig == "true"){
			$('#toolbox .cog').hide();
		}
		$('#lrs_endpoint').val(queryStringParams.endpoint);
		$('#learner_name').val(learner.name);
		$('#learner_key').val(learner.account.name);
		$('#registration').val(queryStringParams.registration);
		if (queryStringParams.auth != ""){
			$('#lrs_key, #lrs_secret, #lrs_endpoint').prop('disabled', true);
			$('#lrs_key, #lrs_secret').val("*****");
		}
	}
}

//=========TINCAN FUNCTIONS========